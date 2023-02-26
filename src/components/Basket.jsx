import axios from "axios";
import React, { useEffect, useState } from "react";
import { SERVER_URL } from "../config";
import fetchBasket from "../utils/fetchBasket";
import styles from "./css/Basket.module.css";
import { BasketItem } from "./BasketItem";
import { Modal } from "./Modal";
import { OrderForm } from "./OrderForm";

export const Basket = ({ isOpened, setIsOpened }) => {
  const [isAuth, setIsAuth] = useState(false);
  const [basket, setBasket] = useState([]);
  const [buyModalVisible, setBuyModalVisible] = useState(false);

  useEffect(() => {
    if (localStorage.getItem("user-token")) {
      setIsAuth(true);
    }

    fetchBasket(setIsAuth).then((basket) => setBasket(basket));
  }, [isOpened]);

  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [fathersName, setFathersName] = useState("");
  const [phone, setPhone] = useState("");
  const [deliveryMethod, setDeliveryMethod] = useState("Кур'єр");
  const [deliveryAddress, setDeliveryAddress] = useState("");

  const [orderPrice, setOrderPrice] = useState(0);

  const prepareToBuy = async () => {
    setBuyModalVisible(true);

    const { data: rawItems } = await axios.get(SERVER_URL + "/api/basket", {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("user-token"),
      },
    });

    let result = 0;

    // calculating order price
    for (let item of basket) {
      result +=
        rawItems.find((rawItem) => item.id === rawItem.itemId).amount *
        item.price;
    }

    setOrderPrice(result);
  };

  const clearBasket = async () => {
    await axios.delete(SERVER_URL + "/api/basket/removeAll", {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("user-token"),
      },
    });
    setBasket([]);
  };

  return (
    <Modal zIndex={12} visible={isOpened} setVisible={setIsOpened}>
      <div
        className={styles.basket + " " + (basket?.length !== 0 && styles.oxh)}
      >
        <h2>Кошик</h2>
        {isAuth && basket && basket.length !== 0 && (
          <div>
            <div className={styles.buttons}>
              <button
                className="button-transparent "
                onClick={() => clearBasket()}
              >
                Очистити
              </button>
              <button
                className="button-transparent "
                onClick={() => prepareToBuy()}
              >
                Замовити
              </button>
            </div>
            <OrderForm
              buyModalVisible={buyModalVisible}
              setBuyModalVisible={setBuyModalVisible}
              orderPrice={orderPrice}
              clearBasket={clearBasket}
            />
          </div>
        )}
        <div className={styles.items}>
          {isAuth ? (
            basket && basket?.data?.length !== 0 ? (
              basket?.data?.map((item) => (
                <BasketItem
                  setBasketModalVisible={setIsOpened}
                  key={item.id}
                  item={item}
                />
              ))
            ) : (
              <p className={styles.p}>Ваш кошик пустий</p>
            )
          ) : (
            <p className={styles.p}>Ви не авторизовані</p>
          )}
        </div>
      </div>
    </Modal>
  );
};
