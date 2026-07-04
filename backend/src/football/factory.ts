import { FootballProvider } from '@/types/football';
import { FootballDataProvider } from './football-data.provider';

export class FootballProviderFactory {
  static create(provider?: string): FootballProvider {
    const selectedProvider = provider || process.env.FOOTBALL_API_PROVIDER || 'football-data.org';

    switch (selectedProvider.toLowerCase()) {
      case 'football-data.org':
        return new FootballDataProvider(process.env.FOOTBALL_API_KEY);
      default:
        return new FootballDataProvider(process.env.FOOTBALL_API_KEY);
    }
  }
}
