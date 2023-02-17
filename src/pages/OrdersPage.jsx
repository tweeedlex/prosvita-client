import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Order } from '../components/admin-components/Order';
import { SERVER_URL } from '../config';
import { countAndSetPages } from '../utils/countAndSetPages';

export const OrdersPage = () => {
  const [orders, setOrders] = useState([])
  const [pages, setPages] = useState([])
  const [selectedPage, setSelectedPage] = useState(1)

  useEffect(() => {
    loadOrders()
  }, []);

  const loadOrders = async (completed) => {
    let response = {}

    if (completed !== undefined) {
      response = await axios.get(
        SERVER_URL + "/api/order?completed=" + completed, {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("user-token")
        }
      })
    } else {
      response = await axios.get(
        SERVER_URL + "/api/order", {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("user-token")
        }
      })
    }

    setOrders(response.data.rows)
    countAndSetPages(response, setPages, 10)
  }

  const changePage = async (page) => {
    setSelectedPage(page)
    const response = await axios.get(`${SERVER_URL}/api/order?page=${page}`, {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("user-token")
      }
    })
    setOrders(response.data.rows)
    window.scroll(0, 0)
  }

  return (
    <div>
      <h2 className="h2">Замовлення</h2>
      <div style={{ display: "flex", justifyContent: "center", gap: "10px" }}>
        <button onClick={() => loadOrders(true)} className="button-default" style={{ width: "200px", textAlign: "center", border: "1px solid #fff", borderRadius: "10px" }}>
          Виконані
        </button>
        <button onClick={() => loadOrders(false)} className="button-default" style={{ width: "200px", textAlign: "center", border: "1px solid #fff", borderRadius: "10px" }}>
          Невиконані
        </button>
      </div>
      <div style={{ display: "flex", justifyContent: "center" }}>
        <button onClick={() => loadOrders()} style={{ margin: "20px 0 10px 0" }} className="add red">
          Скинути фільтри
        </button>
      </div>

      <div className="orders">
        {orders.map(order =>
          <Order key={order.id} order={order} />
        )}
      </div>

      <ul className="pages">
        {
          pages.length > 1 &&
          pages.map(page =>
            <li key={page} className={`page ${page === selectedPage ? "selected" : ""}`}>
              <button onClick={() => changePage(page)} className='button-default'>
                {page}
              </button>
            </li>
          )}
      </ul>
    </div>
  )
}
