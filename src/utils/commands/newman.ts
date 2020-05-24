import * as yargs from 'yargs';
import * as newman from 'newman';

const baseUrl = 'https://api.getpostman.com';
const apiKey = process.env.POSTMAN_API_KEY || '';
const collectionId = process.env.POSTMAN_COLLECTION_ID || '';

export const build = (): yargs.CommandModule => {
  const runCmd = async (args: any) => {
    const env = args.environment;
    let envId: string = process.env.POSTMAN_ENV_DEV_ID || '';
    if (env === 'prod') envId = process.env.POSTMAN_ENV_PROD_ID || '';

    newman.run({
      collection: `${baseUrl}/collections/${collectionId}?apikey=${apiKey}`,
      environment: `${baseUrl}/environments/${envId}?apikey=${apiKey}`,
      reporters: 'cli',
    });
  };

  return {
    command: 'newman <environment>',
    describe: 'Runs integration tests on a postman collection.',
    handler: (args: any) => runCmd(args).catch(console.error),
    builder: (args: yargs.Argv) =>
      args
        .option('environment', { type: 'string' })
        .demandOption('environment'),
  };
};
