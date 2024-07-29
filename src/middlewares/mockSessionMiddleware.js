module.exports = (req, res, next) => {
    req.session = {
        user: {
            _id: '66946a85f7e1958d80940285',
            firstName: 'Conrado',
            lastName: 'Levanti',
            email: 'Tester.maildeprueba@gmail.com',
            role: 'premium',
            cartId: '66946a85f7e1958d80940287'
        },
        touch: () => {},
        save: () => {},
        cookie: {
            path: '/',
            _expires: null,
            originalMaxAge: null,
            httpOnly: true,
            secure: false
        }
    };
    next();
};
