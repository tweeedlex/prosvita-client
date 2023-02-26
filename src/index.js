import React, { createContext } from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import "./pagination.css";
import "./swiper.css";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import UserStore from "./store/UserStore";
import ItemStore from "./store/ItemStore";
import basketStore from "./store/basketStore";

export const Context = createContext(null)

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <Context.Provider
      value={{
        user: new UserStore(),
        item: new ItemStore(),
        basket: new basketStore()
      }}
    >
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Context.Provider>
  </React.StrictMode>
);
