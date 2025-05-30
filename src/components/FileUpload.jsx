import { useState, useRef } from 'react';
import { uploadFile } from '../services/api';

export default function FileUpload({ onUploadSuccess }) {
  const [file, setFile] = useState(null);
  const [error, setError] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.name.endsWith('.xlsx')) {
      setFile(selectedFile);
      setError('');
    } else {
      setFile(null);
      setError('Please select a valid .xlsx file.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setError('Please select a file to upload.');
      return;
    }

    setIsUploading(true);
    setError('');

    try {
      console.log('Starting file upload...', file.name);
      const response = await uploadFile(file);
      console.log('Upload response:', response.data);
      
      if (response.data.success) {
        // Add slight delay to ensure backend processing completes
          onUploadSuccess(response.data);

      } else {
        throw new Error(response.data.error || 'Upload failed');
      }
    } catch (err) {
      console.error('Upload error:', err);
      setError(err.response?.data?.error || err.message || 'Upload failed. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="file-upload-container">
      <h3 className="upload-header">Upload SIP Payout File</h3>
      <form onSubmit={handleSubmit}>
        <input
          type="file"
          accept=".xlsx"
          onChange={handleFileChange}
          ref={fileInputRef}
          className="file-input"
        />
        <button
          type="submit"
          disabled={isUploading || !file}
          className="upload-button"
        >
          {isUploading ? 'Uploading...' : 'Upload File'}
        </button>
        {error && <div className="error-message">{error}</div>}
      </form>
    </div>
  );
}