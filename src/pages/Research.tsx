import React from 'react';
import { Helmet } from 'react-helmet-async';

const Research: React.FC = () => {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <Helmet>
        <title>Research — Dario Amodei (Clone)</title>
        <meta name="description" content="Research publications and citations for Dario Amodei." />
        <link rel="canonical" href={typeof window !== 'undefined' ? window.location.href : '/research'} />
      </Helmet>

      <section className="container py-16 animate-fade-in">
        <article className="max-w-2xl space-y-6">
          <header>
            <h1 className="font-display text-4xl md:text-5xl font-bold tracking-tight">Research</h1>
            <p className="mt-2 text-muted-foreground">Selected publications and links.</p>
          </header>
          <p>
            For a comprehensive list of publications, visit the Google Scholar profile.
          </p>
          <p>
            <a className="link-underline" href="https://scholar.google.com/citations?user=6-e-ZBEAAAAJ&hl=en" target="_blank" rel="noreferrer">Google Scholar</a>
          </p>
        </article>
      </section>
    </main>
  );
};

export default Research;
