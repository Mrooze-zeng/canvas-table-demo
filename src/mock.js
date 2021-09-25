import faker from "faker";

export const columns = [
  {
    title: "No.",
    width: 100,
    key: "id",
  },
  {
    title: "Name",
    width: 100,
    key: "name",
  },
  {
    title: "Age",
    width: 100,
    key: "age",
  },
  {
    title: "Provice",
    width: 100,
    key: "provice",
  },
  {
    title: "City",
    width: 100,
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

export const dataSource = (function (size = 100) {
  let output = [];
  for (let i = 0; i < size; i++) {
    output.push({
      id: faker.datatype.uuid(),
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
})(10000);
