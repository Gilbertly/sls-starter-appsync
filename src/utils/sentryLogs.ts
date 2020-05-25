import * as Sentry from '@sentry/node';
import { Context } from 'aws-lambda';

export const captureException = (context: Context, error: any) => {
  Sentry.captureException({
    RequestId: context.awsRequestId,
    ErrorName: error.name,
    ErrorMessage: error.message,
    FunctionName: context.functionName,
    FunctionVersion: context.functionVersion,
    MemoryLimit: context.memoryLimitInMB,
  });
};

export const captureMessage = (message: string) => {
  Sentry.captureMessage(message);
};
