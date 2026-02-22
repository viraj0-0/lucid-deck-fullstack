import apiClient from './apiClient';


const post = async (path, payload = {}) => {
// wrapper to call /api/gemini on backend
if (path === '/api/gemini' || path === '/gemini') {
return apiClient.post('/api/gemini', payload);
}
return apiClient.post(path, payload);
};


export default { post };