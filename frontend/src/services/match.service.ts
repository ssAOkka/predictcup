import api from '@/services/api';

export interface Match {
  id: string;
  homeTeam: string;
  awayTeam: string;
  matchDate: string;
  status: 'scheduled' | 'live' | 'finished' | 'postponed';
  homeScore?: number;
  awayScore?: number;
  tournament: any;
}

export const matchService = {
  getMatches: async (): Promise<Match[]> => {
    const response = await api.get('/matches');
    return response.data;
  },

  getUpcomingMatches: async (): Promise<Match[]> => {
    const response = await api.get('/matches/upcoming');
    return response.data;
  },

  getMatchById: async (id: string): Promise<Match> => {
    const response = await api.get(`/matches/${id}`);
    return response.data;
  },
};
