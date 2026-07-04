import api from '@/services/api';

export interface CreatePredictionRequest {
  matchId: string;
  predictedHomeScore: number;
  predictedAwayScore: number;
  predictedResult: 'home' | 'draw' | 'away';
}

export interface Prediction {
  id: string;
  matchId: string;
  userId: string;
  predictedHomeScore: number;
  predictedAwayScore: number;
  predictedResult: string;
  points: number;
  status: string;
}

export const predictionService = {
  createPrediction: async (
    data: CreatePredictionRequest
  ): Promise<Prediction> => {
    const response = await api.post('/predictions', data);
    return response.data;
  },

  getPredictions: async (): Promise<Prediction[]> => {
    const response = await api.get('/predictions');
    return response.data;
  },

  updatePrediction: async (
    id: string,
    data: CreatePredictionRequest
  ): Promise<Prediction> => {
    const response = await api.put(`/predictions/${id}`, data);
    return response.data;
  },
};
