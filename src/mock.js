import faker from "faker";

export const columns = [
  {
    title: "No.",
    width: 100,
    key: "id",
    fixed: true,
  },
  {
    title: "Avatar",
    width: 100,
    type: "image",
    key: "avatar",
    fixed: true,
  },
  {
    title: "Name",
    width: 120,
    key: "name",
    fixed: true,
  },
  {
    title: "Age",
    width: 100,
    key: "age",
  },
  {
    title: "Province",
    width: 100,
    key: "province",
  },
  {
    title: "City",
    width: 120,
    key: "city",
  },
  {
    title: "Address",
    width: 200,
    key: "address",
  },
  {
    title: "ZipCode",
    width: 100,
    key: "zipcode",
  },
  {
    title: "Description",
    width: 250,
    key: "description",
  },
  {
    title: "Action",
    width: 100,
    key: "action",
  },
];

export const dataSourceCreator = function (source = [], size = 1000) {
  for (let i = 0; i < size; i++) {
    source.push({
      id: "" + i, // faker.datatype.uuid(),
      avatar: faker.image.avatar(),
      province: faker.address.state(),
      city: faker.address.city(),
      name: faker.name.findName(),
      zipcode: faker.address.zipCode(),
      age: faker.datatype.number(100),
      description: faker.lorem.sentence(),
      address: faker.address.streetAddress(),
    });
  }
  return source;
};

export const dataSource = dataSourceCreator([]);
