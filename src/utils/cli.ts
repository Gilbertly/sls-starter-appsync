import * as yargs from 'yargs';
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../../config/.env') });

(async () => {
  const initCommand = (command: any): yargs.CommandModule => {
    return command.build();
  };

  return yargs
    .commandDir('commands', {
      visit: initCommand,
      extensions: ['ts'],
    })
    .demandCommand(1)
    .help().argv;
})();
