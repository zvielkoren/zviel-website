'use client';

import { useEffect, useState } from 'react';
import styles from './demos.module.css';

interface Demo {
  id: string;
  title: string;
  description: string;
  url: string;
  imageUrl: string;
}

export default function DemosPage() {
  const [demos, setDemos] = useState<Demo[]>([]);
  const [selectedDemo, setSelectedDemo] = useState<Demo | null>(null);

  useEffect(() => {
    // In a real application, this would fetch from an API
    const fetchDemos = async () => {
      try {
        console.log('Fetching demos...'); // Log before fetching
        const response = await fetch('/api/demos');
        if (!response.ok) {
          throw new Error('Failed to fetch demos');
        }
        const data = await response.json();
        console.log('Fetched demos:', data); // Log the fetched data
        setDemos(data.demos);
        console.log('Demos state after setting:', data.demos); // Log the state after setting
      } catch (error) {
        console.error('Error fetching demos:', error);
      }
    };

    fetchDemos();
  }, []);

  useEffect(() => {
    console.log('Demos state updated:', demos);
  }, [demos]);

  const handleDemoClick = (demo: Demo) => {
    setSelectedDemo(demo);
  };

  const handleCloseViewer = () => {
    setSelectedDemo(null);
  };

  return (
    <main className={styles.main}>
      <h1 className={styles.title}>Demo Applications</h1>
      <div className={styles.demosGrid}>
        {Array.isArray(demos) && demos.length > 0 ? (
          demos.map((demo) => {
            console.log('Rendering demo:', demo); // Log each demo being rendered
            return (
              <div key={demo.id} className={styles.demoCard}>
                <img src={demo.imageUrl} alt={demo.title} className={styles.demoImage} />
                <h2>{demo.title}</h2>
                <p>{demo.description}</p>
                <div className={styles.demoActions}>
                  <button 
                    onClick={() => handleDemoClick(demo)} 
                    className={styles.viewButton}
                  >
                    View Demo
                  </button>
                  <a 
                    href={demo.url} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className={styles.openButton}
                  >
                    Open in New Tab
                  </a>
                </div>
              </div>
            );
          })
        ) : (
          <p>No demos available. Add a new demo to get started!</p>
        )}
      </div>

      {selectedDemo && (
        <div className={styles.demoViewer}>
          <div className={styles.demoViewerContent}>
            <div className={styles.demoViewerHeader}>
              <h2>{selectedDemo.title}</h2>
              <button 
                onClick={handleCloseViewer}
                className={styles.closeButton}
              >
                Close
              </button>
            </div>
            <p>{selectedDemo.description}</p>
          </div>
        </div>
      )}
    </main>
  );
}
