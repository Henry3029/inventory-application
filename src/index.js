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


// View a single game's detail page
app.get('/games/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const query = `
      SELECT games.*, genres.name AS genre_name, platforms.name AS platform_name
      FROM games
      LEFT JOIN genres ON games.genre_id = genres.id
      LEFT JOIN platforms ON games.platform_id = platforms.id
      WHERE games.id = $1;
    `;
    const { rows } = await pool.query(query, [id]);
    
    if (rows.length === 0) {
      return res.status(404).send('Game not found');
    }

    res.render('game-detail', { title: rows[0].title, game: rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).send('Error loading game details');
  }
});

// View all games in a specific genre category
app.get('/genres/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Get genre details
    const genreQuery = await pool.query('SELECT * FROM genres WHERE id = $1', [id]);
    if (genreQuery.rows.length === 0) return res.status(404).send('Genre not found');
    
    // Get all games belonging to this genre
    const gamesQuery = `
      SELECT games.*, platforms.name AS platform_name 
      FROM games 
      LEFT JOIN platforms ON games.platform_id = platforms.id 
      WHERE games.genre_id = $1;
    `;
    const gamesResult = await pool.query(gamesQuery, [id]);

    res.render('genre-detail', { 
      genre: genreQuery.rows[0], 
      games: gamesResult.rows,
      title: `${genreQuery.rows[0].name} Games`
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Error loading category view');
  }
});

// 1. Show the Edit Form pre-filled with existing game data
app.get('/games/:id/edit', async (req, res) => {
  try {
    const { id } = req.params;
    const gameResult = await pool.query('SELECT * FROM games WHERE id = $1', [id]);
    const genresResult = await pool.query('SELECT * FROM genres ORDER BY name ASC');
    const platformsResult = await pool.query('SELECT * FROM platforms ORDER BY name ASC');

    if (gameResult.rows.length === 0) return res.status(404).send('Game not found');

    res.render('edit-game', {
      title: `Edit ${gameResult.rows[0].title}`,
      game: gameResult.rows[0],
      genres: genresResult.rows,
      platforms: platformsResult.rows
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Error loading edit form');
  }
});

// 2. Handle the update submission
app.post('/games/:id/update', async (req, res) => {
  try {
    const { id } = req.params;
    const { title, release_year, rating, genre_id, platform_id, admin_password } = req.body;
   
  // 🔒 Check if password matches
    if (admin_password !== process.env.ADMIN_PASSWORD) {
      return res.status(403).send('Access Denied: Incorrect Admin Password! <a href="/games/' + id + '/edit">Go Back</a>');
    }
   	

    const query = `
      UPDATE games 
      SET title = $1, release_year = $2, rating = $3, genre_id = $4, platform_id = $5
      WHERE id = $6;
    `;

    await pool.query(query, [
      title, 
      release_year || null, 
      rating || null, 
      genre_id || null, 
      platform_id || null, 
      id
    ]);

    res.redirect(`/games/${id}`);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error updating game');
  }
});

// Delete a game by its ID
app.post('/games/:id/delete', async (req, res) => {
  try {
    const { id } = req.params;
    const { admin_password } = req.body;

    //  Check if password matches
    if (admin_password !== process.env.ADMIN_PASSWORD) {
      return res.status(403).send('Access Denied: Incorrect Admin Password! <a href="/games/' + id + '">Go Back</a>');
    }
    await pool.query('DELETE FROM games WHERE id = $1', [id]);
    res.redirect('/');
  } catch (err) {
    console.error(err);
    res.status(500).send('Error deleting game');
  }
});




                          app.listen(PORT, () => {
                            console.log(`Server running on http://localhost:${PORT}`);
                            });
                            