/* eslint-disable @typescript-eslint/explicit-function-return-type */
import * as yargs from 'yargs';
import * as path from 'path';
import * as fs from 'fs';
import { SSM } from 'aws-sdk';
import * as ora from 'ora';

const spinner = ora({ spinner: 'bouncingBar' });
const ssm = new SSM({ region: process.env.REGION || 'us-east-1' });

export const build = (): yargs.CommandModule => {
  interface SSMDownloadProps {
    filename: string;
  }

  const readFile = (filename: string): SSM.PutParameterRequest[] => {
    let ssmParams: SSM.PutParameterRequest[] = [];
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

  const updateParameters = async (params: SSM.PutParameterRequest[]) => {
    await Promise.all(
      params.map(async (param) => {
        try {
          await ssm
            .putParameter({
              Name: param.Name,
              Type: param.Type,
              Value: param.Value,
              Description: param.Description,
              Overwrite: param.Overwrite,
            })
            .promise();
        } catch (error) {
          if (error.code !== 'ParameterAlreadyExists') {
            spinner.stop();
            throw error;
          }
        }
      }),
    );
  };

  const update = async (args: SSMDownloadProps) => {
    const ssmFilename = args.filename;
    spinner.start(
      `Updating SSM params from './config/ssm.${ssmFilename}.json' ...`,
    );
    const ssmParams = readFile(ssmFilename);
    await updateParameters(ssmParams);
    spinner.succeed(`Updated '${ssmParams.length}' ssm parameters!`);
  };

  return {
    command: 'ssmUpdate <filename>',
    describe: 'Updates AWS SSM parameters from local file.',
    handler: (args: any) => update(args).catch(console.error),
    builder: (args: yargs.Argv) =>
      args.option('filename', { type: 'string' }).demandOption('filename'),
  };
};
