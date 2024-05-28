const dotenv = require('dotenv');

const environment = '.prod'

dotenv.config({
    path: environment === '.prod' ? '.prod.env' : '.dev.env'
});

module.exports = {
    MONGO_URL:process.env.MONGO_URL,
    ENV:process.env.ENV,
    SECRET:process.env.SECRET,
    PORT:process.env.PORT
}