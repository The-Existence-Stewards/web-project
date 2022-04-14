const db = require('../database');
const bcrypt = require('bcrypt');

const saltRounds = 10;
const stats = "insert into stats (strength,endurance,intelligence,charisma,agility,crafting) values (0,0,0,0,0,0);"
const register = {
    register: async (username, password) => {
        try {
            const client = await db.connect();
            const result = await client.query('SELECT user_id, username, password FROM users WHERE username = $1;', [username]);
            const results = { 'results': (result) ? result.rows : null};
            client.release();
            if (results.results.length === 0) {
                const hash = await bcrypt.hash(password, saltRounds);
                const result = await client.query('INSERT INTO users (username, password) VALUES ($1, $2) RETURNING user_id, username; ', [username, hash]);
                const results = { 'results': (result) ? result.rows : null};
                await client.query(stats);
                return { 'user_id': results.results[0].user_id, 'username': results.results[0].username };
            } else {
                return { 'error': 'User already exists' };
            }
        } catch (err) {
            console.error(err);
            return { 'error': err };
        }
    }
}

module.exports = register;