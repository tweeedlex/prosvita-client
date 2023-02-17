import React from "react";
import styles from "./css/TitlePage.module.css";
import deskImage from "../images/hero/desk.png";
import teacherImage from "../images/hero/teacher.png";
import transition from "../images/transition.png";
import transition2 from "../images/transition2.png";
import groupImage from "../images/about/group.png";
import { useNavigate } from "react-router-dom";

export const TitlePage = () => {
  const navigate = useNavigate()

  return (
    <>
      <section className={styles.hero}>
        <div className="hero__container">
          <div className={styles.text}>
            <h1 className={styles.h1}>Здобувай знання легше</h1>
            <p className={styles.subtitle}>
              Освітні товари та послуги від найкращих викладачів
            </p>
            <button onClick={() => navigate("/catalog")} className={styles.view}>Переглянути</button>
          </div>
        </div>
        <div className={styles.media}>
          <img className={styles.desk} src={deskImage} alt="Desk" />
          <img className={styles.teacher} src={teacherImage} alt="Teacher" />
        </div>
      </section>
      <img className={styles.transition} src={transition} alt="" />

      <section className={styles.catalog}>
        <div className="catalog__container">
          <h2 className={styles.h2}>Широкий асортимент товарів</h2>
          <div className={styles.cards}>
            <a href="/" className={styles.card + " " + styles.card1}>
              <p className={styles.caption}>ЗНО</p>
            </a>
            <a href="/" className={styles.card + " " + styles.card2}>
              <p className={styles.caption}>КУРСИ</p>
            </a>
            <a href="/" className={styles.card + " " + styles.card3}>
              <p className={styles.caption}>КАНЦЕЛЯРІЯ</p>
            </a>
          </div>
        </div>
      </section>
      <img
        className={styles.transition + " " + styles.transition2}
        src={transition2}
        alt=""
      />

      <section id="about" className={styles.about}>
        <div className="about__container">
          <h2 className={styles.h2}>Про нас</h2>
          <div className={styles.aboutContent}>
            <p>
              "Просвіта" - це інтернет-магазин освітніх товарів та послуг, який
              пропонує вам легкий доступ до широкого асортименту продукції за
              допомогою зручного замовлення з дому.<br/><br/> Ми віддаємо перевагу
              ефективності та швидкості, тому ваше замовлення буде оброблено
              швидко та надійно.<br/><br/>Довірте нам свої освітні потреби та отримайте
              кращі товари та послуги в одному місці!
            </p>
            <div className={styles.aboutMedia}>
              <img src={groupImage} alt="pencils" />
            </div>
          </div>
        </div>
      </section>
    </>
  );
};
