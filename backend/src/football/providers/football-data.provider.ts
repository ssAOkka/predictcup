import { FootballMatch, FootballProvider } from '@/types/football';

export interface IFootballDataMatch {
  id: number;
  utcDate: string;
  status: string;
  stage: string;
  group: string | null;
  lastUpdated: string;
  homeTeam: {
    id: number;
    name: string;
  };
  awayTeam: {
    id: number;
    name: string;
  };
  score: {
    fullTime: {
      home: number | null;
      away: number | null;
    };
  };
}

export class FootballDataProvider implements FootballProvider {
  private baseUrl = 'https://api.football-data.org/v4';
  private apiKey: string;

  constructor(apiKey?: string) {
    this.apiKey = apiKey || process.env.FOOTBALL_API_KEY || '';
  }

  private getHeaders() {
    return {
      'X-Auth-Token': this.apiKey,
      'Content-Type': 'application/json',
    };
  }

  async getMatches(tournamentId?: string): Promise<FootballMatch[]> {
    try {
      if (!this.apiKey) {
        return this.getMockMatches();
      }

      const response = await fetch(
        `${this.baseUrl}/competitions/WC/matches`,
        {
          headers: this.getHeaders(),
        }
      );

      if (!response.ok) {
        return this.getMockMatches();
      }

      const data = await response.json();
      return this.mapMatches(data.matches || []);
    } catch (error) {
      return this.getMockMatches();
    }
  }

  async getMatchDetails(matchId: string): Promise<FootballMatch> {
    try {
      if (!this.apiKey) {
        return this.getMockMatchDetails(matchId);
      }

      const response = await fetch(`${this.baseUrl}/matches/${matchId}`, {
        headers: this.getHeaders(),
      });

      if (!response.ok) {
        return this.getMockMatchDetails(matchId);
      }

      const data = await response.json();
      return this.mapMatch(data);
    } catch (error) {
      return this.getMockMatchDetails(matchId);
    }
  }

  async updateScores(): Promise<void> {
    // Background job for score updates
  }

  private mapMatch(match: IFootballDataMatch): FootballMatch {
    return {
      id: match.id.toString(),
      homeTeam: match.homeTeam.name,
      awayTeam: match.awayTeam.name,
      matchDate: new Date(match.utcDate),
      homeScore: match.score.fullTime.home ?? undefined,
      awayScore: match.score.fullTime.away ?? undefined,
      status: this.mapStatus(match.status),
      externalApiId: match.id.toString(),
    };
  }

  private mapMatches(matches: IFootballDataMatch[]): FootballMatch[] {
    return matches.map((match) => this.mapMatch(match));
  }

  private mapStatus(
    status: string
  ): 'scheduled' | 'live' | 'finished' | 'postponed' {
    switch (status.toLowerCase()) {
      case 'live':
        return 'live';
      case 'finished':
        return 'finished';
      case 'postponed':
        return 'postponed';
      default:
        return 'scheduled';
    }
  }

  private getMockMatches(): FootballMatch[] {
    return [
      {
        id: '1',
        homeTeam: 'England',
        awayTeam: 'France',
        matchDate: new Date('2026-06-21T15:00:00Z'),
        status: 'scheduled',
      },
      {
        id: '2',
        homeTeam: 'Spain',
        awayTeam: 'Germany',
        matchDate: new Date('2026-06-22T18:00:00Z'),
        status: 'scheduled',
      },
    ];
  }

  private getMockMatchDetails(matchId: string): FootballMatch {
    return {
      id: matchId,
      homeTeam: 'England',
      awayTeam: 'France',
      matchDate: new Date('2026-06-21T15:00:00Z'),
      status: 'scheduled',
    };
  }
}
