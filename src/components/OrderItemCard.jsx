import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { SERVER_URL } from '../config';

export const OrderItemCard = ({ item, amounts }) => {
  return (
    <div style={{ margin: "10px 0" }}>
      <h2>{item.name}</h2>
      <p style={{ display: "flex", justifyContent: "space-between", minWidth: "520px", gap: "20px" }}>
        <Link to={"/item/" + item.id}>Відкрити на сайті</Link>
        <span>Кількість: {amounts.find(amountItem => amountItem.id === item.id).amount}</span>
        <span>Ідентифікатор: {item.id}</span>
      </p>
    </div>
  )
}
