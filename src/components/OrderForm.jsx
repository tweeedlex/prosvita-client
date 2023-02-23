import React, { useState } from "react";
import { Modal } from "./Modal";
import modalStyles from "./css/Modal.module.css";
import axios from "axios";
import { SERVER_URL } from "../config";

export const OrderForm = ({ buyModalVisible, setBuyModalVisible, orderPrice, clearBasket }) => {
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [fathersName, setFathersName] = useState("");
  const [phone, setPhone] = useState("");
  const [deliveryMethod, setDeliveryMethod] = useState("Кур'єр");
  const [deliveryAddress, setDeliveryAddress] = useState("");

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

    clearBasket();

    alert("Ваше замовлення в обробці");
  };

  return (
    <Modal
      isOrder={true}
      zIndex={5}
      visible={buyModalVisible}
      setVisible={setBuyModalVisible}
    >
      <p style={{fontSize: "24px", textAlign: "center"}}>Дані для доставки</p>
      <div className={modalStyles.formDefault} style={{ padding: "20px 0" }}>
        <input
          value={surname}
          onChange={(e) => setSurname(e.target.value)}
          type="text"
          placeholder="Прізвище..."
          className={modalStyles.input}
        />
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          type="text"
          placeholder="Ім'я..."
          className={modalStyles.input}
        />
        <input
          value={fathersName}
          onChange={(e) => setFathersName(e.target.value)}
          type="text"
          placeholder="По батькові..."
          className={modalStyles.input}
        />
        <input
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          type="tel"
          placeholder="Телефон..."
          className={modalStyles.input}
        />
        <div className={modalStyles.selectWrapper}>
          <select
            onChange={(e) => setDeliveryMethod(e.target.value)}
            name="delivery-method"
            className={modalStyles.select}
            style={{width: "100%"}}
          >
            <option>Кур'єр</option>
            <option>Відділення пошти</option>
          </select>
          <div className={modalStyles.selectCheck}></div>
        </div>

        <input
          value={deliveryAddress}
          onChange={(e) => setDeliveryAddress(e.target.value)}
          type="text"
          placeholder={
            deliveryMethod === "Кур'єр"
              ? "Адреса доставки..."
              : "Адреса поштового відділення..."
          }
          className={modalStyles.input}
        />
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <button onClick={() => buy()} className={modalStyles.action}>
          Замовити
        </button>
        <p>До сплати: {orderPrice}₴</p>
      </div>
    </Modal>
  );
};
