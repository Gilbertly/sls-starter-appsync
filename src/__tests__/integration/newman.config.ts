/* eslint-disable @typescript-eslint/explicit-function-return-type */
import * as newman from 'newman';
import * as path from 'path';

const testHello = () => {
  console.log('Testing hello ...');
};

const env = process.env.NODE_ENV;

newman
  .run({
    collection: 'https://www.getpostman.com/collections/d35c477ff0b49f571b58',
    reporter: ['cli', 'html'],
    environment: path.resolve(__dirname, `./config/postman.${env}.json`),
  })
  .on('start', () => {
    console.log(`Running '${env}' collection ...`);
  })
  .on('script', testHello)
  .on('done', (error, summary) => {
    if (error || summary.error) {
      console.log(`Encountered error: ${summary.error}`);
    } else {
      console.log('Successfully completed!');
    }
  });
