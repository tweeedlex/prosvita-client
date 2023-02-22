import axios from "axios";
import React, { useEffect, useState } from "react";
import { SERVER_URL } from "../config";
import fetchBasket from "../utils/fetchBasket";
import styles from "./css/Basket.module.css";
import { BasketItem } from "./BasketItem";
import { Modal } from "./Modal";

export const Basket = ({
  isOpened,
  setIsOpened
}) => {
  const [isAuth, setIsAuth] = useState(false);
  const [basket, setBasket] = useState([]);
  const [buyModalVisible, setBuyModalVisible] = useState(false);

  useEffect(() => {
    if (localStorage.getItem("user-token")) {
      setIsAuth(true);
    }

    fetchBasket(setIsAuth).then((basket) => setBasket(basket));
  }, [isOpened]);

  const buy = async () => {
    const { data: rawItems } = await axios.get(SERVER_URL + "/api/basket", {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("user-token"),
      },
    });

    let items = [];
    rawItems.map((item) =>
      items.push({ id: item.itemId, amount: item.amount })
    );

    const data = {
      items,
      name,
      surname,
      fathersName,
      phone,
      deliveryMethod,
      deliveryAddress,
    };

    await axios.post(SERVER_URL + "/api/order", data, {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("user-token"),
      },
    });

    // clear basket
    await axios.delete(SERVER_URL + "/api/basket/removeAll", {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("user-token"),
      },
    });
    setBasket([]);

    alert("Ваше замовлення в обробці");
  };

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

  return (
    <Modal zIndex={12} visible={isOpened} setVisible={setIsOpened}>
      <div className={styles.basket}>
        <h2>Кошик</h2>
        {isAuth && basket && basket.length !== 0 && (
          <div>
            <div className={styles.buttons}>
              <button className="button-transparent ">Очистити</button>
              <button className="button-transparent " onClick={() => prepareToBuy()}>Замовити</button>
            </div>
            <Modal
              visible={buyModalVisible}
              setVisible={setBuyModalVisible}
              zIndex={5}
            >
              <h2>Контактні дані отримувача</h2>
              <div>
                <input
                  value={surname}
                  onChange={(e) => setSurname(e.target.value)}
                  type="text"
                  placeholder="Прізвище"
                />
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  type="text"
                  placeholder="Ім'я"
                />
                <input
                  value={fathersName}
                  onChange={(e) => setFathersName(e.target.value)}
                  type="text"
                  placeholder="По батькові"
                />
                <input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  type="tel"
                  placeholder="Телефон"
                />
              </div>

              <h2>Метод доставки</h2>
              <div>
                <select
                  onChange={(e) => setDeliveryMethod(e.target.value)}
                  name="delivery-method"
                >
                  <option>Кур'єр</option>
                  <option>Відділення пошти</option>
                </select>
                <input
                  value={deliveryAddress}
                  onChange={(e) => setDeliveryAddress(e.target.value)}
                  type="text"
                  placeholder={
                    deliveryMethod === "Кур'єр"
                      ? "Адреса доставки"
                      : "Адреса поштового відділення"
                  }
                />
              </div>
              <p>Вартість замовлення: {orderPrice}₴</p>

              <div>
                <button onClick={() => buy()}>Замовити</button>
              </div>
            </Modal>
          </div>
        )}
        <div className={styles.items}>
          {isAuth ? (
            basket && basket.length !== 0 ? (
              basket.map((item) => (
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
