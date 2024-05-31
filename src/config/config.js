const dotenv = require('dotenv');
const path = require('path');

const mode = process.env.MODE || 'prod';

dotenv.config({
    path: mode === 'prod' ? path.resolve(__dirname, '.prod.env') : path.resolve(__dirname, '.dev.env')
});

module.exports = {
    MONGO_URL: process.env.MONGO_URL,
    ENV: process.env.ENV,
    SECRET: process.env.SECRET,
    PORT: process.env.PORT
};


/* const dotenv = require('dotenv');
const path = require('path');
const { Command } = require('commander');

const program = new Command();
program.option('-m, --mode <mode>', 'Modo de ejecucion', 'prod');
program.parse(process.argv);

const options = program.opts();
const environment = options.mode || 'prod';

dotenv.config({
    path: environment === 'prod' ? path.resolve(__dirname, '.prod.env') : path.resolve(__dirname, '.dev.env')
});

module.exports = {
    MONGO_URL: process.env.MONGO_URL,
    ENV: process.env.ENV,
    SECRET: process.env.SECRET,
    PORT: process.env.PORT
}; */