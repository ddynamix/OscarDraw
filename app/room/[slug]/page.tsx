'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams, useSearchParams } from 'next/navigation';
import Link from 'next/link';

export default function RoomPage() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  
  const slug = params.slug as string;
  const name = searchParams.get('name') || '';
  const password = searchParams.get('password') || '';
  
  // Determine if user is a host (no name parameter) or joining (has name parameter)
  const isHost = !name;
  
  const [participants, setParticipants] = useState<string[]>([]);
  const [films, setFilms] = useState<string[]>([]);
  const [newParticipant, setNewParticipant] = useState('');
  const [newFilm, setNewFilm] = useState('');
  const [assignmentResult, setAssignmentResult] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Function to add a participant
  async function addParticipant(e: React.FormEvent) {
    e.preventDefault();
    if (!newParticipant.trim()) return;
    
    setIsLoading(true);
    setError('');
    
    try {
      const response = await fetch(`/api/room/${slug}/add`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          password,
          participants: [newParticipant]
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to add participant');
      }

      setParticipants([...participants, newParticipant]);
      setNewParticipant('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  }

  // Function to add a film
  async function addFilm(e: React.FormEvent) {
    e.preventDefault();
    if (!newFilm.trim()) return;
    
    setIsLoading(true);
    setError('');
    
    try {
      const response = await fetch(`/api/room/${slug}/add`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          password,
          films: [newFilm]
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to add film');
      }

      setFilms([...films, newFilm]);
      setNewFilm('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  }

  // Function to assign films to participants
  async function assignFilms() {
    if (films.length < participants.length) {
      setError('Not enough films for all participants');
      return;
    }
    
    setIsLoading(true);
    setError('');
    
    try {
      const response = await fetch(`/api/room/${slug}/assign`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to assign films');
      }

      setAssignmentResult('Films have been assigned!');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  }

  // Function to reveal assigned film
  async function revealFilm() {
    if (!name) {
      setError('Please enter your name to reveal your film');
      return;
    }
    
    setIsLoading(true);
    setError('');
    
    try {
      const response = await fetch(`/api/room/${slug}/reveal?name=${encodeURIComponent(name)}&password=${encodeURIComponent(password)}`);

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to reveal film');
      }

      const data = await response.json();
      setAssignmentResult(`Your assigned film is: ${data.film}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div>
      <h1>Room: {slug}</h1>
      
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {assignmentResult && <p style={{ color: 'green' }}>{assignmentResult}</p>}
      
      <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
        {/* Participants Section */}
        <div style={{ flex: 1, minWidth: '300px' }}>
          <h2>Participants</h2>
          <ul>
            {participants.map((p, i) => (
              <li key={i}>{p}</li>
            ))}
          </ul>
          
          {isHost && (
            <form onSubmit={addParticipant}>
              <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
                <input
                  type="text"
                  value={newParticipant}
                  onChange={(e) => setNewParticipant(e.target.value)}
                  placeholder="Add participant"
                  style={{
                    flex: 1,
                    padding: '0.5rem',
                    borderRadius: '4px',
                    border: '1px solid #ccc',
                    background: '#333',
                    color: 'white',
                  }}
                />
                <button
                  type="submit"
                  disabled={isLoading}
                  style={{
                    padding: '0.5rem 1rem',
                    borderRadius: 4,
                    border: 'none',
                    cursor: isLoading ? 'not-allowed' : 'pointer',
                    background: '#e50914',
                    color: 'white',
                  }}
                >
                  Add
                </button>
              </div>
            </form>
          )}
        </div>
        
        {/* Films Section */}

        <div style={{ flex: 1, minWidth: '300px' }}>
          <h2>Films</h2>
          <ul>
            {films.map((f, i) => (
              <li key={i}>{f}</li>
            ))}
          </ul>
          
          {isHost && (
            <form onSubmit={addFilm}>
              <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
                <input
                  type="text"
                  value={newFilm}
                  onChange={(e) => setNewFilm(e.target.value)}
                  placeholder="Add film"
                  style={{
                    flex: 1,
                    padding: '0.5rem',
                    borderRadius: '4px',
                    border: '1px solid #ccc',
                    background: '#333',
                    color: 'white',
                  }}
                />
                <button
                  type="submit"
                  disabled={isLoading}
                  style={{
                    padding: '0.5rem 1rem',
                    borderRadius: 4,
                    border: 'none',
                    cursor: isLoading ? 'not-allowed' : 'pointer',
                    background: '#e50914',
                    color: 'white',
                  }}
                >
                  Add
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
      
      <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
        {isHost && (
          <button
            onClick={assignFilms}
            disabled={isLoading || films.length < participants.length}
            style={{
              padding: '0.75rem 1.25rem',
              fontSize: '1rem',
              borderRadius: 8,
              border: 'none',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              background: '#e50914',
              color: 'white',
              opacity: (isLoading || films.length < participants.length) ? 0.7 : 1,
            }}
          >
            Assign Films
          </button>
        )}
        
        <button
          onClick={revealFilm}
          disabled={isLoading || !name}
          style={{
            padding: '0.75rem 1.25rem',
            fontSize: '1rem',
            borderRadius: 8,
            border: 'none',
            cursor: isLoading ? 'not-allowed' : 'pointer',
            background: '#333',
            color: 'white',
            opacity: (isLoading || !name) ? 0.7 : 1,
          }}
        >
          Reveal My Film
        </button>
        
        <Link href="/">
          <button
            style={{
              padding: '0.75rem 1.25rem',
              fontSize: '1rem',
              borderRadius: 8,
              border: 'none',
              cursor: 'pointer',
              background: '#222',
              color: 'white',
            }}
          >
            Back to Home
          </button>
        </Link>
      </div>
    </div>
  );
}