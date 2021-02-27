const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const User = require('./models/users')
const JwtStrategy = require('passport-jwt').Strategy
const ExtractJwt = require('passport-jwt').ExtractJwt
const jwt = require('jsonwebtoken')
const FacebookTokenStrategy = require('passport-facebook-token')

const config = require('./config')
// const f = require('session-file-store')

exports.local = passport.use(new LocalStrategy(User.authenticate()))
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())


exports.getToken = function (user) {
    return jwt.sign(user, config.secretKey, {
        expiresIn : 3600
    })
}

const opts = {}
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken()
opts.secretOrKey = config.secretKey

exports.jwtPassport = passport.use(new JwtStrategy(opts, (jwt_paload, done) => {
    console.log('payload', jwt_paload)
    User.findOne({_id : jwt_paload._id}, (err, user) => {
        console.log('1')
        if (err){
            console.log('2')

            return done(err, false)
            
        }
        else if (user){
            console.log('3')
            return done(null, user)
        }
        else {
            console.log('4')

            return done(null, false)
        }
    })
}))


exports.verifyUser = passport.authenticate('jwt', {session : false})


exports.verifyAdmin = function (req, res, next) { 
    console.log('req', req.user)
    if (!req.user.admin){
        console.log('here')
        err = new Error('You are not authorized to perform this operation!! Admin needed!!');
        err.status = 403;
        return next(err);
    }
    else return  next();
   
  }

exports.facebookPassport = passport.use(new
FacebookTokenStrategy(
    {
        clientID : config.facebook.clientId,
        clientSecret : config.facebook.clientSecret
    },
    (accessToken, refreshToken, profile, done) => {
        User.findOne({facebookId : profile.id}, (err, user) => {
            if (err){
                return done(err, false)
            }
            if (!err, user !== null){
                return done( null, user)
            }
            else{

                newUser = new User({
                    username : profile.displayName,
                })
                newUser.facebookId = profile.id
                newUser.firstname= profile.name.givenName
                newUser.lastname = profile.name.familyName
                newUser.save((err, user) => {
                    if (err) return done(err, false)
                    else return done (null, user)
                })
            }
        })
          
    }
))