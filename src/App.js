import { createRef, useEffect } from "react";
import "./App.css";
import { columns } from "./columns";
import Container from "./components/Container";
import { dataSource } from "./mock";
import { createDownloadLink } from "./utils";

function App() {
  let cantainerRef = createRef();
  const tableOptions = {
    borderLineWidth: 1,
    borderColor: "#FFFFFF",
    rowHeight: 45,
    fontFamily: "sans-serif",
    textAlign: "center",
    textBaseline: "center",
    fontSize: 16.0,
    color: "#000000",
    header: {
      backgroundColor: "#ffa500",
    },
    body: {
      backgroundColor: "#008000",
    },
  };
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

  useEffect(() => {
    window.GoInstanceWorker.addEventListener(
      "message",
      function ({ data = {} }) {
        const { type, message } = data;
        if ((type === "getCsv" || type === "getExcel") && message) {
          setTimeout(() => {
            createDownloadLink(message.url, message.filename);
          });
        }
      },
    );
  });
  return (
    <>
      <Container
        ref={(el) => (cantainerRef = el)}
        columns={sortFixedColumns(columns)}
        dataSource={dataSource}
        onScrollToTop={handleScrollToTop}
        onScrollToBottom={handleScrollToBottom}
        options={tableOptions}
      />
      <div>
        <button
          style={{ marginRight: 15 }}
          onClick={() => {
            const filename = window.prompt("Please enter filename!", "test");
            window.GoInstanceWorker.postMessage({
              type: "getCsv",
              message: {
                dataSource: cantainerRef.stage.getDataSource(),
                filename,
              },
            });
          }}
        >
          export dataSource to csv file
        </button>
        <button
          onClick={() => {
            const filename = window.prompt("Please enter filename!", "test");
            window.GoInstanceWorker.postMessage({
              type: "getExcel",
              message: {
                dataSource: cantainerRef.stage.getDataSource(),
                filename,
                columns: cantainerRef.stage.columns,
                tableOptions: cantainerRef.stage.options,
              },
            });
          }}
        >
          export dataSource to excel file
        </button>
      </div>
    </>
  );
}

export default App;
