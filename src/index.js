import React, { createContext } from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import "./pagination.css";
import "./swiper.css";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import UserStore from "./store/UserStore";
import ItemStore from "./store/ItemStore";

export const Context = createContext(null)

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <Context.Provider
      value={{
        user: new UserStore(),
        device: new ItemStore()
      }}
    >
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Context.Provider>
  </React.StrictMode>
);
