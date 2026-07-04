import { FootballProviderFactory } from '@/football/factory';
import prisma from '@/config/database';

export class FootballService {
  private provider = FootballProviderFactory.create();

  async syncMatches(tournamentId: string): Promise<void> {
    const matches = await this.provider.getMatches(tournamentId);

    for (const match of matches) {
      await prisma.match.upsert({
        where: {
          externalApiId: match.externalApiId || match.id,
        },
        create: {
          tournamentId,
          homeTeam: match.homeTeam,
          awayTeam: match.awayTeam,
          matchDate: match.matchDate,
          status: match.status,
          homeScore: match.homeScore,
          awayScore: match.awayScore,
          externalApiId: match.externalApiId || match.id,
        },
        update: {
          status: match.status,
          homeScore: match.homeScore,
          awayScore: match.awayScore,
        },
      });
    }
  }

  async getUpcomingMatches() {
    return prisma.match.findMany({
      where: {
        status: 'scheduled',
        matchDate: {
          gte: new Date(),
        },
      },
      orderBy: {
        matchDate: 'asc',
      },
    });
  }

  async getMatchById(id: string) {
    return prisma.match.findUnique({
      where: { id },
    });
  }
}
