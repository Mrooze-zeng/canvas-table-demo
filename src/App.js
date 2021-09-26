import "./App.css";
import Container from "./components/Container";
import { columns, dataSource } from "./mock";

function App() {
  return <Container columns={columns} dataSource={dataSource} />;
}

export default App;
