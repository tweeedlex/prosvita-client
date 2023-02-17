import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { SERVER_URL } from '../config'
import fetchBasket from '../utils/fetchBasket'
import styles from "./css/Basket.module.css"
import { BasketItem } from './BasketItem'
import { Modal } from './Modal'

export const Basket = ({ basketModalVisible, setBasketModalVisible }) => {
  const [isAuth, setIsAuth] = useState(false)
  const [basket, setBasket] = useState([])
  const [buyModalVisible, setBuyModalVisible] = useState(false);

  useEffect(() => {
    if (localStorage.getItem("user-token")) {
      setIsAuth(true)
    }

    fetchBasket(setIsAuth).then(basket => setBasket(basket))
  }, [basketModalVisible]);

  const buy = async () => {
    const { data: rawItems } = await axios.get(SERVER_URL + "/api/basket", {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("user-token")
      }
    })

    let items = []
    rawItems.map(item => items.push({ id: item.itemId, amount: item.amount }))

    const data = { items, name, surname, fathersName, phone, deliveryMethod, deliveryAddress }

    await axios.post(
      SERVER_URL + "/api/order",
      data,
      { headers: { Authorization: "Bearer " + localStorage.getItem("user-token") } },
    )

    // clear basket
    await axios.delete(SERVER_URL + "/api/basket/removeAll", {
      headers: { Authorization: "Bearer " + localStorage.getItem("user-token") }
    })
    setBasket([])

    alert("Ваше замовлення в обробці")
  }

  const [name, setName] = useState("")
  const [surname, setSurname] = useState("")
  const [fathersName, setFathersName] = useState("")
  const [phone, setPhone] = useState("")
  const [deliveryMethod, setDeliveryMethod] = useState("Кур'єр")
  const [deliveryAddress, setDeliveryAddress] = useState("")

  const [orderPrice, setOrderPrice] = useState(0)

  const prepareToBuy = async () => {
    setBuyModalVisible(true)

    const { data: rawItems } = await axios.get(SERVER_URL + "/api/basket", {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("user-token")
      }
    })

    let result = 0

    // calculating order price
    for (let item of basket) {
      result += rawItems.find(rawItem => item.id === rawItem.itemId).amount * item.price
    }

    setOrderPrice(result)
  }

  return (
    <div>
      <h1 className={styles.h1} style={{ fontSize: "48px" }}>Кошик</h1>
      {
        isAuth && basket && basket.length !== 0
        &&
        <div>
          <button
            style={{ padding: "15px 30px", fontSize: "26px", margin: "0 0 20px 0", position: "relative", left: "calc(50% - 115px)" }}
            className="add"
            onClick={() => prepareToBuy()}
          >
            Придбати все
          </button>
          <Modal visible={buyModalVisible} setVisible={setBuyModalVisible} zIndex={5}>
            <h2 className="h2" style={{ margin: "10px 0 20px 0" }}>Контактні дані отримувача</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              <input value={surname} onChange={e => setSurname(e.target.value)} className="input" type="text" placeholder="Прізвище" />
              <input value={name} onChange={e => setName(e.target.value)} className="input" type="text" placeholder="Ім'я" />
              <input value={fathersName} onChange={e => setFathersName(e.target.value)} className="input" type="text" placeholder="По батькові" />
              <input value={phone} onChange={e => setPhone(e.target.value)} className="input" type="tel" placeholder="Телефон" />
            </div>

            <h2 className="h2" style={{ margin: "10px 0 20px 0" }}>Метод доставки</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              <select className="select" onChange={(e) => setDeliveryMethod(e.target.value)} name="delivery-method">
                <option className="option">Кур'єр</option>
                <option className="option">Відділення пошти</option>
              </select>
              <input
                value={deliveryAddress}
                onChange={e => setDeliveryAddress(e.target.value)}
                type="text"
                className="input"
                placeholder={deliveryMethod === "Кур'єр" ? "Адреса доставки" : "Адреса поштового відділення"}
              />
            </div>
            <p style={{textAlign: "center", margin: "10px 0 0 0"}}>Вартість замовлення: {orderPrice}₴</p>

            <div style={{ display: "flex", justifyContent: "center", margin: "10px 0 0 0" }}>
              <button
                style={{ padding: "15px 30px", fontSize: "26px" }}
                className="add"
                onClick={() => buy()}
              >
                Замовити
              </button>
            </div>
          </Modal>
        </div>
      }
      <div className={styles.items}>
        {
          isAuth
            ? basket && basket.length !== 0
              ? basket.map(item =>
                <BasketItem setBasketModalVisible={setBasketModalVisible} key={item.id} item={item} />
              )
              : <p style={{ margin: "auto" }}>Ваш кошик пустий</p>
            : <p style={{ margin: "auto" }}>Ви не авторизовані</p>
        }
      </div>
    </div>
  )
}
