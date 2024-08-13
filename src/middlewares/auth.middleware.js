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
        return res.status(403).send('Acceso Restringido - Unicamente para Admin');
    },
    
    ensureAuthenticated: (req, res, next) => {
        if (req.session && req.session.user) {
            req.user = req.session.user; 
            return next();
        }
        res.status(401).json({ error: 'No autorizado' });
    }

}




