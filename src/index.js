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


                          app.listen(PORT, () => {
                            console.log(`Server running on http://localhost:${PORT}`);
                            });
                            