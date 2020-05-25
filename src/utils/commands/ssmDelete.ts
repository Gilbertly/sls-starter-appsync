import * as yargs from 'yargs';
import * as path from 'path';
import * as fs from 'fs';
import { SSM } from 'aws-sdk';
import * as ora from 'ora';

const spinner = ora({ spinner: 'bouncingBar' });
const ssm = new SSM({ region: process.env.REGION || 'us-east-1' });

export const build = (): yargs.CommandModule => {
  interface SSMDeleteProps {
    filename: string;
  }

  const readFile = (filename: string): SSM.DeleteParameterRequest[] => {
    let ssmParams: SSM.DeleteParameterRequest[] = [];
    try {
      const filepath = path.resolve(
        __dirname,
        `../../../config/ssm.${filename}.json`,
      );
      const jsonData = fs.readFileSync(filepath, 'utf-8');
      ssmParams = JSON.parse(jsonData);
    } catch (error) {
      spinner.fail(error.message);
      process.exit(1);
    }
    return ssmParams;
  };

  const deleteParameters = async (params: SSM.DeleteParameterRequest[]) => {
    await Promise.all(
      params.map(async param => {
        try {
          await ssm
            .deleteParameter({
              Name: param.Name,
            })
            .promise();
        } catch (error) {
          if (error.code !== 'ParameterNotFound') {
            spinner.stop();
            throw error;
          }
        }
      }),
    );
  };

  const deleteCmd = async (args: SSMDeleteProps) => {
    const ssmFilename = args.filename;
    spinner.start(
      `Deleting SSM params from './config/ssm.${ssmFilename}.json' ...`,
    );
    const ssmParams = readFile(ssmFilename);
    await deleteParameters(ssmParams);
    spinner.succeed(`Deleted '${ssmParams.length}' ssm parameters!`);
  };

  return {
    command: 'ssmDelete <filename>',
    describe: 'Deletes AWS SSM parameters from local file.',
    handler: (args: any) => deleteCmd(args).catch(console.error),
    builder: (args: yargs.Argv) =>
      args.option('filename', { type: 'string' }).demandOption('filename'),
  };
};
