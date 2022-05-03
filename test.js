const bcrypt = require('bcrypt');

console.log(bcrypt.hashSync('password', 10));

let date = new Date();

console.log(date.toISOString().slice(0,10));