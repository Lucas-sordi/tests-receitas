import { faker } from '@faker-js/faker';

export class Reviews {
  static generateReview() {
    const newReview = {
      avaliation: faker.number.int({ min: 1, max: 5 }),
      comment: faker.lorem.sentences(),
    };

    return newReview;
  };
};