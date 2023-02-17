import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Item } from '../components/Item'
import { SERVER_URL } from '../config'
import fetchBasket from '../utils/fetchBasket'
import { Modal } from "../components/Modal"

export const BasketPage = () => {
  const [isAuth, setIsAuth] = useState(false)
  const [basket, setBasket] = useState([])
  const [buyModalVisible, setBuyModalVisible] = useState(false);

  useEffect(() => {
    if (localStorage.getItem("user-token")) {
      setIsAuth(true)
    }

    fetchBasket(setIsAuth).then(basket => setBasket(basket))
  }, []);

  const buy = async () => {
    const items = basket.map(item => item.id)
    const data = {items, name, surname, fathersName, phone, deliveryMethod, deliveryAddress}

    await axios.post(
      SERVER_URL + "/api/order", 
      data,
      {headers: { Authorization: "Bearer " + localStorage.getItem("user-token") }}, 
    )

    // clear basket
    await axios.delete(SERVER_URL + "/api/basket/removeAll", {
      headers: { Authorization: "Bearer " + localStorage.getItem("user-token") }
    })
    setBasket([])

    alert("Ваш заказ в обробці")
  }

  const [name, setName] = useState("")
  const [surname, setSurname] = useState("")
  const [fathersName, setFathersName] = useState("")
  const [phone, setPhone] = useState("")
  const [deliveryMethod, setDeliveryMethod] = useState("Кур'єр")
  const [deliveryAddress, setDeliveryAddress] = useState("")


  return (
    <div>
      <h1 className="h1">Кошик</h1>
      {
        isAuth && basket && basket.length !== 0
        &&
        <div>
          <button
            style={{ padding: "15px 30px", fontSize: "26px", margin: "0 0 20px 0", position: "relative", left: "calc(50% - 115px)" }}
            className="add"
            onClick={() => setBuyModalVisible(true)}
          >
            Придбати все
          </button>
          <Modal visible={buyModalVisible} setVisible={setBuyModalVisible}>

            <h2 className="h2" style={{ margin: "10px 0 20px 0" }}>Контактні дані отримувача</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              <input value={name} onChange={e => setName(e.target.value)} className="input" type="text" placeholder="Ім'я" />
              <input value={surname} onChange={e => setSurname(e.target.value)} className="input" type="text" placeholder="Прізвище" />
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

            <div style={{display: "flex", justifyContent: "center", margin: "20px 0 0 0"}}>
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
      <div className="cards">
        {
          isAuth
            ? basket && basket.length !== 0
              ? basket.map(item =>
                <Item key={item.id} item={item} />
              )
              : <p style={{ margin: "auto" }}>Ваш кошик пустий</p>
            : <p style={{ margin: "auto" }}>Ви не авторизовані</p>
        }
      </div>
    </div>
  )
}
