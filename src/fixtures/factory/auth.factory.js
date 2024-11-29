import { faker } from '@faker-js/faker';

export class Auth {
  static generateUser() {
    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();

    const newUser = {
      username: faker.internet.userName({ firstName, lastName }),
      firstName: firstName,
      lastName: lastName,
      password: faker.internet.password({
        length: 8,
        pattern: /[A-Z0-9]/,
        prefix: '1a',
      }),
    };

    return newUser;
  };
};