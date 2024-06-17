module.exports = {

    userIsLoggedIn: (req, res, next) => {
        const isLoggedIn = ![null, undefined].includes(req.session.user)
        if (!isLoggedIn) {
            return res.status(401).json({ error: 'El usuario deberia estar conectado' })
        }

        next()
    },

    userIsNotLoggedIn: (req, res, next) => {
        const isLoggedIn = ![null, undefined].includes(req.session.user)
        if (isLoggedIn) {
            return res.status(401).json({ error: 'El usuario no deberia estar conectado' })
        }

        next()
    },

    userIsAdmin: (req, res, next) => {
        if (req.user && req.user.role === 'admin') {
            return next();
        }
        return res.status(403).send('Forbidden');
    },
    
    userIsUser: (req, res, next) => {
        if (req.user && req.user.role === 'user') {
            return next();
        }
        return res.status(403).send('Forbidden');
    }

}




