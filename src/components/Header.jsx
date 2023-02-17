import React, { useState } from "react";
import styles from "./css/Header.module.css";
import logoLetter from "../images/header/logo P.png";
import searchIcon from "../images/header/search.png";
import cartIcon from "../images/header/cart.png";
import profileIcon from "../images/header/profile.png";
import { useLocation } from "react-router-dom";

export const Header = ({user, setEmail, setIsAdmin, setIsManager}) => {
  const location = useLocation();

  const [isPopUpOpen, setIsPopUpOpen] = useState(false);

  const togglePopup = () => {
    setIsPopUpOpen(!isPopUpOpen);
    const body = document.querySelector("body")
    isPopUpOpen
    ? body.classList.remove("locked")
    : body.classList.add("locked")
  };
  
  const logOut = () => {
    localStorage.setItem("user-token", "");
    setEmail(undefined);
    setIsAdmin(false);
    setIsManager(false);
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
          {isPopUpOpen && (
            <div className={styles.popUp} onClick={togglePopup}>
              <div className={styles.popUpContent}>
                {console.log(user)}
                <p>Володимир</p>
                <p>22a_avs@liceum.ztu.edu.ua</p> 
                <a href="/">Мої замовлення</a> 
                <a href="/admin">Адмін-панель</a>
                <a onClick={() => logOut()}>Вийти</a>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
