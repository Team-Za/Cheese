const User = require('../models').User;
const PassportLocalStrategy = require('passport-local').Strategy;


/**
 * Return the Passport Local Strategy object.
 */
module.exports = new PassportLocalStrategy({
  usernameField: 'email',
  passwordField: 'password',
  session: false,
  passReqToCallback: true
}, (req, email, password, done) => {
  const userData = {
    username: req.body.username.trim(),
    email: email.trim(),
    password: password.trim()
    
  };
  console.log(userData)
  return User.findOne({ 
    where: {username: userData.username }}).then( (user) => {
      if (user) {
        const error = new Error('Username already exist.');
        error.name = 'DuplicateUsername';
  
        return done(error);
      }

    else {
      User.create(userData).then( ()=> {
    return done(null);
  },(err) => {
    console.log(err)
    return done(err);
  })
}
})
  
});
