const { Command } = require('commander')

const program = new Command()

program
    .description('Prueba')
    .option('-m, --mode <mode>', 'Modo de ejecucion', 'prod');

program.parse(process.argv);

const options = program.opts();

process.env.MODE = options.mode;

module.exports = program.opts();

