import axios from 'axios';

export const axiosInstance = axios.create({
  baseURL: 'https://coda.io/apis/v1beta1',
  headers: { Authorization: `Bearer ${process.env.CODA_API_KEY}` },
});
