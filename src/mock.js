import faker from "faker";

export const dataSourceCreator = function (source = [], size = 1000) {
  for (let i = 0; i < size; i++) {
    source.push({
      id: "" + i, // faker.datatype.uuid(),
      avatar: faker.image.avatar(),
      province: faker.address.state(),
      city: faker.address.city(),
      name: faker.name.findName(),
      zipcode: faker.address.zipCode(),
      age: "" + faker.datatype.number(100),
      description: faker.lorem.sentence(),
      address: faker.address.streetAddress(),
    });
  }
  return source;
};

export const dataSource = dataSourceCreator([]);
