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
    email: email.trim(),
    password: password.trim(),
    username: req.body.username.trim()
  };
  console.log(userData)
  return User.findOne({ 
    where: {username: userData.username }}).then( (user) => {
      if (user) {
        //this return needs to be changed to what we need todo:
        return done(null, false, {
            message: 'That username is already taken'
        });
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
