// app/page.tsx
import Link from 'next/link';

export default function HomePage() {
  return (
      <div style={{ textAlign: 'center' }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>
          🍸 Oscars Drink Draw
        </h1>

        <p style={{ opacity: 0.8, marginBottom: '2rem' }}>
          Pull a movie from the hat. Make a drink. Guess the film.
        </p>

        <div
            style={{
              display: 'flex',
              gap: '1rem',
              justifyContent: 'center',
              flexWrap: 'wrap',
            }}
        >
          <Link href="/create">
            <button style={buttonStyle}>
              Create a Room
            </button>
          </Link>

          <Link href="/join">
            <button style={buttonStyle}>
              Join a Room
            </button>
          </Link>
        </div>
      </div>
  );
}

const buttonStyle: React.CSSProperties = {
  padding: '0.75rem 1.25rem',
  fontSize: '1rem',
  borderRadius: 8,
  border: 'none',
  cursor: 'pointer',
  background: '#e50914',
  color: 'white',
};
