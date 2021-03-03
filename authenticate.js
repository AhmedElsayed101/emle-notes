const passport = require('passport')
// const LocalStrategy = require('passport-local').Strategy
const db = require('./models/index')
const User = db.emleUsers
const JwtStrategy = require('passport-jwt').Strategy
const ExtractJwt = require('passport-jwt').ExtractJwt
const jwt = require('jsonwebtoken')
// const FacebookTokenStrategy = require('passport-facebook-token')

// const config = require('./config')
// const f = require('session-file-store')

// exports.local = passport.use(new LocalStrategy(User.authenticate()))
// passport.serializeUser(User.serializeUser())
// passport.deserializeUser(User.deserializeUser())

const secretKey = "lskdflkasflksadklfklsdfs"

exports.getToken = function (user) {
    return jwt.sign(user, secretKey, {
        expiresIn : 3600
    })
}

const opts = {}
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken()
// opts.secretOrKey = config.secretKey

opts.secretOrKey = secretKey

exports.jwtPassport = passport.use(new JwtStrategy(opts, (jwt_paload, done) => {
    // console.log('payload', jwt_paload)
    User.findOne(
        { where: { id: jwt_paload.id } }
    )
    .then(user => {
        // console.log('user', user)
        if(user){
            return done(null, user)
        }
        else{
            return done(null, false)
        }
    })
    .catch(err => {
        return done(err, false)
    });
}))


exports.verifyUser = passport.authenticate('jwt', {session : false})


// exports.verifyAdmin = function (req, res, next) { 
//     console.log('req', req.user)
//     if (!req.user.admin){
//         console.log('here')
//         err = new Error('You are not authorized to perform this operation!! Admin needed!!');
//         err.status = 403;
//         return next(err);
//     }
//     else return  next();
   
//   }

// exports.facebookPassport = passport.use(new
// FacebookTokenStrategy(
//     {
//         clientID : config.facebook.clientId,
//         clientSecret : config.facebook.clientSecret
//     },
//     (accessToken, refreshToken, profile, done) => {
//         User.findOne({facebookId : profile.id}, (err, user) => {
//             if (err){
//                 return done(err, false)
//             }
//             if (!err, user !== null){
//                 return done( null, user)
//             }
//             else{

//                 newUser = new User({
//                     username : profile.displayName,
//                 })
//                 newUser.facebookId = profile.id
//                 newUser.firstname= profile.name.givenName
//                 newUser.lastname = profile.name.familyName
//                 newUser.save((err, user) => {
//                     if (err) return done(err, false)
//                     else return done (null, user)
//                 })
//             }
//         })
          
//     }
// ))