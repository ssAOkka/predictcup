import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // Clean up existing data
  await prisma.prediction.deleteMany();
  await prisma.match.deleteMany();
  await prisma.tournament.deleteMany();
  await prisma.leaderboard.deleteMany();
  await prisma.refreshToken.deleteMany();
  await prisma.user.deleteMany();

  console.log('🗑️  Cleaned up existing data');

  // Create admin user
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@predictcup.dev';
  const adminPassword = process.env.ADMIN_PASSWORD || 'ChangeMe123!';
  const adminUsername = process.env.ADMIN_USERNAME || 'admin';

  const hashedPassword = await bcrypt.hash(adminPassword, 10);

  const admin = await prisma.user.create({
    data: {
      email: adminEmail,
      username: adminUsername,
      password: hashedPassword,
      fullName: 'System Administrator',
      role: 'ADMIN',
      forcePasswordChange: true,
      languagePreference: 'en',
    },
  });

  console.log(`✅ Admin user created: ${adminEmail}`);

  // Create sample tournament
  const tournament = await prisma.tournament.create({
    data: {
      name: 'World Cup 2026',
      type: 'World Cup',
      description: 'FIFA World Cup 2026',
      startDate: new Date('2026-06-11'),
      endDate: new Date('2026-07-19'),
      status: 'upcoming',
    },
  });

  console.log('✅ Sample tournament created');

  // Create sample matches
  const matches = await Promise.all([
    prisma.match.create({
      data: {
        tournamentId: tournament.id,
        homeTeam: 'England',
        awayTeam: 'France',
        matchDate: new Date('2026-06-21T15:00:00Z'),
        status: 'scheduled',
      },
    }),
    prisma.match.create({
      data: {
        tournamentId: tournament.id,
        homeTeam: 'Spain',
        awayTeam: 'Germany',
        matchDate: new Date('2026-06-22T18:00:00Z'),
        status: 'scheduled',
      },
    }),
    prisma.match.create({
      data: {
        tournamentId: tournament.id,
        homeTeam: 'Italy',
        awayTeam: 'Netherlands',
        matchDate: new Date('2026-06-23T20:00:00Z'),
        status: 'scheduled',
      },
    }),
  ]);

  console.log(`✅ Created ${matches.length} sample matches`);

  // Create leaderboard entry for admin
  await prisma.leaderboard.create({
    data: {
      userId: admin.id,
      points: 0,
      rank: 1,
      totalPredictions: 0,
      correctPredictions: 0,
      accuracy: 0,
    },
  });

  console.log('✅ Leaderboard entry created for admin');

  console.log('🎉 Database seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
