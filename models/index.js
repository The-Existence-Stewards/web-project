const db = require('../config/database');
const bcrypt = require('bcrypt');


const saltRounds = 10;
const stats = `insert into skills (user_id, skillName, multiplier) values
($1,'strength',1.5),
($1,'intelligence',1.2),
($1,'agility',1.8),
($1,'crafting',1.5),
($1,'charisma',1.2),
($1,'endurance',1.4);`;

const models = {

    register: async (username, password) => {
        try {
            const client = await db.connect();
            const result = await client.query('SELECT user_id, username, password FROM users WHERE username = $1;', [username]);
            const results = { 'results': (result) ? result.rows : null};
            client.release();
            if (results.results.length === 0) {
                console.log(password);
                console.log(saltRounds);
                const hash = await bcrypt.hash(password, saltRounds);
                const result = await client.query('INSERT INTO users (username, password) VALUES ($1, $2) RETURNING user_id, username; ', [username, hash]);
                const results = { 'results': (result) ? result.rows : null};
                await client.query(stats, [results.results[0].user_id]);
                return { 'user_id': results.results[0].user_id, 'username': results.results[0].username };
            } else {
                return { 'error': 'User already exists' };
            }
        } catch (err) {
            console.error(err);
            return { 'error': err };
        }
    },
    

    login: async (username, password) => {
        try {
            const client = await db.connect();
            const result = await client.query('SELECT user_id, username, password FROM users WHERE username = $1;', [username]);
            const results = { 'results': (result) ? result.rows : null};
            client.release();
            if (results.results.length === 0) {
                return { 'error': 'User not found' };
            } else {
                const user = results.results[0];
                const match = await bcrypt.compare(password, user.password);
                if (match) {
                    return { 'user_id': user.user_id, 'username': user.username };
                } else {
                    return { 'error': 'Incorrect password' };
                }
            }
        } catch (err) {
            console.error(err);
            return { 'error': err };
        }
    },

    getUser: async (id) => {
        try {
            const client = await db.connect();
            const result = await client.query('SELECT user_id, username, password FROM users WHERE user_id = $1;', [id]);
            const results = { 'results': (result) ? result.rows : null};
            client.release();
            if (results.results.length === 0) {
                return { 'error': 'User not found' };
            } else {
                return results.results[0];
            }
        } catch (err) {
            console.error(err);
            return { 'error': err };
        }
    },

    getSkills: async (id) => {
        try {
            const client = await db.connect();
            const result = await client.query('SELECT * FROM skills WHERE user_id = $1;', [id]);
            const results = { 'results': (result) ? result.rows : null};
            client.release();
            if (results.results.length === 0) {
                return { 'error': 'User not found' };
            } else {
                return results.results;
            }
        } catch (err) {
            console.error(err);
            return { 'error': err };
        }
    },

    updateStats: async (id, stats) => {
        try {
            const client = await db.connect();
            const result = await client.query();
            const results = { 'results': (result) ? result.rows : null};
            client.release();
            if (results.results.length === 0) {
                return { 'error': 'User not found' };
            } else {
                return results.results[0];
            }
        } catch (err) {
            console.error(err);
            return { 'error': err };
        }
    }
};

module.exports = models;