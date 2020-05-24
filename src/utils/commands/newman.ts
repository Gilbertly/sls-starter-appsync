import * as yargs from 'yargs';
import * as ora from 'ora';
import * as newman from 'newman';

const spinner = ora({ spinner: 'bouncingBar' });
const baseUrl = 'https://api.getpostman.com'
const apiKey = process.env.POSTMAN_API_KEY || '';
const collectionId = process.env.POSTMAN_COLLECTION_ID || '';
const envDevId = process.env.POSTMAN_ENV_DEV_ID || '';

export const build = (): yargs.CommandModule => {
  const runCmd = async (args: any) => {
    newman
      .run({
        collection: `${baseUrl}/collections/${collectionId}?apikey=${apiKey}`,
        environment: `${baseUrl}/environments/${envDevId}?apikey=${apiKey}`,
        reporters: 'cli',
      })
      .on('start', (error, summary) => {
        if (error || summary.error) throw error;
        spinner.info(`Running collection ...`);
      })
      .on('done', (error, summary) => {
        if (error || summary.error) throw error;
        spinner.succeed(`Completed collection run!`);
      });
  };

  return {
    command: 'newman',
    describe: 'Runs integration tests on a postman collection.',
    handler: (args: any) => runCmd(args).catch(console.error),
  };
};
