import React, { useState } from "react";
import styles from "./css/Header.module.css";
import logoLetter from "../images/header/logo P.png";
import cartIcon from "../images/header/cart.png";
import profileIcon from "../images/header/profile.png";
import { Link, useLocation } from "react-router-dom";
import { Login } from "./Login";
import { Registration } from "./Registration";
import { Basket } from "./Basket";
import axios from "axios";
import {v4 as uuid} from "uuid"
import { googleAuthProvider } from "../firebase";
import { signInWithPopup, signOut } from "firebase/auth";
import { SERVER_URL } from "../config";
import jwt_decode from "jwt-decode";
import fetchBasket from "../utils/fetchBasket";
import { observer } from "mobx-react-lite";

export const Header = observer(({userContext, itemContext}) => {
  const location = useLocation();

  const [isBasketOpened, setIsBasketOpened] = useState(false);
  const [isPopUpOpened, setIsPopUpOpened] = useState(false);
  const [isMenuActive, setIsMenuActive] = useState();
  const [isLoginOpened, setIsLoginOpened] = useState(false);
  const [isRegistrationOpened, setIsRegistrationOpened] = useState(false);

  let html = document.querySelector("html");

  const openBasket = () => {
    setIsBasketOpened(!isPopUpOpened);
    isBasketOpened
      ? html.classList.remove("locked")
      : html.classList.add("locked");
  };

  const togglePopup = () => {
    setIsPopUpOpened(!isPopUpOpened);
    isPopUpOpened
      ? html.classList.remove("locked")
      : html.classList.add("locked");
  };

  const loginWithGoogle = async () => {
    signInWithPopup(userContext.auth, googleAuthProvider)
      .then((credentials) => {
        const user = credentials.user;
        user.role = "USER";
        userContext.setUser(user)
      })
      .then(async () => {
        const response = await axios.post(SERVER_URL + "/api/user/google", {
          email: userContext.user?.email,
          password: uuid()
        });
        localStorage.setItem("user-token", response.data);
        userContext.setUser(jwt_decode(response.data));
        fetchBasket().then((data) => {
          itemContext.setBasket(data);
        });
      })
      .catch((error) => console.log(error));
  };

  const logOut = () => {
    localStorage.setItem("user-token", "");
    userContext.setUser({})
    itemContext.setBasket({});
    if (userContext.auth) {
      signOut(userContext.auth).then(() => userContext.setUser(null));
    }
  };

  const toggleMenu = () => {
    isMenuActive
      ? html.classList.remove("locked")
      : html.classList.add("locked");
    if (isMenuActive) {
      return setIsMenuActive(false);
    }
    setIsMenuActive(true);
  };

  return (
    <header className={styles.header}>
      <div className={"header__container " + styles.container}>
        <Link className={styles.logo} to="/">
          <img src={logoLetter} />
          <span>росвіта</span>
        </Link>

        <div
          className={
            styles.inMobileMenu + " " + (isMenuActive ? styles.active : "")
          }
        >
          <nav className={styles.navigation}>
            <ul>
              <li className={location.pathname === "/" ? styles.active : ""}>
                <Link to="/">Головна</Link>
                <span className={styles.hoverline}></span>
              </li>
              <li>
                <Link
                  to="/catalog"
                  className={
                    location.pathname === "/catalog" ? styles.active : ""
                  }
                >
                  Каталог
                </Link>
                <span className={styles.hoverline}></span>
              </li>

              {location.pathname === "/" && (
                <li>
                  <a
                    onClick={() =>
                      document.getElementById("about").scrollIntoView({
                        behavior: "smooth",
                        block: "start",
                      })
                    }
                  >
                    Про нас
                  </a>
                  <span className={styles.hoverline}></span>
                </li>
              )}
            </ul>
          </nav>
        </div>

        <div className={styles.actions}>
          <button onClick={() => openBasket()}>
            <img src={cartIcon} alt="basket" />
          </button>
          <button onClick={togglePopup}>
            <img src={profileIcon} alt="profile" />
          </button>
          <button
            onClick={() => toggleMenu()}
            className={
              styles.burger + " " + (isMenuActive ? styles.active : "")
            }
          >
            <span></span>
          </button>
          {isPopUpOpened && (
            <div className={styles.popUp} onClick={togglePopup}>
              {userContext.user?.email ? (
                <div className={styles.popUpContent}>
                  <p>{userContext.user.email}</p>
                  <Link to="/">Мої замовлення</Link>
                  {userContext.user.role === "ADMIN" && (
                    <Link to="/admin">Адмін-панель</Link>
                  )}
                  {userContext.user.role === "MANAGER" && (
                    <Link to="/orders">Замовлення</Link>
                  )}
                  <a onClick={() => logOut()}>Вийти</a>
                </div>
              ) : (
                <div className={styles.popUpContentUnlogined}>
                  <a onClick={() => setIsRegistrationOpened(true)}>
                    Реєстрація
                  </a>
                  <a onClick={() => setIsLoginOpened(true)}>Увійти з поштою</a>
                  <a onClick={() => loginWithGoogle()}>Увійти з Google</a>
                </div>
              )}
            </div>
          )}
        </div>
        <Basket isOpened={isBasketOpened} setIsOpened={setIsBasketOpened} />
        <Login
          isOpened={isLoginOpened}
          setIsOpened={setIsLoginOpened}
        />
        <Registration
          isOpened={isRegistrationOpened}
          setIsOpened={setIsRegistrationOpened}
        />
      </div>
    </header>
  );
});
