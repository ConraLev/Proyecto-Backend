// const isProduction = process.env.ENV === 'prod';

// module.exports = {
//     appId: '886871',
//     clientID: 'Iv1.e9bc8072805cd4e7',
//     clientSecret: '868670bb545e8b6b8f8716af8abd2be62513771b',
//     callbackURL: isProduction 
//         ? 'https://proyecto-ecommerce.up.railway.app/sessions/githubcallback'
//         : `http://localhost:${process.env.PORT}/sessions/githubcallback`
// };


module.exports = {
    appId: '886871',
    clientID: 'Iv1.e9bc8072805cd4e7',
    clientSecret: '868670bb545e8b6b8f8716af8abd2be62513771b',
    callbackURL: process.env.CALLBACKURL
};
