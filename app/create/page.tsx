'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function CreateRoomPage() {
  const router = useRouter();
  const [slug, setSlug] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/create-room', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug, password }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to create room');
      }

      router.push(`/room/${slug}?password=${encodeURIComponent(password)}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div>
      <h1>Create a Room</h1>
      
      {error && <p style={{ color: 'red' }}>{error}</p>}
      
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '1rem' }}>
          <label htmlFor="slug" style={{ display: 'block', marginBottom: '0.5rem' }}>
            Room Name:
          </label>
          <input
            id="slug"
            type="text"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            required
            style={{
              width: '100%',
              padding: '0.5rem',
              borderRadius: '4px',
              border: '1px solid #ccc',
              background: '#333',
              color: 'white',
            }}
          />
        </div>
        
        <div style={{ marginBottom: '1.5rem' }}>
          <label htmlFor="password" style={{ display: 'block', marginBottom: '0.5rem' }}>
            Password:
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{
              width: '100%',
              padding: '0.5rem',
              borderRadius: '4px',
              border: '1px solid #ccc',
              background: '#333',
              color: 'white',
            }}
          />
        </div>
        
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button
            type="submit"
            disabled={isLoading}
            style={{
              padding: '0.75rem 1.25rem',
              fontSize: '1rem',
              borderRadius: 8,
              border: 'none',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              background: '#e50914',
              color: 'white',
              opacity: isLoading ? 0.7 : 1,
            }}
          >
            {isLoading ? 'Creating...' : 'Create Room'}
          </button>
          
          <Link href="/">
            <button
              type="button"
              style={{
                padding: '0.75rem 1.25rem',
                fontSize: '1rem',
                borderRadius: 8,
                border: 'none',
                cursor: 'pointer',
                background: '#333',
                color: 'white',
              }}
            >
              Cancel
            </button>
          </Link>
        </div>
      </form>
    </div>
  );
}