'use client';

import { useState, useEffect } from 'react';
import styles from './dashboard.module.css';

interface Feature {
  id: string;
  name: string;
  isEnabled: boolean;
}

interface Demo {
  id: string;
  title: string;
  description: string;
  url?: string;
  imageUrl: string;
  fileType?: string;
  filePath?: string;
  features: Feature[];
  isActive: boolean;
}

interface CustomFileInputProps extends React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement> {
  directory?: string;
  webkitdirectory?: string;
}

function isFile(value: any): value is File {
  return typeof value === 'object' && 'File' in window && value instanceof window.File;
}

export default function DashboardPage() {
  const [demos, setDemos] = useState<Demo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    url: '',
    imageUrl: '',
    files: [] as { file: File; path: string }[],
    features: [] as string[]
  });
  const [newFeature, setNewFeature] = useState('');

  const fetchDemos = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/demos');
      if (!response.ok) {
        throw new Error('Failed to fetch demos');
      }
      const data = await response.json();
      setDemos(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      setDemos([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDemos();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const formDataToSend = new FormData();
      
      // Handle regular form fields
      Object.entries(formData).forEach(([key, value]) => {
        if (key === 'features') {
          formDataToSend.append(key, JSON.stringify(value));
        } else if (key !== 'files') {
          if (value !== null) {
            if (Array.isArray(value)) {
              formDataToSend.append(key, JSON.stringify(value));
            } else if (value && typeof value === 'object' && isFile(value)) {
              formDataToSend.append(key, value);
            } else {
              formDataToSend.append(key, String(value));
            }
          }
        }
      });

      // Handle files with their paths
      if (formData.files) {
        formData.files.forEach(({ file, path }) => {
          if (file && typeof file === 'object' && isFile(file)) {
            formDataToSend.append('files', file, path);
          }
        });
      }

      const response = await fetch('/api/demos', {
        method: 'POST',
        body: formDataToSend
      });

      if (response.ok) {
        setFormData({
          title: '',
          description: '',
          url: '',
          imageUrl: '',
          files: [],
          features: []
        });
        fetchDemos();
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to add demo');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      alert(error instanceof Error ? error.message : 'An error occurred');
    }
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const formDataToUpdate = { ...formData };
    
    // Handle both files and directories
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const relativePath = file.webkitRelativePath || file.name;
      
      formDataToUpdate.files = formDataToUpdate.files || [];
      formDataToUpdate.files.push({
        file,
        path: relativePath
      });
    }
    
    setFormData(formDataToUpdate);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleDeleteDemo = async (id: string) => {
    try {
      await fetch('/api/demos', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
      });
      fetchDemos();
    } catch (error) {
      console.error('Error deleting demo:', error);
    }
  };

  const handleAddFeature = () => {
    if (newFeature.trim()) {
      setFormData(prev => ({
        ...prev,
        features: [...prev.features, newFeature.trim()]
      }));
      setNewFeature('');
    }
  };

  const handleToggleFeature = async (demoId: string, featureId: string, isEnabled: boolean) => {
    try {
      await fetch('/api/demos/features', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: featureId, isEnabled: !isEnabled })
      });
      fetchDemos();
    } catch (error) {
      console.error('Error toggling feature:', error);
    }
  };

  const handleRunDemo = async (id: string) => {
    try {
      await fetch('/api/demos/run', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
      });
    } catch (error) {
      console.error('Error running demo:', error);
    }
  };

  const handleStopDemo = async (id: string) => {
    try {
      await fetch('/api/demos/run', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
      });
    } catch (error) {
      console.error('Error stopping demo:', error);
    }
  };

  return (
    <main className={styles.main}>
      <h1 className={styles.title}>Dashboard</h1>
      
      <div className={styles.container}>
        <h2>Add New Demo</h2>
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label htmlFor="title">Title</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="url">Demo URL (Optional if uploading file)</label>
            <input
              type="url"
              id="url"
              name="url"
              value={formData.url}
              onChange={handleChange}
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="file">Upload File(s) or Directory</label>
            <input
              type="file"
              id="file"
              onChange={handleFileSelect}
              multiple
              {...{
                directory: '',
                webkitdirectory: '',
                accept: '.js,.py,.ts'
              } as CustomFileInputProps}
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="imageUrl">Image URL</label>
            <input
              type="url"
              id="imageUrl"
              name="imageUrl"
              value={formData.imageUrl}
              onChange={handleChange}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label>Features</label>
            <div className={styles.featureInput}>
              <input
                type="text"
                value={newFeature}
                onChange={(e) => setNewFeature(e.target.value)}
                placeholder="Add a feature"
              />
              <button type="button" onClick={handleAddFeature}>Add</button>
            </div>
            <div className={styles.featureList}>
              {formData.features.map((feature, index) => (
                <div key={index} className={styles.featureTag}>
                  {feature}
                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({
                      ...prev,
                      features: prev.features.filter((_, i) => i !== index)
                    }))}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>

          <button type="submit" className={styles.submitButton}>
            Add Demo
          </button>
        </form>
      </div>

      <div className={styles.demosList}>
        <h2>Manage Demos</h2>
        {isLoading ? (
          <p>Loading demos...</p>
        ) : error ? (
          <p className={styles.error}>Error: {error}</p>
        ) : demos.length === 0 ? (
          <p>No demos available. Add a new demo to get started!</p>
        ) : (
          demos.map((demo) => (
            <div key={demo.id} className={styles.demoItem}>
              <div className={styles.demoHeader}>
                <h3>{demo.title}</h3>
                <button
                  onClick={() => handleDeleteDemo(demo.id)}
                  className={styles.deleteButton}
                >
                  Delete
                </button>
              </div>
              <p>{demo.description}</p>
              {demo.filePath && (
                <div className={styles.demoControls}>
                  <button onClick={() => handleRunDemo(demo.id)}>Run Demo</button>
                  <button onClick={() => handleStopDemo(demo.id)}>Stop Demo</button>
                  <span className={styles.fileType}>Type: {demo.fileType}</span>
                </div>
              )}
              <div className={styles.features}>
                <h4>Features:</h4>
                {demo.features.map((feature) => (
                  <div key={feature.id} className={styles.feature}>
                    <label>
                      <input
                        type="checkbox"
                        checked={feature.isEnabled}
                        onChange={() => handleToggleFeature(demo.id, feature.id, feature.isEnabled)}
                      />
                      {feature.name}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </main>
  );
}
