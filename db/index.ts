import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from 'schemas'
export const connectionProps = {
  host: 'localhost',
  database: 'todo',
  user: 'admin',
  password: 'admin',
  port: 5432,
}

const queryClient = postgres(connectionProps);

export const db = drizzle(queryClient, {schema});
