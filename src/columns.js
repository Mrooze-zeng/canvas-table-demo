export const COLUMN_TYPE = {
  IMAGE: Symbol("image"),
  TEXT: Symbol("text"),
  FUNCTION_BOX: Symbol("function-box"),
  EDITABLE: Symbol("editable"),
};

export const columns = [
  {
    title: "No.",
    width: 100,
    type: COLUMN_TYPE.TEXT,
    key: "id",
    fixed: true,
  },
  {
    title: "Avatar",
    width: 100,
    type: COLUMN_TYPE.IMAGE,
    key: "avatar",
    fixed: true,
  },
  {
    title: "Name",
    width: 120,
    type: COLUMN_TYPE.EDITABLE,
    key: "name",
    fixed: true,
  },
  {
    title: "Age",
    width: 100,
    key: "age",
    type: COLUMN_TYPE.EDITABLE,
  },
  {
    title: "Province",
    width: 100,
    key: "province",
    type: COLUMN_TYPE.EDITABLE,
  },
  {
    title: "City",
    width: 120,
    key: "city",
    type: COLUMN_TYPE.EDITABLE,
  },
  {
    title: "Address",
    width: 200,
    key: "address",
    type: COLUMN_TYPE.EDITABLE,
  },
  {
    title: "ZipCode",
    width: 100,
    key: "zipcode",
    type: COLUMN_TYPE.EDITABLE,
  },
  {
    title: "Description",
    width: 250,
    key: "description",
    type: COLUMN_TYPE.EDITABLE,
  },
  {
    title: "Action",
    width: 100,
    key: "action",
    type: COLUMN_TYPE.FUNCTION_BOX,
  },
];
