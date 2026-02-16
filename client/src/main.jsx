import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { Provider } from "react-redux";
import { store } from "./store/store.js";

import { axiosInstance } from "./lib/axios.js";

// Debugging: Log the API URL to confirm deployment version
console.log("🚀 Custom Axios Base URL:", axiosInstance.defaults.baseURL);

createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <App />
  </Provider>
);
