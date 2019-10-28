import { Context } from 'aws-lambda';

exports.handler = async (event: any, context: Context): Promise<string> => {
  context.callbackWaitsForEmptyEventLoop = false;
  return 'Hello!';
};
