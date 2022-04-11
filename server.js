let express = require('express');
let app = express();

let indexRouter = require('./routes/index');

app.set('views', __dirname + '/views');

app.use(express.static('public'));
app.use('/', indexRouter);




app.get('/login', (req, res) => {
    res.sendFile(__dirname + '/views/login.html');
});

app.get('/register', (req, res) => {
    res.sendFile(__dirname + '/views/register.html');
});

app.listen(process.env.PORT || 3000);

// while(true) {
//     console.log('nya')
// }