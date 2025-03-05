import * as fs from 'fs';
import * as path from 'path';
import * as sqlite3 from 'sqlite3';
import { PrismaClient } from '@prisma/client';
import 'dotenv/config';

async function main() {
  // Connect to the existing SQLite database
  const existingDbPath = path.join(__dirname, '../server/db/papers.db');
  if (!fs.existsSync(existingDbPath)) {
    console.error(`Source database not found at ${existingDbPath}`);
    process.exit(1);
  }

  console.log(`Source database found at ${existingDbPath}`);
  const sourceDb = new sqlite3.Database(existingDbPath);
  
  // Create a Prisma client
  const prisma = new PrismaClient();
  
  // Migrate papers
  console.log('Migrating papers...');
  const papers = await new Promise<any[]>((resolve, reject) => {
    sourceDb.all('SELECT * FROM papers', [], (err, rows) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(rows);
    });
  });

  console.log(`Found ${papers.length} papers to migrate`);

  for (const paper of papers) {
    try {
      console.log(`Migrating paper: ${paper.title}`);
      
      // Check if paper already exists
      const existingPaper = await prisma.paper.findFirst({
        where: { title: paper.title }
      });
      
      if (existingPaper) {
        console.log(`Paper "${paper.title}" already exists, skipping...`);
        continue;
      }
      
      await prisma.paper.create({
        data: {
          title: paper.title,
          authors: paper.authors, // This will be a string in JSON format in the source DB
          journal: paper.journal || '',
          year: paper.year,
          doi: paper.doi || '',
          url: paper.url || '',
          abstract: paper.abstract || '',
          isCurrentlyReading: paper.is_currently_reading === 1,
        },
      });
      console.log(`Successfully migrated paper: ${paper.title}`);
    } catch (error) {
      console.error(`Error migrating paper ${paper.title}:`, error);
    }
  }

  // Migrate updates
  console.log('Migrating updates...');
  const updates = await new Promise<any[]>((resolve, reject) => {
    sourceDb.all('SELECT * FROM updates', [], (err, rows) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(rows);
    });
  });

  console.log(`Found ${updates.length} updates to migrate`);

  for (const update of updates) {
    try {
      // Find the related paper in Keystone
      const relatedPaper = await prisma.paper.findFirst({
        where: { title: update.paper_title },
      });

      if (!relatedPaper) {
        console.log(`No matching paper found for update: ${update.message}`);
        continue;
      }

      // Check if update already exists
      const existingUpdate = await prisma.update.findFirst({
        where: { 
          message: update.message,
          paperTitle: update.paper_title
        }
      });
      
      if (existingUpdate) {
        console.log(`Update "${update.message}" already exists, skipping...`);
        continue;
      }

      console.log(`Migrating update: ${update.message}`);
      await prisma.update.create({
        data: {
          paperTitle: update.paper_title,
          message: update.message,
          timestamp: new Date(update.timestamp).toISOString(),
          paper: { connect: { id: relatedPaper.id } },
        },
      });
      console.log(`Successfully migrated update: ${update.message}`);
    } catch (error) {
      console.error(`Error migrating update ${update.message}:`, error);
    }
  }

  console.log('Migration completed successfully');
  sourceDb.close();
  await prisma.$disconnect();
  process.exit(0);
}

main().catch((error) => {
  console.error('Migration failed:', error);
  process.exit(1);
}); 