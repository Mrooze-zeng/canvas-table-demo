import "./App.css";
import Container from "./components/Container";
import { columns, dataSource } from "./mock";

function App() {
  const sortFixedColumns = function (columns = []) {
    let ouput = columns.filter((col) => col.fixed);
    return ouput.concat(columns.filter((col) => !col.fixed));
  };
  const handleScrollToTop = function () {
    console.log("to the top");
  };
  const handleScrollToBottom = function () {
    console.log("to the bottom");
  };
  return (
    <Container
      columns={sortFixedColumns(columns)}
      dataSource={dataSource}
      onScrollToTop={handleScrollToTop}
      onScrollToBottom={handleScrollToBottom}
    />
  );
}

export default App;
