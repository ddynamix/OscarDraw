// app/layout.tsx
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Oscars Drink Draw',
    description: 'Random film assignments for an Oscars watch party',
};

export default function RootLayout({
                                       children,
                                   }: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
        <body
            style={{
                margin: 0,
                fontFamily: 'system-ui, sans-serif',
                background: '#0f0f0f',
                color: '#f5f5f5',
            }}
        >
        <main
            style={{
                maxWidth: 720,
                margin: '0 auto',
                padding: '2rem 1rem',
            }}
        >
            {children}
        </main>
        </body>
        </html>
    );
}
