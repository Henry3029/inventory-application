import { Client } from 'pg';
import dotenv from 'dotenv';
dotenv.config();

const SQL = `
-- Drop and recreate tables for a clean slate
DROP TABLE IF EXISTS games CASCADE;
DROP TABLE IF EXISTS genres CASCADE;
DROP TABLE IF EXISTS platforms CASCADE;

CREATE TABLE genres (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) UNIQUE NOT NULL
);

CREATE TABLE platforms (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) UNIQUE NOT NULL
);

CREATE TABLE games (
  id SERIAL PRIMARY KEY,
  title VARCHAR(150) NOT NULL,
  release_year INT,
  rating NUMERIC(3, 1),
  genre_id INT REFERENCES genres(id) ON DELETE SET NULL,
  platform_id INT REFERENCES platforms(id) ON DELETE SET NULL
);

INSERT INTO genres (name) VALUES ('Action-Adventure'), ('RPG'), ('Shooter');
INSERT INTO platforms (name) VALUES ('PC'), ('PlayStation 5'), ('Nintendo Switch');
INSERT INTO games (title, release_year, rating, genre_id, platform_id) 
VALUES 
  ('The Last of Us Part II', 2020, 9.5, 1, 2),
  ('Cyberpunk 2077', 2020, 8.5, 2, 1),
  ('Hades', 2020, 9.0, 1, 3);
`;

async function main() {
  console.log("Seeding database...");
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
  });
  await client.connect();
  await client.query(SQL);
  await client.end();
  console.log("Done seeding!");
}

main();
