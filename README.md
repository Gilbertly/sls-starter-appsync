# sls-starter-appsync

Serverless starter kit for GraphQL resources to integrate frontend and backend.

## Setup

```sh
// download project secrets previously deplooyed
$ npm run cli:cmd ssm.download dev

// modify & update project secrets
$ npm run cli:cmd ssm.update dev

// deploy dev resources
$ npm run deploy:dev

// copy originid from appsync
// remove starting 'https://' & the trailing '/graphql'
// add the new originid in the domains repo
```
