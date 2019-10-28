/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/no-explicit-any */
import * as yargs from 'yargs';

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
