import "./App.css";
import Container from "./components/Container";
import { columns, dataSource } from "./mock";

function App() {
  const sortFixedColumns = function (columns = []) {
    let ouput = columns.filter((col) => col.fixed);
    return ouput.concat(columns.filter((col) => !col.fixed));
  };
  return (
    <Container columns={sortFixedColumns(columns)} dataSource={dataSource} />
  );
}

export default App;
