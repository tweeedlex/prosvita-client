import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { SERVER_URL } from '../../config'
import { Modal } from '../Modal'
import { OrderItemCard } from '../OrderItemCard'

export const Order = ({ order }) => {
  const [itemsModalVisible, setItemsModalVisible] = useState(false)
  const [completedModalVisible, setCompletedModalVisible] = useState(false)
  const [items, setItems] = useState([])
  const [completed, setCompleted] = useState(false)

  let itemIds = order.items.map(item => item?.id)

  const loadItems = async () => {
    const response = await axios.get(SERVER_URL + "/api/item?itemList=" + itemIds)
    return response.data
  }

  const setOrderCompleted = async () => {
    await axios.put(SERVER_URL + "/api/order?id=" + order.id, {}, {
      headers: { Authorization: "Bearer " + localStorage.getItem("user-token") }
    })
    setCompleted(true)
    setCompletedModalVisible(false)
  }

  const openModal = () => {
    setItemsModalVisible(true)
    loadItems().then(data => setItems(data))
  }

  return (
    <div className="order">
      <div className="order__info">
        <h2>{`${order.surname} ${order.name} ${order.fathersName}`}</h2>
        <p>ID замовлення: {order.id}</p>
        <p>{order.deliveryMethod} | {order.deliveryAddress}</p>
        <p>{order.phone}</p>
      </div>

      <div className="order__buttons">
        <button className="add" onClick={() => openModal()}>Замовлені товари</button>
        <Modal visible={itemsModalVisible} setVisible={setItemsModalVisible}>
          <div style={{ display: "flex", flexDirection: "column" }}>
            {items.map(item =>
              <OrderItemCard key={item.id} item={item} amounts={order.items} />
            )}
          </div>
        </Modal>

        {
          order.completed || completed
            ? <h2 style={{ fontSize: "40px" }}>Виконано</h2>
            :
            <button className="add" onClick={() => setCompletedModalVisible(true)}>
              ✔ Позначити як виконане
            </button>
        }
        <Modal visible={completedModalVisible} setVisible={setCompletedModalVisible}>
          <p style={{ margin: "0 0 10px 0" }}>Ви впевнені, що це замовлення відправлено?</p>
          <div style={{ display: "flex", justifyContent: "center", gap: "10px" }}>
            <button className="add" onClick={() => setOrderCompleted()}>Так</button>
            <button className="add red" onClick={() => setCompletedModalVisible(false)}>Ні</button>
          </div>
        </Modal>
      </div>


    </div>
  )
}
