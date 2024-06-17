const dotenv = require('dotenv');
const path = require('path');
const options = require('./commander');

const mode = options.mode || 'prod';


dotenv.config({
    path: mode === 'prod' ? path.resolve(__dirname, '.prod.env') : path.resolve(__dirname, '.dev.env')
});



module.exports = {
    MONGO_URL: process.env.MONGO_URL,
    ENV: process.env.ENV,
    SECRET: process.env.SECRET,
    PORT: process.env.PORT,
    STORAGE_TYPE: process.env.STORAGE_TYPE
};

