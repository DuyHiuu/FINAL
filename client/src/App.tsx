import { useState } from "react";
import { BrowserRouter as Router, RouterProvider } from "react-router-dom";

import { router } from "./router";

function App() {
  const [count, setCount] = useState(0);

  return <RouterProvider router={router} />;
}
//mới
export default App;
