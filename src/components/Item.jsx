import { observer } from "mobx-react-lite";
import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import actionCart from "../utils/actionCart";

import styles from "./css/Item.module.css";
import cartImage from "../images/catalog/cart.png";

import { Context } from "../index";

export const Item = observer(({ item }) => {
  const [itemInBasket, setItemInBasket] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const { user, item: itemContext } = useContext(Context);

  useEffect(() => {
    setIsLoading(false)
    loadItem()
  }, [user.user, itemContext.basket]);

  const loadItem = async () => {
    setItemInBasket(false);
    if (itemContext.basket) {
      itemContext.basket?.data?.find(
        (basketItem) => basketItem.id === item.id
      ) && setItemInBasket(true);
    }
    setIsLoading(false);
  };

  const addToCart = async (item) =>
    await actionCart("add", item).then(() => setItemInBasket(true));

  const removeFromCart = async (item) =>
    await actionCart("remove", item).then(() => setItemInBasket(false));

  return (
    <>
      {isLoading ? (
        <div key={item.id} className={"loading " + styles.card}>
          <div className="loader"></div>
        </div>
      ) : (
        <div key={item.id} className={styles.card}>
          <Link to={`/item/${item.id}`}>
            <div
              className={styles.image}
              style={{
                background: `url(${item.img}) 50% 50%/contain no-repeat`,
              }}
            ></div>
          </Link>
          <Link className={styles.name} to={`/item/${item.id}`}>
            <p>
              {item.name.length < 44
                ? item.name
                : `${item.name.substr(0, 44)}..`}
            </p>
          </Link>

          <div className={styles.bottom}>
            <p>{item.price}₴</p>
            {user.isAuth ? (
              itemInBasket ? (
                <button
                  className={styles.inCart}
                  onClick={() => removeFromCart(item)}
                >
                  <img src={cartImage} alt="cart" />
                </button>
              ) : (
                <button onClick={() => addToCart(item)}>
                  <img src={cartImage} alt="cart" />
                </button>
              )
            ) : (
              <button onClick={() => alert("Авторизуйтесь")}>
                <img src={cartImage} alt="cart" />
              </button>
            )}
          </div>
        </div>
      )}
    </>
  );
});
