const jwt = require('jsonwebtoken')

const PRIVATE_KEY = process.env.JWT_SECRET;

module.exports = {

    

    generateToken: credentials => {
        const token = jwt.sign(credentials, PRIVATE_KEY, { expiresIn: '24h' })
        return token
    },


    verifyToken: (req, res, next) => {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            return res.status(401).json({ error: 'Authorization header missing' });
        }

        const [, token] = authHeader.split(' ')[1];
        if (!token) {
            return res.status(401).json({ error: 'Token not found' });
        }

        jwt.verify(token, PRIVATE_KEY, (err, credentials) => {
            if (err) {
                return res.status(401).json({ error: 'Invalid Token' });
            }

            req.authUser = credentials;
            next();
        });
    }


}
