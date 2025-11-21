import { useEffect, useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';

type Stop = {
  id: string;
  title: string;
  shortDescription: string;
  audioFile: string;
  transcript: string;
};

type StopsResponse = Stop[];

function useStops() {
  const [stops, setStops] = useState<Stop[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchStops() {
      try {
        const response = await fetch('/config/stops.json');
        if (!response.ok) {
          throw new Error('Unable to load stop data');
        }
        const data: StopsResponse = await response.json();
        setStops(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    }

    fetchStops();
  }, []);

  return { stops, loading, error };
}

function useRoute() {
  const [path, setPath] = useState(() => window.location.pathname);

  useEffect(() => {
    const handler = () => setPath(window.location.pathname);
    window.addEventListener('popstate', handler);
    return () => window.removeEventListener('popstate', handler);
  }, []);

  return path;
}

function Transcript({ transcript }: { transcript: string }) {
  const isLink = /^https?:\/\//i.test(transcript);

  return (
    <div className="transcript">
      <h2>Transcript</h2>
      <div className="transcript-body" aria-label="Stop transcript">
        {isLink ? (
          <p>
            The transcript is available at{' '}
            <a href={transcript} target="_blank" rel="noreferrer">
              {transcript}
            </a>
            .
          </p>
        ) : (
          <p>{transcript}</p>
        )}
      </div>
    </div>
  );
}

function StopDetail({ stop }: { stop: Stop }) {
  return (
    <main className="panel">
      <a className="back-link" href="/">← Back to overview</a>
      <header className="heading">
        <p className="eyebrow">Career Coast Soundwalk</p>
        <h1>{stop.title}</h1>
        <p className="muted">{stop.shortDescription}</p>
      </header>
      <section className="player-section">
        <audio controls preload="none" src={stop.audioFile} aria-label={`Audio for ${stop.title}`}>
          Your browser does not support the audio element.
        </audio>
      </section>
      <Transcript transcript={stop.transcript} />
      <footer className="ai-note">All stories, voices and code of this soundwalk were generated with AI.</footer>
    </main>
  );
}

function StopList({ stops }: { stops: Stop[] }) {
  const baseUrl = useMemo(() => {
    const url = new URL(import.meta.env.BASE_URL || '/', window.location.origin);
    return url.toString().replace(/\/$/, '');
  }, []);

  return (
    <main className="panel">
      <header className="heading">
        <p className="eyebrow">Soundwalk</p>
        <h1>Career Coast Soundwalk</h1>
        <p className="muted">
          Stroll along the shoreline and discover career stories waiting at each stop. Tap a stop to
          listen or copy the URL to generate a QR code.
        </p>
      </header>
      <ul className="stop-grid">
        {stops.map((stop) => {
          const stopUrl = `${baseUrl}/stop/${stop.id}`;
          return (
            <li key={stop.id} className="stop-card">
              <div className="stop-card__content">
                <h2>{stop.title}</h2>
                <p className="muted">{stop.shortDescription}</p>
                <div className="stop-card__actions">
                  <a className="primary-link" href={`/stop/${stop.id}`}>
                    Open stop
                  </a>
                  <div className="url-label" aria-label={`URL for ${stop.title}`}>
                    {stopUrl}
                  </div>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
      <footer className="ai-note">All stories, voices and code of this soundwalk were generated with AI.</footer>
    </main>
  );
}

function App() {
  const { stops, loading, error } = useStops();
  const path = useRoute();

  const stopId = useMemo(() => {
    const match = path.match(/^\/stop\/([^/]+)/);
    return match ? match[1] : null;
  }, [path]);

  const activeStop = useMemo(
    () => stops.find((stop) => stop.id === stopId) || null,
    [stopId, stops]
  );

  if (loading) {
    return (
      <div className="page-shell">
        <div className="panel">Loading soundwalk…</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page-shell">
        <div className="panel error">{error}</div>
      </div>
    );
  }

  return (
    <div className="page-shell">
      {stopId && activeStop ? <StopDetail stop={activeStop} /> : <StopList stops={stops} />}
      {stopId && !activeStop && <div className="panel error">Stop not found.</div>}
    </div>
  );
}

const rootElement = document.getElementById('root');
if (!rootElement) throw new Error('Root element not found');
const root = createRoot(rootElement);
root.render(<App />);

