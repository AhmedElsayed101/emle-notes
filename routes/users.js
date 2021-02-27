var express = require('express');
const bodyParser = require('body-parser')
const db = require("../models/index");
const User = db.users;
const passport = require('passport');
const authenticate  = require('../authenticate');
const cors = require('./cors')

const router = express.Router();
router.use(bodyParser.json())

/* GET users listing. */
router.get('/',cors.corsWithOprions, authenticate.verifyUser, authenticate.verifyAdmin, function(req, res, next) {
  User.find({})
    .then((users) => {
      res.statusCode = 200
      res.setHeader('Content-Type', 'application/json')
      res.json(users)
  }, (err) => next(err) )
  .catch ((err) => {next(err)})
});

router.post('/signup',cors.corsWithOprions, (req, res, next) => {

  const data = req.body
  console.log('data', data)
  // User.findOne({username : data.username})
  User.register(new User({username : data.username}),data.password, (err, user) => {
    if( err ){
      res.statusCode = 500
      res.setHeader('Content-Type' , 'application/json')
      res.json({err : err})
    }
    else{
      if (data.firstname){
        user.firstname = data.firstname
      }
      if(data.lastname){
        user.lastname = data.lastname
      }
      user.save((err, user) => {
        if (err) {
          res.statusCode = 500
          res.setHeader('Content-Type' , 'application/json')
          res.json({err : err})
        }
        passport.authenticate('local')(req, res, () => {
          res.statusCode = 200
          res.setHeader('Content-Type' , 'application/json')
          res.json({success : true, status : 'Registeration successfull', user : user})
        })
      })
    }
  })
})

router.post('/login',cors.corsWithOprions, passport.authenticate('local'),(req, res, next) => {
  
  const token = authenticate.getToken({_id : req.user._id})
  res.statusCode = 200
  res.setHeader('Content-Type' , 'application/json')
  res.json({success : true, status : 'Login successfull', token : token})
})


router.get('/logout',cors.corsWithOprions, (req ,res , next) => {

  if ( req.session ){
    req.session.destroy()
    res.clearCookie('session-id')
    res.redirect('/')
  }
  else{
    let err = new Error ("Your are not logged in!")
    err.status = 403
    return next(err)
  }

})

router.get('/facebook/token', passport.authenticate('facebook-token'), (req, res, next) => {

  if (req.user){
    const token = authenticate.getToken({_id : req.user._id})
    res.statusCode = 200
    res.setHeader('Content-Type' , 'application/json')
    res.json({success : true, status : 'Login successfull', token : token})
  }
})

module.exports = router;
