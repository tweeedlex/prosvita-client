import axios from 'axios'
import React, { useEffect } from 'react'
import { useState } from 'react'
import { SERVER_URL } from '../config'
import { countAndSetPages } from '../utils/countAndSetPages'

import styles from "./css/Category.module.css"

export const Brands = ({setItems, setPages, setSelectedPage, selectedBrand, selectedType, setSelectedBrand}) => {
  const [brands, setBrands] = useState([])

  useEffect(() => {
    loadBrands()
  }, []);

  const loadBrands = async () => {
    await axios.get(SERVER_URL + "/api/brand").then((response) => {
      setBrands(response.data)
    })
  }

  const selectBrand = async (id) => {
    setSelectedBrand(id)
    const response = await axios.get(SERVER_URL + `/api/item?brandId=${id}${selectedType ? `&typeId=${selectedType}`: ""}`)
    setItems(response.data.rows)
    setSelectedPage(1)
    countAndSetPages(response, setPages)
  }

  return (
    <ul className={styles.items}>
      {brands.map(brand =>
        <li key={brand.id}
          className={`${styles.item} ${brand.id === selectedBrand ? styles.selected : ""}`}
        >
          <button onClick={() => selectBrand(brand.id)}>
            {brand.name.length < 18 ? brand.name : `${brand.name.substr(0, 18)}..`}
          </button>
        </li>
      )}
    </ul>
  )
}
