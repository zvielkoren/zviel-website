'use client';

import { useState, useEffect } from 'react';
import styles from './dashboard.module.css';

interface DemoFile {
  name: string;
  path: string;
}

interface Demo {
  id: string;
  title: string;
  description: string;
  url?: string;
  imageUrl?: string;
  fileType?: string;
  filePath?: string;
  features: string[];
  files: DemoFile[];
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
      setDemos(data.demos);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch demos');
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
      formDataToSend.append('title', formData.title);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('url', formData.url);
      formDataToSend.append('imageUrl', formData.imageUrl);
      
      formData.features.forEach(feature => {
        formDataToSend.append('features[]', feature);
      });

      formData.files.forEach(({ file }) => {
        formDataToSend.append('files[]', file);
      });

      const response = await fetch('/api/demos', {
        method: 'POST',
        body: formDataToSend,
      });

      if (!response.ok) {
        throw new Error('Failed to create demo');
      }

      // Reset form
      setFormData({
        title: '',
        description: '',
        url: '',
        imageUrl: '',
        files: [],
        features: []
      });
      setNewFeature('');

      // Refresh demos list
      fetchDemos();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create demo');
    }
  };

  const handleDeleteDemo = async (id: string) => {
    try {
      const response = await fetch(`/api/demos?id=${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete demo');
      }

      fetchDemos();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete demo');
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

  const handleRemoveFeature = (index: number) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index)
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      if (files.length === 0) {
        console.error("No files selected.");
        return; // Early return if no files are selected
      }
      const newFiles = Array.from(files).map(file => ({
        file,
        path: file.name
      }));
      setFormData(prev => ({
        ...prev,
        files: [...prev.files, ...newFiles]
      }));
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    if (files) {
      const newFiles = Array.from(files).map(file => ({
        file,
        path: file.name
      }));
      setFormData(prev => ({
        ...prev,
        files: [...prev.files, ...newFiles]
      }));
    }
  };

  return (
    <div className={styles.dashboard}>
      <div className={styles.addDemoForm}>
        <h2>Add New Demo</h2>
        <form onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label htmlFor="title">Title</label>
            <input
              type="text"
              id="title"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="url">URL (optional)</label>
            <input
              type="url"
              id="url"
              value={formData.url}
              onChange={(e) => setFormData(prev => ({ ...prev, url: e.target.value }))}
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="imageUrl">Image URL (optional)</label>
            <input
              type="url"
              id="imageUrl"
              value={formData.imageUrl}
              onChange={(e) => setFormData(prev => ({ ...prev, imageUrl: e.target.value }))}
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="files">Upload Files</label>
            <div
              className={styles.fileDropArea}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
            >
              <input
                type="file"
                id="files"
                multiple
                onChange={handleFileChange}
                style={{ display: 'none' }}
              />
              <p>Drag and drop files here or click to upload</p>
            </div>
            {formData.files.length > 0 && (
              <div className={styles.filesList}>
                <h4>Selected Files:</h4>
                <ul>
                  {formData.files.map((file, index) => (
                    <li key={index}>{file.file.name}</li>
                  ))}
                </ul>
              </div>
            )}
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
              <button type="button" onClick={handleAddFeature}>
                Add
              </button>
            </div>
            <div className={styles.featuresList}>
              {formData.features.map((feature, index) => (
                <div key={index} className={styles.featureTag}>
                  {feature}
                  <button
                    type="button"
                    onClick={() => handleRemoveFeature(index)}
                    className={styles.removeFeature}
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
                  <span className={styles.fileType}>Type: {demo.fileType}</span>
                </div>
              )}
              {demo.files && demo.files.length > 0 && (
                <div className={styles.filesList}>
                  <h4>Files:</h4>
                  <ul>
                    {demo.files.map((file, index) => (
                      <li key={index}>
                        <a href={file.path} target="_blank" rel="noopener noreferrer">
                          {file.name}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              <div className={styles.features}>
                <h4>Features:</h4>
                <div className={styles.featuresList}>
                  {demo.features.map((feature, index) => (
                    <span key={index} className={styles.featureTag}>
                      {feature}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
