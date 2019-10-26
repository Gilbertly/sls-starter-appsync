/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/no-explicit-any */
import * as yargs from 'yargs';

export const build = (): yargs.CommandModule => {
  interface SSMDownloadProps {
    path: string;
  }

  const download = async (args: SSMDownloadProps) => {
    const ssmParameterPath = args.path;
    console.log(`Downloading SSM params in path '${ssmParameterPath}' ...`);
  };

  return {
    command: 'ssm.download <path>',
    describe: 'Pulls AWS SSM parameters into local file.',
    handler: (args: any) => download(args).catch(console.error),
    builder: (args: yargs.Argv) =>
      args.option('path', { type: 'string' }).demandOption('path'),
  };
};
