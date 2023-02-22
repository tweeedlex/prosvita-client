import axios from "axios";
import React, { useEffect } from "react";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router";
import { Link } from "react-router-dom";
import { SERVER_URL } from "../config";
import actionCart from "../utils/actionCart";

import styles from "./css/ItemPage.module.css";
import starOrange from "../images/item/star-orange.png";
import starImage from "../images/item/star.png";
import cartImage from "../images/catalog/cart.png";

export const ItemPage = ({ isAdmin }) => {
  const location = useLocation();
  const id = +location.pathname.split("/")[2];

  const [item, setItem] = useState({});
  const [brand, setBrand] = useState("");
  const [type, setType] = useState("");

  const [isAuth, setIsAuth] = useState(false);
  const [itemInBasket, setItemInBasket] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem("user-token")) {
      setIsAuth(true);
    }

    loadItem();
    if (location.pathname === "/basket") {
      setItemInBasket(true);
    }
  }, []);

  const loadItem = async () => {
    const response = await axios.get(SERVER_URL + "/api/item/" + id);
    setItem(response.data);

    try {
      const { data: itemInfo } = await axios.get(
        SERVER_URL + `/api/item/itemInfo?itemId=${id}`,
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("user-token"),
          },
        }
      );
      setItemInBasket(itemInfo.itemInBasket);
      setBrand(itemInfo.brand);
      setType(itemInfo.type);
    } catch (e) {
      console.log(e);
    }
  };

  const addToCart = async (item) =>
    await actionCart("add", item).then(() => setItemInBasket(true));
  const removeFromCart = async (item) =>
    await actionCart("remove", item).then(() => setItemInBasket(false));

  const deleteItem = async () => {
    try {
      await axios.delete(SERVER_URL + "/api/item/" + item.id, {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("user-token"),
        },
      });
      alert("Ви видалили цей товар");
      navigate(-1);
    } catch (e) {
      console.log(e.response.data);
    }
  };

  return (
    <div className={styles.itemPage}>
      <div className={styles.container + " item__container"}>
        <div
          className={styles.image}
          style={{ background: `url(${item.img}) 100% 0/contain no-repeat` }}
        ></div>
        <div className={styles.content}>
          <h2 className={styles.h2}>{item.name}</h2>
          <div className={styles.shortInfo}>
            <div className={styles.leftColumn}>
              <Link>
                {brand.length < 18 ? brand : `${brand.substr(0, 18)}..`}
              </Link>
              <Link>
                {type.length < 18 ? type : `${type.substr(0, 18)}..`}
              </Link>
              <p className={styles.id}>Ідентифікатор: {item.id}</p>
            </div>
            <div className={styles.centralColumn}>
              <div className={styles.stars}>
                <img src={starOrange} className={styles.star} />
                <img src={starOrange} className={styles.star} />
                <img src={starOrange} className={styles.star} />
                <img src={starOrange} className={styles.star} />
                <img src={starImage} className={styles.star} />
              </div>
              <div className={styles.marks}>
                <p>3.7/5</p>
                <p>132 оцінок</p>
              </div>
            </div>
            <div className={styles.buy}>
              <p className={styles.price}>{item.price}₴</p>

              {isAuth ? (
                itemInBasket ? (
                  <button
                    className={styles.inCart}
                    onClick={() => removeFromCart(item)}
                  >
                    <p>Вилучити</p>
                    <img src={cartImage} alt="cart" />
                  </button>
                ) : (
                  <button onClick={() => addToCart(item)}>
                    <p>В кошик</p>
                    <img src={cartImage} alt="cart" />
                  </button>
                )
              ) : (
                <button onClick={() => navigate("/login")}>
                  <p>В кошик</p>
                  <img src={cartImage} alt="cart" />
                </button>
              )}
            </div>
          </div>

          {isAdmin && (
            <button onClick={() => deleteItem()} className={styles.delete}>
              Видалити товар
            </button>
          )}
          <div>
            {item.info !== "[]" ? (
              <div>
                <h4 className={styles.h4}>Інформація</h4>
                <div className={styles.info}>
                  {item.info ? (
                    JSON.parse(item.info).map((item) => (
                      <p key={item.field} className={styles.pair}>
                        <span>{item.field}:</span>
                        <span>{item.value}</span>
                      </p>
                    ))
                  ) : (
                    <></>
                  )}
                </div>
              </div>
            ) : (
              <></>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
