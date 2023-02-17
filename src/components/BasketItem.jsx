import { observer } from 'mobx-react-lite'
import React, { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import actionCart from '../utils/actionCart'
import axios from "axios"
import { SERVER_URL } from "../config";


export const BasketItem = observer(({ item, setBasketModalVisible, value, setValue }) => {
  const [brand, setBrand] = useState("")
  const [type, setType] = useState("")
  const [isAuth, setIsAuth] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (localStorage.getItem("user-token")) {
      setIsAuth(true)
    }

    loadItem().then(() => setIsLoading(false))

    loadAmount()
  }, [])

  const loadItem = async () => {
    try {
      const { data: itemInfo } = await axios.get(SERVER_URL + `/api/item/itemInfo?itemId=${item.id}`, {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("user-token")
        }
      })
      setBrand(itemInfo.brand)
      setType(itemInfo.type)
    } catch (e) {
      console.log(e)
    }
  }

  const loadAmount = async () => {
    try {
      const {data: amount} = await axios.get(SERVER_URL + `/api/basket/amount?itemId=${item.id}`, {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("user-token")
        }
      })
      setAmount(amount)
    } catch (e) {
      console.log(e)
    }
  }

  const [amount, setAmount] = useState(1)

  const updateAmount = async (action) => {
    if (action === "+" && amount < 9999) {
      setAmount(amount + 1)
    } else if (action === "-" && amount > 1) {
      setAmount(amount - 1)
    }

    await axios.put(SERVER_URL + `/api/basket?itemId=${item.id}&amount=${action === "+" && amount < 9999 ? amount + 1 : amount > 1 ? amount - 1 : amount}`, {}, {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("user-token")
      }
    })
  }

  const removeFromCart = async item => await actionCart("remove", item)


  return (
    <>
      {/* {
        isLoading
          ?
          <div key={item.id} className={"loading"}>
            <div className='loader'></div>
          </div>
          :
          <div key={item.id} className={styles.item}>
            <Link onClick={() => setBasketModalVisible(false)} className={styles.imageWrapper} to={`/item/${item.id}`}>
              <div className={styles.image}
                style={{ background: `url(${item.img}) 50% 50%/cover` }}
              >
              </div>
            </Link>

            <div className={styles.content}>
              <Link onClick={() => setBasketModalVisible(false)} to={`/item/${item.id}`}>{item.name}</Link>
              <div className={styles.categories}>
                <Link onClick={() => setBasketModalVisible(false)} to={`/brand/${item.brandId}`}>{brand}</Link>
                <Link onClick={() => setBasketModalVisible(false)} to={`/type/${item.typeId}`}>{type}</Link>
              </div>
            </div>

            <div className={styles.buy}>
              <p>{item.price}₴</p>

              <div className={styles.amount}>
                <button onClick={() => updateAmount("+")} className={styles.button}>+</button>
                <p className={styles.number}>{amount}</p>
                <button onClick={() => updateAmount("-")} className={styles.button + " " + styles.minus}></button>
              </div>
            </div>
          </div >
      } */}
    </>
  )
})
