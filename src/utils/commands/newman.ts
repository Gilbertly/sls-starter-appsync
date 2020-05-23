import * as yargs from 'yargs';
import * as ora from 'ora';
import * as newman from 'newman';

const spinner = ora({ spinner: 'bouncingBar' });
const apiKey = process.env.POSTMAN_API_KEY || '';
const collectionId = process.env.POSTMAN_COLLECTION_ID || '';

export const build = (): yargs.CommandModule => {
  const runCmd = async (args: any) => {
    spinner.info(`Running collection ...`);

    newman.run(
      {
        collection: `https://api.getpostman.com/collections/${collectionId}?apikey=${apiKey}`,
        reporters: 'cli',
      },
      (error: any) => {
        if (error) throw error;
        spinner.succeed(`Successfully ran collection!`);
      },
    );
  };

  return {
    command: 'newman',
    describe: 'Runs integration tests on a postman collection.',
    handler: (args: any) => runCmd(args).catch(console.error),
  };
};
