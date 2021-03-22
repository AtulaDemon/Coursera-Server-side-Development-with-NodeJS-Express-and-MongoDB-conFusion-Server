const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const jwt = require('jsonwebtoken');
var path = require('path');

const db = require('../models');
const UserModel = db.user;
const env = process.env.NODE_ENV || "development";
const jwtConfig = require(path.join(__dirname, '..', 'config', 'jwt-config.json'))[env];
const secretKey = jwtConfig.secretKey;

exports.local = passport.use(new LocalStrategy(UserModel.authenticate()));

exports.getToken = function(user) {
    return jwt.sign(user, secretKey, {expiresIn: 80000});
}

const opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = secretKey;

exports.jwtPassport = passport.use(new JwtStrategy(opts, 
    (jwt_payload, done) => {
        UserModel.findByPk(jwt_payload.id)
        .then((user) => done(null, user))
        .catch((err) => done(err, false));
    }
));

exports.verifyUser =  passport.authenticate('jwt', {session: false});

exports.verifyAdmin = [passport.authenticate('jwt', {session: false}), (req, res, next) => {
    if (req.user && req.user.admin) {
        next();
    } else {
        var err = new Error('U are not authorized to perform this action!');
        err.status = 403;
        next(err);
    }
}];
