import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export const patientService = {
    getAll: async () => {
        const response = await api.get('/patients');
        return response.data;
    },
    create: async (patientData: any) => {
        const response = await api.post('/patients', patientData);
        return response.data;
    },
    getById: async (id: string) => {
        const response = await api.get(`/patients/${id}`);
        return response.data;
    }
};

export const appointmentService = {
    getAll: async () => {
        const response = await api.get('/appointments');
        return response.data;
    },
    create: async (appointmentData: any) => {
        const response = await api.post('/appointments', appointmentData);
        return response.data;
    },
    update: async (id: string, data: any) => {
        const response = await api.put(`/appointments/${id}`, data);
        return response.data;
    }
};

export const userService = {
    getDoctors: async () => {
        const response = await api.get('/auth/doctors');
        return response.data;
    }
};

export const medicalRecordService = {
    getAll: async () => {
        const response = await api.get('/medical-records');
        return response.data;
    },
    create: async (recordData: any) => {
        const response = await api.post('/medical-records', recordData);
        return response.data;
    },
    getByPatient: async (patientId: string) => {
        const response = await api.get(`/medical-records/patient/${patientId}`);
        return response.data;
    }
};

export const wellnessService = {
    create: async (wellnessData: any) => {
        const response = await api.post('/wellness', wellnessData);
        return response.data;
    },
    getHistory: async (limit?: number) => {
        const response = await api.get('/wellness', {
            params: { limit }
        });
        return response.data;
    },
    getStats: async (days?: number) => {
        const response = await api.get('/wellness/stats', {
            params: { days }
        });
        return response.data;
    },
    delete: async (id: string) => {
        const response = await api.delete(`/wellness/${id}`);
        return response.data;
    }
};

export default api;
