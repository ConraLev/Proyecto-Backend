const { Command } = require('commander');

const program = new Command();

program
    .description('Prueba')
    .option('-m, --mode <mode>', 'Modo de ejecucion', 'prod')

program.parse()


console.log(program.opts())