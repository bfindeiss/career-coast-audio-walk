/**
 * Automatic Audio Generator for "Career Coast Soundwalk"
 * ------------------------------------------------------
 * - Reads: ./stops-content.json  (full story texts)
 * - Reads: ./stops.json          (metadata & filenames)
 * - Uses OpenAI TTS ("alloy" voice)
 * - Outputs MP3s to ./public/audio/
 *
 * Run:
 *   OPENAI_API_KEY=yourkey node generate-audio.js
 */

import fs from "fs";
import path from "path";
import OpenAI from "openai";

const CONTENT_FILE = "./stops-content.json";
const META_FILE = "./stops.json";
const OUTPUT_DIR = "./public/audio";
const MODEL = "gpt-4o-mini-tts";
const DEFAULT_VOICE = "alloy";

async function main() {
  // Ensure output directory exists
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  // Load JSON
  const stories = JSON.parse(fs.readFileSync(CONTENT_FILE, "utf-8"));
  const meta = JSON.parse(fs.readFileSync(META_FILE, "utf-8"));

  const metaById = {};
  meta.forEach(m => { metaById[m.id] = m; });

  const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  console.log("🔊 Generating audio files...\n");

  for (const story of stories) {
    const id = story.id;
    const text = story.fullText;

    if (!metaById[id]) {
      console.warn(`⚠️ Missing meta entry for ${id}. Skipping.`);
      continue;
    }

    const outFile = metaById[id].suggestedFileName || `career-coast-${id}.mp3`;
    const targetPath = path.join(OUTPUT_DIR, outFile);

    console.log(`🎙️  Generating ${outFile} ...`);

    try {
      const mp3 = await client.audio.speech.create({
        model: MODEL,
        voice: DEFAULT_VOICE,
        input: text,
        format: "mp3",
      });

      const buffer = Buffer.from(await mp3.arrayBuffer());
      fs.writeFileSync(targetPath, buffer);

      console.log(`✅ Saved: ${targetPath}\n`);
    } catch (err) {
      console.error(`❌ Error generating ${id}:`, err.message);
    }
  }

  console.log("🎉 Done! All audio files generated.\n");
}

main();
