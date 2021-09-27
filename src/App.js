import { useEffect } from "react";
import "./App.css";
import { columns } from "./columns";
import Container from "./components/Container";
import { dataSource } from "./mock";

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
  const createDownloadLink = function (url = "", filename = "") {
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    link.remove();
  };
  useEffect(() => {
    window.GoInstanceWorker.addEventListener(
      "message",
      function ({ data = {} }) {
        const { type, message } = data;
        if (type === "getExcel" && message) {
          const url = URL.createObjectURL(
            new Blob([message.data.buffer], {
              type: message.type,
            }),
          );
          console.log(data);
          createDownloadLink(url, message.filename);
          URL.revokeObjectURL(url);
        }
      },
    );
  });
  return (
    <>
      <Container
        columns={sortFixedColumns(columns)}
        dataSource={dataSource}
        onScrollToTop={handleScrollToTop}
        onScrollToBottom={handleScrollToBottom}
      />
    </>
  );
}

export default App;
