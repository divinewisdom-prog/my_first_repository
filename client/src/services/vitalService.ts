import api from './api';

export const vitalService = {
    getAll: async () => {
        const response = await api.get('/vitals');
        return response.data;
    },

    getByPatient: async (patientId: string) => {
        const response = await api.get(`/vitals/patient/${patientId}`);
        return response.data;
    },

    create: async (data: any) => {
        const response = await api.post('/vitals', data);
        return response.data;
    },

    delete: async (id: string) => {
        const response = await api.delete(`/vitals/${id}`);
        return response.data;
    }
};
