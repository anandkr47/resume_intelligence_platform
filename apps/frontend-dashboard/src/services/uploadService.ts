import { apiClient } from './apiClient';
import { API_PATHS } from '../constants';

export const uploadService = {
  async uploadSingle(file: File) {
    const formData = new FormData();
    formData.append('resume', file);
    const { data } = await apiClient.post(API_PATHS.UPLOAD.SINGLE, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return data;
  },

  async uploadMultiple(formData: FormData) {
    const { data } = await apiClient.post(API_PATHS.UPLOAD.MULTIPLE, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return data;
  },
};
