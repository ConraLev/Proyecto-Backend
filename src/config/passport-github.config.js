const passport = require('passport');
const { Strategy } = require('passport-github2');
const User = require('../dao/models/user.model');
const Cart = require('../dao/models/carts.model');
const { clientID, clientSecret, callbackURL} = require('../config/github.private');

const initializeStrategyGit = () => {
    passport.use('github', new Strategy({
        clientID,
        clientSecret,
        callbackURL
    }, async (_accessToken, _refreshToken, profile, done) => {
        try {
            let user = await User.findOne({ email: profile._json.email });
    
            if (user) {;
                return done(null, user);
            }
    
            const fullName = profile._json.name;
            const nameParts = fullName.split(' ');
            const firstName = nameParts[0];
            const lastName = nameParts.slice(1).join(' ');
    
            const newUser = {
                firstName,
                lastName,
                email: profile._json.email,
                password: ''
            };


            const result = await User.create(newUser);

            const newCart = new Cart({ userId: result._id, products: [] });
            await newCart.save();

            result.cartId = newCart._id;
            await result.save();


            return done(null, result);
        } catch (error) {
            return done(error);
        }
    }));

    passport.serializeUser((user, done) => {
        done(null, user._id)
    })

    passport.deserializeUser(async (id, done) => {
        const user = await User.findById(id)
        done(null, user)
    })
}

module.exports = initializeStrategyGit;