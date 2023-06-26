import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

import { createRoot } from "react-dom/client";
import ReportDataHandler from "./ReportDataHandler";
import { createHashRouter, Navigate, RouterProvider } from "react-router-dom";
import DragAndDrop from "./components/DragAndDrop/DragAndDrop";
import ThemeContextProvider from "./context/ThemeContext";

const checkIsLocalhost = () => {
  const url = window.location.href;
  const hostname = new URL(url).hostname;
  return hostname === "localhost" || hostname === "127.0.0.1";
};

const router = checkIsLocalhost()
  ? createHashRouter([
      {
        path: "/",
        element: <DragAndDrop />,
      },
      {
        path: "*",
        element: <Navigate to="/" />,
      },
    ])
  : createHashRouter([
      {
        path: "/",
        element: <ReportDataHandler />,
        loader: async () => {
          document.getElementsByTagName("title")[0].textContent =
            " Bowtie-" + "draft2020-12";
          const response = await fetch(
            `${import.meta.env.BASE_URL}/draft2020-12.json`,
            // FOR DEVELOPMENT PUROPOSE,COMMET THE ABOVE LINE AND UNCOMMENT THE BELOW LINE
            // `https://bowtie-json-schema.github.io/bowtie/draft2020-12.json`
          );
          const jsonl = await response.text();
          const dataObjectsArray = jsonl.trim().split(/\r?\n/);
          const lines = dataObjectsArray.map((line) => JSON.parse(line));
          return lines;
        },
      },
      {
        path: "/:draftName",
        element: <ReportDataHandler />,
        loader: async ({ params }) => {
          document.getElementsByTagName("title")[0].textContent =
            " Bowtie-" + params.draftName;
          const response = await fetch(
            `${import.meta.env.BASE_URL}/${params.draftName}.json`,
            // FOR DEVELOPMENT PUROPOSE,COMMET THE ABOVE LINE AND UNCOMMENT THE BELOW LINE
            // `https://bowtie-json-schema.github.io/bowtie/${params.draftName}.json`
          );
          const jsonl = await response.text();
          const dataObjectsArray = jsonl.trim().split(/\r?\n/);
          const lines = dataObjectsArray.map((line) => JSON.parse(line));
          return lines;
        },
      },
      {
        path: "/local-report",
        element: <DragAndDrop />,
      },
    ]);

document.addEventListener("DOMContentLoaded", () => {
  const root = createRoot(document.getElementById("root"));
  root.render(
    <ThemeContextProvider>
      <RouterProvider router={router} />
    </ThemeContextProvider>,
  );
});