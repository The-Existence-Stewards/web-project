if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
};

const express = require('express');
const app = express();
// const db = require('./database.js');

const loginRouter = require('./routes/login.js');
const registerRouter = require('./routes/register.js');

app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use('/login', loginRouter);
app.use('/register', registerRouter);

// app.get('/db', async (req, res) => {
//     try {
//         const client = await db.connect();
//         const result = await client.query('SELECT user_id, username FROM users;');
//         const results = { 'results': (result) ? result.rows : null};
//         res.json( results );
//         client.release();
//     } catch (err) {
//         console.error(err);
//         res.json({ error: err });
//     }
// });

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});

module.exports = app;