const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20');
const keys = require('./keys'); 
const User = require('../models/user-models');
const axios = require('axios');
const mysql = require('mysql');
const connection = mysql.createConnection({
    host     : 'localhost',
    port     :  '3306',
    user     : 'root',
    password : '',
    database : 'auth'
});



passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    User.findById(id).then((user) => {
        done(null, user);
    });
    
});


passport.use(
    new GoogleStrategy({
       //options for the google strategy
       callbackURL: '/auth/google/redirect',
       clientID: keys.google.clientID ,
       clientSecret: keys.google.clientSecret
    }, (accessToken, refreshToken, profile, done) => {
        
        console.log(profile);
        console.log('data done')
        //check if user alreary exist in database
        //check if user alreary exist in database
        User.findOne({googleId: profile.id}).then((currentUser) => {
            if(currentUser){
                //already have the user
                console.log('user is : ', currentUser);
                done(null, currentUser);

            }else{
                // if not, Create new user
                new User({
                    username: profile.displayName,
                    googleId: profile.id,
                    thumbnail: profile._json.picture
                }).save().then((newUser) => {
                    console.log('new user created: ' + newUser); 
                    done(null, newUser);
                });
            }

        });
        // try{
        //     connection.query('SELECT id FROM `users` WHERE `id` = ? ',[profile.id], function (error, results) {
        //         if (error) throw error;
        //         if(results.length > 0){
        //             console.log('already loged')
                    
        //         }
        //         else{
        //             try{
        //                 connection.query('INSERT INTO `users` (id,Name,Image) values (?,?,?) ;',[profile.id,profile.displayName,profile.photos[0].value], function (error, results) {
        //                     if (error) throw error;});
        //                     console.log('insert done');
        //             }catch(e){
        //                 console.log(e);
        //             }
                    
        //         }
        //         });

        // }catch(e){
        //     console.log(e);
        // }

        
    })
)