import 'dotenv/config';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import { connectionProps } from 'db';
import postgres from 'postgres';
import { drizzle } from 'drizzle-orm/postgres-js';
import * as schema from 'schemas'

const migrationClient = postgres({...connectionProps, max: 1})
const migrationDb = drizzle(migrationClient, {schema})

const asyncWrapper = async () => {
  await migrate(migrationDb, { migrationsFolder: './drizzle' });
  await migrationClient.end();
}

asyncWrapper()