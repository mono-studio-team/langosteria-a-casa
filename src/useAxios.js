import axios from 'axios';
const CODA_API_KEY = process.env['CODA_API_KEY'];

export const axiosInstance = axios.create({
  baseURL: 'https://coda.io/apis/v1',
  headers: { Authorization: `Bearer ${CODA_API_KEY}` },
});
