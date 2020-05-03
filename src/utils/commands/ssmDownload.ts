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
    path: string;
    filename: string;
  }

  interface DownloadedParams {
    Name: string;
    Type: string;
    Value: string;
    Description: string;
    Overwrite: boolean;
  }

  const getParametersByPath = async (path: string, nextToken?: string) => {
    if (nextToken) {
      return await ssm
        .getParametersByPath({
          Path: path,
          Recursive: true,
          NextToken: nextToken,
        })
        .promise();
    } else {
      return await ssm
        .getParametersByPath({
          Path: path,
          Recursive: true,
        })
        .promise();
    }
  };

  const getParameterHistory = async (param: string) => {
    const response = await ssm.getParameterHistory({ Name: param }).promise();
    if (response.Parameters) return response.Parameters[0];
    return;
  };

  const saveFile = (filename: string, params: SSM.Parameter[]) => {
    const downloadPath = path.resolve(
      __dirname,
      `../../../config/ssm.${filename}.json`,
    );
    fs.writeFileSync(downloadPath, JSON.stringify(params, null, 2));
    spinner.succeed(
      `Saved '${params.length}' params to './config/ssm.${filename}.json'!`,
    );
  };

  const getPaginatedParameters = async (
    ssmParameterPath: string,
    nextToken: string,
    params: DownloadedParams[],
  ) => {
    const response = await getParametersByPath(ssmParameterPath, nextToken);
    if (response.Parameters && response.NextToken) {
      await Promise.all(
        response.Parameters.map(async (param) => {
          const paramHistory = await getParameterHistory(param.Name || '');
          if (paramHistory)
            params.push({
              Name: param.Name || '',
              Type: param.Type || '',
              Value: param.Value || '',
              Description: paramHistory.Description || '',
              Overwrite: true,
            });
        }),
      );
      await getPaginatedParameters(
        ssmParameterPath,
        response.NextToken,
        params,
      );
    } else if (response.Parameters) {
      await Promise.all(
        response.Parameters.map(async (param) => {
          const paramHistory = await getParameterHistory(param.Name || '');
          if (paramHistory)
            params.push({
              Name: param.Name || '',
              Type: param.Type || '',
              Value: param.Value || '',
              Description: paramHistory.Description || '',
              Overwrite: true,
            });
        }),
      );
    }
  };

  const download = async (args: SSMDownloadProps) => {
    const ssmParameterPath = args.path;
    const downloadFilename = args.filename;
    const responseParams: DownloadedParams[] = [];

    spinner.start(`Downloading SSM params in path '${ssmParameterPath}'`);
    const response = await getParametersByPath(ssmParameterPath);

    if (response.Parameters && response.NextToken) {
      await Promise.all(
        response.Parameters.map(async (param) => {
          const paramHistory = await getParameterHistory(param.Name || '');
          if (paramHistory)
            responseParams.push({
              Name: param.Name || '',
              Type: param.Type || '',
              Value: param.Value || '',
              Description: paramHistory.Description || '',
              Overwrite: false,
            });
        }),
      );
      await getPaginatedParameters(
        ssmParameterPath,
        response.NextToken,
        responseParams,
      );
      saveFile(downloadFilename, responseParams);
    } else if (response.Parameters) {
      await Promise.all(
        response.Parameters.map(async (param) => {
          const paramHistory = await getParameterHistory(param.Name || '');
          if (paramHistory)
            responseParams.push({
              Name: param.Name || '',
              Type: param.Type || '',
              Value: param.Value || '',
              Description: paramHistory.Description || '',
              Overwrite: true,
            });
        }),
      );
      saveFile(downloadFilename, responseParams);
    }
  };

  return {
    command: 'ssmDownload <path> <filename>',
    describe: 'Pulls AWS SSM parameters into local file.',
    handler: (args: any) => download(args).catch(console.error),
    builder: (args: yargs.Argv) =>
      args
        .option('path', { type: 'string' })
        .demandOption('path')
        .option('filename', { type: 'string' })
        .demandOption('filename'),
  };
};
