import faker from "faker";

export const columns = [
  {
    title: "No.",
    width: 100,
    key: "id",
    fixed: true,
  },
  {
    title: "Name",
    width: 120,
    key: "name",
    // fixed: true,
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

export const dataSource = (function (size = 50) {
  let output = [];
  for (let i = 0; i < size; i++) {
    output.push({
      id: i, // faker.datatype.uuid(),
      province: faker.address.state(),
      city: faker.address.city(),
      name: faker.name.findName(),
      zipcode: faker.address.zipCode(),
      age: faker.datatype.number(100),
      description: faker.lorem.sentence(),
      address: faker.address.streetAddress(),
    });
  }
  return output;
})(1000);
