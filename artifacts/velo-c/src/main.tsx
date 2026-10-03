import { createRoot } from 'react-dom/client';
import React from 'react';

import App from './App';

import './index.css';

class AppErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean }
> {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: unknown) {
    console.error('Velo C UI error:', error);
  }

  render() {
    if (this.state.hasError) {
      return (
        <main className="min-h-[100dvh] grid place-items-center bg-white px-6 text-center">
          <section className="max-w-md">
            <div className="mb-5 text-5xl" aria-hidden="true">⚡</div>
            <h1 className="mb-3 text-2xl font-extrabold text-gray-900">Velo C needs a quick refresh</h1>
            <p className="mb-7 text-sm leading-relaxed text-gray-500">
              A temporary UI error occurred. Your content is safe — reload the page to continue.
            </p>
            <button
              type="button"
              className="rounded-full px-7 py-3 font-bold text-white"
              style={{ background: 'linear-gradient(135deg, #00f0ff, #a78bfa)' }}
              onClick={() => window.location.reload()}
            >
              Reload Velo C
            </button>
          </section>
        </main>
      );
    }
    return this.props.children;
  }
}

createRoot(document.getElementById('root')!).render(
  <AppErrorBoundary>
    <App />
  </AppErrorBoundary>,
);
