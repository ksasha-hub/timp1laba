import axios from 'axios';

const BASE_URL = 'http://localhost:5000/items';

// Настроенный экземпляр axios с базовым URL и заголовком JSON
const api = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

// Перехватчик ответов — глобальная обработка 401 Unauthorized
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      console.warn('Не авторизован (401). Требуется аутентификация.');
      // При необходимости: window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// GET: получить все угрозы
export const getAllThreats  = ()           => api.get('/');

// GET: получить одну угрозу по id
export const getThreatById = (id)         => api.get(`/${id}`);

// POST: создать новую угрозу (JSON в теле запроса)
export const createThreat  = (threat)     => api.post('/',     JSON.stringify(threat));

// PUT: обновить угрозу (JSON в теле запроса)
export const updateThreat  = (id, threat) => api.put(`/${id}`, JSON.stringify(threat));

// DELETE: удалить угрозу
export const deleteThreat  = (id)         => api.delete(`/${id}`);
