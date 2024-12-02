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
        const response = await fetch('/api/demos');
        const data = await response.json();
        setDemos(data);
      } catch (error) {
        console.error('Error fetching demos:', error);
      }
    };

    fetchDemos();
  }, []);

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
        {demos.map((demo) => (
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
        ))}
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
                ✕
              </button>
            </div>
            <iframe
              src={selectedDemo.url}
              className={styles.demoFrame}
              title={selectedDemo.title}
              sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
            />
          </div>
        </div>
      )}
    </main>
  );
}
