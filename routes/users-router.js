const express = require('express');
const passport = require('passport');

const passportUsage = require('../authentication/passport-usage');
const cors = require('../utils/cors');
const userService = require('../service/user-service');

const router = express.Router();
router.use(express.json());

/* GET users listing. */
router.options('*', cors.corsWithOptions, (req, res) => { res.sendStatus(200); });

router.get('/', cors.corsWithOptions, passportUsage.verifyAdmin, async (req, res, next) => {
  try {
    let users = await userService.getAllUsers();
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.json(users)
  } catch (err) {
    next(err);
  }
});

router.post('/signup', cors.corsWithOptions, async (req, res, next) => {
  let user = {
    username: req.body.username,
    firstname: req.body.firstname,
    lastname: req.body.lastname
  };
  const password = req.body.password;
  try {
    user = await userService.createUserByUserNameAndPassword(user, password);
    passport.authenticate('local')(req, res, () => {
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.json({success: true, status: 'Registration successfully'});
    });
  } catch (err) {
    next(err);
  }
});

router.post('/login', cors.corsWithOptions, (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) 
      return next(err);

    if (!user) {
      res.statusCode = 401;
      res.setHeader('Content-Type', 'application/json');
      return res.json({success: false, status: 'Login unsuccessful!', err: info});
    }
    const opts = {
      session: false
    }
    req.logIn(user, opts, (err) => {
      if (err) {
        res.statusCode = 401;
        res.setHeader('Content-Type', 'application/json');
        return res.json({success: false, status: 'Login unsuccessful!', err: "Could not login user!"}); 
      }
      var token = passportUsage.getToken({id: req.user.id});
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      return res.json({success: true, status: 'Login successful!', token: token}); 
    });
    
  }) (req, res, next);
});

router.get('/logout', cors.corsWithOptions, (req, res, next) => {
  if (req.session) {
    req.session.destroy();
    res.clearCookie('session-id');
    res.redirect('/');
  } else {
    var err = new Error('U are not logged in!');
    err.status = 401;
    next(err);
  }
});

router.get('/checkJWTToken', cors.corsWithOptions, (req, res) => {
  passport.authenticate('jwt', {session: false}, (err, user, info) => {
    if (err) 
      return next(err);

    if (!user) {
      res.statusCode = 401;
      res.setHeader('Content-Type', 'application/json');
      res.json({status: 'JWT invalid!', success: false, err: info});
    } else {
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.json({success: true, user: user, status: 'Valid JWT'});
    }
  }) (req, res);
});

module.exports = router;
