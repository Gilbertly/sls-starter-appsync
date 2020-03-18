# sls-starter-appsync

Serverless starter kit for DNS, CDN, Auth, and ACM resources (GraphQL front-door).

## Setup

### AppSync, CloudFront, and Route53

- Deploy appsync, route53, and acm config.
- Manually copy the originid from appsync; this is the appsync url without the 'https://' and the trailing '/graphql'.
- Add the originid value to ssm.
- Add route53 recordsetgroup config, referencing cloudfront.
