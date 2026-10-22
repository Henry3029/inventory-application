import express from 'express';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import pool from './db/pool.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 8080;

app.set('views', path.join(__dirname, '../views'));
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));

app.get('/', async (req, res) => {
    try {
        // Query games and join them with genres and platforms so we get readable names instead of raw IDs
            const query = `
                  SELECT games.id, games.title, games.release_year, games.rating, 
                               genres.name AS genre_name, platforms.name AS platform_name
                                     FROM games
                                           LEFT JOIN genres ON games.genre_id = genres.id
                                                 LEFT JOIN platforms ON games.platform_id = platforms.id
                                                       ORDER BY games.id ASC;
                                                           `;
                                                               
                                                                   const { rows: games } = await pool.query(query);

                                                                       // Render the index view and pass the games data
                                                                           res.render('index', { title: 'Games Inventory', games: games });
                                                                             } catch (err) {
                                                                                 console.error(err);
                                                                                     res.status(500).send('Error retrieving games from database');
                                                                                       }
                                                                                       });
                                                                                       
 // 1. Show the "Add Game" form
app.get('/games/new', async (req, res) => {
  try {
    // Fetch genres and platforms so the user can pick them from dropdowns
    const genresResult = await pool.query('SELECT * FROM genres ORDER BY name ASC');
    const platformsResult = await pool.query('SELECT * FROM platforms ORDER BY name ASC');

    res.render('new-game', { 
      title: 'Add New Game', 
      genres: genresResult.rows, 
      platforms: platformsResult.rows 
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Error loading form');
  }
});

// 2. Handle form submission and insert into database
app.post('/games', async (req, res) => {
  try {
    const { title, release_year, rating, genre_id, platform_id } = req.body;

    const query = `
      INSERT INTO games (title, release_year, rating, genre_id, platform_id)
      VALUES ($1, $2, $3, $4, $5);
    `;

    // Using parameterized queries ($1, $2, etc.) protects your database against SQL injection!
    await pool.query(query, [
      title, 
      release_year || null, 
      rating || null, 
      genre_id || null, 
      platform_id || null
    ]);

    // Redirect back to the homepage to see the new game
    res.redirect('/');
  } catch (err) {
    console.error(err);
    res.status(500).send('Error saving game to database');
  }
});



                          app.listen(PORT, () => {
                            console.log(`Server running on http://localhost:${PORT}`);
                            });
                            