import { sayHello } from '../functions/getHelloQueryFn';

test('says hello', () => {
  expect(sayHello('Gilbert')).toEqual({
    name: 'Hello Gilbert!',
  });
});
