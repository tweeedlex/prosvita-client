import axios from "axios";
import { Route, Routes } from "react-router";
import { useLocation } from "react-router-dom";
import { ItemPage } from "./pages/ItemPage";
import { MainPage } from "./pages/MainPage";
import { observer } from "mobx-react-lite";
import { useContext, useEffect, useState } from "react";
import { SERVER_URL } from "./config";
import { AdminPage } from "./pages/AdminPage";
import { useTheme } from "./hooks/useTheme";
import { OrdersPage } from "./pages/OrdersPage";
import { TitlePage } from "./pages/TitlePage";
import { Header } from "./components/Header";
import { Footer } from "./components/Footer";
import { check, login } from "./http/userAPI";
import { Context } from "./index";
import { fetchBrands, fetchTypes } from "./http/itemAPI";
import fetchBasket from "./utils/fetchBasket";

const App = observer(() => {
  const { user: userContext, item } = useContext(Context);

  useEffect(() => {
    check().then((data) => {
      userContext.setIsAuth(true);
      userContext.setUser(data);
    });
    fetchTypes().then((data) => item.setTypes(data));
    fetchBrands().then((data) => item.setBrands(data));
    fetchBasket().then((data) => item.setBasket(data));
  }, []);

  const location = useLocation();

  const { theme, setTheme } = useTheme();

  const changeTheme = () => {
    if (theme === "dark") {
      return setTheme("light");
    }
    setTheme("dark");
  };

  const [basketModalVisible, setBasketModalVisible] = useState(false);

  return (
    <div
      className={`App ${
        location.pathname === "/admin" ||
        location.pathname === "/orders" ||
        location.pathname === "/catalog" ||
        location.pathname.includes("/item")
          ? "backgrounded"
          : ""
      }`}
    >
      <Header userContext={userContext} />

      <div className="main">
        <Routes>
          <Route path="/" element={<TitlePage />} />
          <Route path="/catalog" element={<MainPage />} />
          <Route
            path="/item/:id"
            element={<ItemPage isAdmin={userContext.role === "ADMIN"} />}
          />
          {userContext.user.role === "ADMIN" && (
            <Route path="/admin" element={<AdminPage />} />
          )}
          {userContext.user.role === "MANAGER" && (
            <Route path="/orders" element={<OrdersPage />} />
          )}
        </Routes>
      </div>

      <Footer />
    </div>
  );
});

export default App;
