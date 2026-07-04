export interface FootballMatch {
  id: string;
  homeTeam: string;
  awayTeam: string;
  matchDate: Date;
  homeScore?: number;
  awayScore?: number;
  status: 'scheduled' | 'live' | 'finished' | 'postponed';
  externalApiId?: string;
}

export interface FootballProvider {
  getMatches(tournamentId?: string): Promise<FootballMatch[]>;
  getMatchDetails(matchId: string): Promise<FootballMatch>;
  updateScores(): Promise<void>;
}
