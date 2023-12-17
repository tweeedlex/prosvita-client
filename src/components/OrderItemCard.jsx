import React from "react";
import { Link } from "react-router-dom";
import styles from "../pages/css/OrdersPage.module.css";

export const OrderItemCard = ({ item, amounts }) => {
  const unlockScroll = () => {
    const html = document.querySelector("html");
    html.classList.remove("locked");
  }
  
  return (
    <div className={styles.item}>
      <Link to={"/item/" + item.id} onClick={unlockScroll}>
        <div
          className={styles.itemImage}
          style={{
            background: `url(${item.img}) center center/contain no-repeat`,
          }}
        ></div>
      </Link>
      <div className={styles.itemInfo}>
        <Link to={"/item/" + item.id}  onClick={unlockScroll}>
          {item.name.length < 34 ? item.name : `${item.name.substr(0, 34)}..`}
        </Link>
        <span>
          Кількість:{" "}
          {amounts.find((amountItem) => amountItem.id === item.id).amount}
        </span>
        <span>Код: {item.id}</span>
        <span>Ціна: {item.price}₴</span>
      </div>
    </div>
  );
};
