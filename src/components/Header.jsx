import React, { useState } from "react";
import styles from "./css/Header.module.css";
import logoLetter from "../images/header/logo P.png";
import searchIcon from "../images/header/search.png";
import cartIcon from "../images/header/cart.png";
import profileIcon from "../images/header/profile.png";
import { useLocation } from "react-router-dom";
import { Login } from "./Login";

export const Header = (props) => {
  const location = useLocation();

  const [isPopUpOpened, setIsPopUpOpened] = useState(false);
  const [isLoginOpened, setIsLoginOpened] = useState(false);
  const [isRegistrationOpened, setIsRegistrationOpened] = useState(false);

  const togglePopup = () => {
    setIsPopUpOpened(!isPopUpOpened);
    const body = document.querySelector("body");
    isPopUpOpened
      ? body.classList.remove("locked")
      : body.classList.add("locked");
  };

  const logOut = () => {
    localStorage.setItem("user-token", "");
    props.setEmail(undefined);
    props.setIsAdmin(false);
    props.setIsManager(false);
  };

  return (
    <header className={styles.header}>
      <div className={"header__container " + styles.container}>
        <a className={styles.logo} href="/">
          <img src={logoLetter} />
          <span>росвіта</span>
        </a>

        <div className={styles.search}>
          <input placeholder="Пошук товарів..." type="text" />
          <button>
            <img src={searchIcon} alt="Search" />
          </button>
        </div>

        <nav className={styles.navigation}>
          <ul>
            <li className={location.pathname === "/" ? styles.active : ""}>
              <a href="/">Головна</a>
              <span className={styles.hoverline}></span>
            </li>
            <li>
              <a
                href="/catalog"
                className={
                  location.pathname === "/catalog" ? styles.active : ""
                }
              >
                Каталог
              </a>
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

        <div className={styles.actions}>
          <button className="basket">
            <img src={cartIcon} alt="basket" />
          </button>
          <button onClick={togglePopup} className="profile">
            <img src={profileIcon} alt="profile" />
          </button>
          {isPopUpOpened && (
            <div className={styles.popUp} onClick={togglePopup}>
              {props.email ? (
                <div className={styles.popUpContent}>
                  <p>{props.email}</p>
                  <a href="/">Мої замовлення</a>
                  {props.isAdmin && <a href="/admin">Адмін-панель</a>}
                  {props.isManager && <a href="/orders">Замовлення</a>}
                  <a style={{ cursor: "pointer" }} onClick={() => logOut()}>
                    Вийти
                  </a>
                </div>
              ) : (
                <div className={styles.popUpContentUnlogined}>
                  <a onClick={() => setIsRegistrationOpened(true)}>
                    Реєстрація
                  </a>
                  <a onClick={() => setIsLoginOpened(true)}>Вхід</a>
                </div>
              )}
            </div>
          )}
        </div>
        <Login isOpened={isLoginOpened} setIsOpened={setIsLoginOpened} />
      </div>
    </header>
  );
};
