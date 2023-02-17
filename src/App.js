import axios from "axios";
import { Route, Routes } from "react-router";
import { Link, useLocation } from "react-router-dom";
import { BasketPage } from "./pages/BasketPage";
import { BrandPage } from "./pages/BrandPage";
import { TypePage } from "./pages/TypePage";
import { ItemPage } from "./pages/ItemPage";
import { MainPage } from "./pages/MainPage";
import { LoginPage } from "./pages/LoginPage";
import { RegistrationPage } from "./pages/RegistrationPage";
import { observer } from "mobx-react-lite";
import { useEffect, useState } from "react";
import { SERVER_URL } from "./config";
import { AdminPage } from "./pages/AdminPage";
import { useTheme } from "./hooks/useTheme";
import { OrdersPage } from "./pages/OrdersPage";
import { Menu } from "./components/Menu";
import { TitlePage } from "./pages/TitlePage";
import { Basket } from "./components/Basket";
import { Modal } from "./components/Modal";
import { Header } from "./components/Header";
import { Footer } from "./components/Footer";

const App = observer(() => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [isManager, setIsManager] = useState(false);
  const [email, setEmail] = useState(undefined);

  const location = useLocation();

  useEffect(() => {
    getRole();
    getEmail();
  }, [location.pathname, email]);

  const getRole = async () => {
    try {
      if (localStorage.getItem("user-token")) {
        const { data: role } = await axios.get(SERVER_URL + "/api/user", {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("user-token"),
          },
        });

        if (role === "ADMIN") {
          setIsAdmin(true);
        } else if (role === "MANAGER") {
          setIsManager(true);
        }
      }
    } catch (e) {
      console.log(e);
    }
  };

  const getEmail = async () => {
    try {
      if (localStorage.getItem("user-token")) {
        const { data } = await axios.get(SERVER_URL + "/api/user/email", {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("user-token"),
          },
        });
        setEmail(data);
      }
    } catch (e) {
      console.log(e);
    }
  };


  const { theme, setTheme } = useTheme();

  const changeTheme = () => {
    if (theme === "dark") {
      return setTheme("light");
    }
    setTheme("dark");
  };

  const [basketModalVisible, setBasketModalVisible] = useState(false);

  return (
    <div className={`App ${location.pathname === "/catalog" || location.pathname.includes("/item") ? "backgrounded" : ""}`}>
      <Header setIsAdmin={setIsAdmin} setIsManager={setIsManager} setEmail={setEmail}/>

      <div className="main">
        <Routes>
          <Route path="/" element={<TitlePage />} />
          <Route path="/catalog" element={<MainPage />} />
          <Route path="/item/:id" element={<ItemPage isAdmin={isAdmin} />} />
          <Route path="/brand/:id" element={<BrandPage />} />
          <Route path="/type/:id" element={<TypePage />} />
          <Route path="/basket" element={<BasketPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/registration" element={<RegistrationPage />} />
          {isAdmin && <Route path="/admin" element={<AdminPage />} />}
          {isManager && <Route path="/orders" element={<OrdersPage />} />}
        </Routes>
      </div>

      <Footer />
    </div>
  );
});

export default App;
