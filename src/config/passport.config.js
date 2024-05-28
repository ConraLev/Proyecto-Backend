const passport = require('passport');
const { Strategy } = require('passport-local');
const User = require('../../dao/models/user.model');
const { hashPassword, isValidPassword } = require('../utils/hashing');

const initilizeStrategy = () => {

    passport.use('register', new Strategy({
        passReqToCallback: true, 
        usernameField: 'email'
    }, async (req, username, password, done) =>{

        const { firstName, lastName, age, email } = req.body

        try {
            const user = await User.findOne({ email: username })
            
            if (user){
                
                return done(null, false)
            }

            const hashedPassword = hashPassword(password)
            
            const newUser = {
                firstName,
                lastName,
                age: +age,
                email,
                password: hashedPassword
            }

            const result = await User.create(newUser)
            return done(null, result)

        } catch (error) {
            done(error)
        }
    }))

    passport.use('login', new Strategy({
        usernameField: 'email'
    }, async(username, password, done) =>{

        if (!username || !password) {
            return res.status(400).json({ error: 'Datos inválidos' });
        }
        if (username === adminUser.email && password === adminUser.password) {
            req.session.user = adminUser;
            res.redirect('/products');
        } else {
            try {
                const user = await User.findOne({ email: username });
                if (!user) {
                    return res.status(401).json({ error: 'Email no registrado' });
                }
    
                if(!isValidPassword(password, user.password)){
                    return res.status(401).json({ error: 'Contraseña Incorrecta'})
                }
    
                req.session.user = { email: user.email, firstName: user.firstName, lastName: user.lastName, _id: user._id.toString(), role: user.role };
                res.redirect('/products');
            } catch (error) {
                console.error('Error al buscar usuario en la base de datos:', error);
                res.status(500).json({ error: 'Error interno del servidor' });
            }
        }


    }))


    passport.serializeUser((user, done) =>{
        done(null, user._id)
    })

    passport.deserializeUser(async (id, done) => {
        const user = await User.findById(id)
        done(null, user)
    })

};


module.exports = initilizeStrategy