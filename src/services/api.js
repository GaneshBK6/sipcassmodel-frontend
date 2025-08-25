import axiosInstance from './axiosInstance';

const API_BASE = import.meta.env.VITE_API_BASE_URL || '';


export const uploadFile = (file) => {
  const formData = new FormData();
  formData.append('file', file);
  return axiosInstance.post(`/upload/`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
};

const getCacheBustingParams = () => ({ _: Date.now() });

export const getRawData = (region = 'all') => {
  const params = { ...getCacheBustingParams() };
  if (region !== 'all') params.region = region;
  return axiosInstance.get(`/raw-data/`, { params })
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
  return axiosInstance.get(`/summary/`, { params })
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
export const downloadPDF = (empId) => axiosInstance.get(`/pdf/${empId}/`, { responseType: 'blob' });