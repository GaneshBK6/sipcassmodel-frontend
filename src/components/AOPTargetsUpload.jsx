import React, { useState, useRef } from 'react';
import { uploadAOPTargetsExcel } from '../services/aopApi';

export default function AOPTargetsUpload({ onUploadSuccess }) {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null); // <-- ref to file input

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setError('');
  };

  const handleUpload = async () => {
    if (!file) {
      setError('Please select a file to upload.');
      return;
    }
    setUploading(true);
    setError('');
    try {
      await uploadAOPTargetsExcel(file);
      alert('Upload successful!');
      setFile(null);
      // Reset the actual file input's value to clear filename display
      if (fileInputRef.current) {
        fileInputRef.current.value = null;
      }
      if (onUploadSuccess) onUploadSuccess();
    } catch (err) {
      setError(err.response?.data?.error || 'Upload failed.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
      <input
        type="file"
        accept=".xlsx"
        onChange={handleFileChange}
        disabled={uploading}
        style={{ cursor: uploading ? 'not-allowed' : 'pointer' }}
        ref={fileInputRef} // <-- attach ref here
      />
      <button
        onClick={handleUpload}
        disabled={uploading}
        className="glass-button primary"
      >
        {uploading ? 'Uploading...' : 'Upload Excel'}
      </button>
      {error && (
        <span style={{ color: 'red', marginLeft: '1rem' }}>{error}</span>
      )}
    </div>
  );
}
