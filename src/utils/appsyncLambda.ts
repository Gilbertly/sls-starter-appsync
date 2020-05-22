interface AppSyncLambdaEvent {
  arguments?: any;
  identity: {
    defaultAuthStrategy: string;
    issuer: string;
    sub: string;
    username: string;
    sourceIp: [string];
    claims: {
      sub: string;
      email_verified: boolean;
      iss: string;
      aud: string;
      event_id: string;
      token_use: string;
      auth_time: number;
      exp: number;
      iat: number;
      email: string;
      'cognito:groups': [string];
      'cognito:username': string;
      'custom:userId': string;
    };
  };
}

export { AppSyncLambdaEvent };
