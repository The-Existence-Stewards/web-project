const db = require('../database');
const bcrypt = require('bcrypt');

const login = {
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
    }
};

module.exports = login;