const express = require('express');
const fileUpload = require('express-fileupload');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const path = require('path');
const app = express();

const {getHomePage} = require('./routes/index');
const { addPlayerPage, addPlayer, deletePlayer, editPlayer, editPlayerPage } = require('./routes/player');
const { getHomePageLeague } = require('./routes/indexl');
const { addLeaguePage, addLeague, deleteLeague, editLeague, editLeaguePage } = require('./routes/league');
const { getHomePageClub } = require('./routes/indexc');
const { addClubPage, addClub, deleteClub, editClub, editClubPage } = require('./routes/club');
const { getHomePageGoal } = require('./routes/indexg');
const { addGoalPage, addGoal, deleteGoal, editGoal, editGoalPage } = require('./routes/goal');
const port = 8080;

// create connection to database
// the mysql.createConnection function takes in a configuration object which contains host, user, password and the database name.
const db = mysql.createConnection ({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'worldfootball'
});

// connect to database
db.connect((err) => {
    if (err) {
        throw err;
    }
    console.log('Connected to database');
});
global.db = db;

// configure middleware
app.set('port', process.env.port || port); // set express to use this port
app.set('views', __dirname + '/views'); // set express to look in this folder to render our view
app.set('view engine', 'ejs'); // configure template engine
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json()); // parse form data client
app.use(express.static(path.join(__dirname, 'public'))); // configure express to use public folder
app.use(fileUpload()); // configure fileupload

// routes for the app

app.get('/', getHomePage);
app.get('/add', addPlayerPage);
app.get('/edit/:id', editPlayerPage);
app.get('/delete/:id', deletePlayer);
app.post('/add', addPlayer);
app.post('/edit/:id', editPlayer);

app.get('/', getHomePageLeague);
app.get('/add', addLeaguePage);
app.get('/edit/:id', editLeaguePage);
app.get('/delete/:id', deleteLeague);
app.post('/add', addLeague);
app.post('/edit/:id', editLeague);

app.get('/', getHomePageClub);
app.get('/add', addClubPage);
app.get('/edit/:id', editClubPage);
app.get('/delete/:id', deleteClub);
app.post('/add', addClub);
app.post('/edit/:id', editClub);

app.get('/', getHomePageGoal);
app.get('/add', addGoalPage);
app.get('/edit/:id', editGoalPage);
app.get('/delete/:id', deleteGoal);
app.post('/add', addGoal);
app.post('/edit/:id', editGoal);

// set the app to listen on the port
app.listen(port, () => {
    console.log(`Server running on port: ${port}`);
});