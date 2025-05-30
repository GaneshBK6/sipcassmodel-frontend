import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

export const uploadFile = (file) => {
  const formData = new FormData();
  formData.append('file', file);
  return axios.post(`${API_BASE}/upload/`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
};

const getCacheBustingParams = () => ({ _: Date.now() });

export const getRawData = (region = 'all') => {
  const params = { ...getCacheBustingParams() };
  if (region !== 'all') params.region = region;
  return axios.get(`${API_BASE}/raw-data`, { params })
    .then(response => ({
      data: {
        data: response.data.data || [],
        totals: response.data.totals || {}
      }
    }));
};

export const getSummary = (region = 'all') => {
  const params = { ...getCacheBustingParams() };
  if (region !== 'all') params.region = region;
  return axios.get(`${API_BASE}/summary`, { params })
    .then(response => ({
      data: {
        paid_total: response.data.paid_total || 0,
        pending_approvals: response.data.pending_approvals || 0,
        success_rate: response.data.success_rate || 0
      }
    }))
    .catch(error => {
      console.error('Error fetching summary:', error);
      return { data: {} };  // Return empty summary
    });
};
export const downloadPDF = (empId) => axios.get(`${API_BASE}/pdf/${empId}/`, { responseType: 'blob' });