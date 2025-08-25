import axiosInstance from './axiosInstance';

const API_BASE = import.meta.env.VITE_API_BASE_URL || '';


export const uploadAOPTargetsExcel = (file) => {
  const formData = new FormData();
  formData.append('file', file);
  return axiosInstance.post(`/aop-targets/upload/`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};

export const getAOPTargets = () => {
  return axiosInstance.get(`/aop-targets/`);
};

export const updateAOPTarget = (id, data) => {
  return axiosInstance.patch(`/aop-targets/${id}/`, data);
};
