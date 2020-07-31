const express = require('express');
const authRoutes = require('./routes/auth-routes');
const profileRoutes = require('./routes/profile-routes');
const passportSetup = require('./config/passport-setup');
const mongoose = require('mongoose');
const keys = require('./config/keys');
const cookieSession = require('cookie-session');
const passport = require('passport');


const app = express();

//view engine setup
app.set('view engine', 'ejs');

app.use(cookieSession ({
    maxAge: 24* 60* 60 * 1000,
    keys: [keys.session.cookieKey]
}));

//initialize passport
app.use(passport.initialize());
app.use(passport.session());

//connected to mongo db
mongoose.connect(keys.mongodb.dbURL, () => {
    console.log('connected to mongoDB')
});

//set up routes
app.use('/auth', authRoutes);
//app.use('/profile', profileRoutes);


//create home route
app.get('/', (req,res) => {
    res.render('home', {user: req.user});
});

app.get('/profile', (req,res) => {
    console.log(req)
   //render('home', {user: req.user});
});

app.listen(4001, () => {
    console.log('App now listening on port 4001');
});