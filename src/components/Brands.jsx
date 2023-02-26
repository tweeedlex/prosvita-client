import axios from "axios";
import React, { useContext, useEffect } from "react";
import { useState } from "react";
import { SERVER_URL } from "../config";
import { fetchBrands, fetchItems, fetchTypes } from "../http/itemAPI";
import { countAndSetPages } from "../utils/countAndSetPages";
import { Context } from "../index";

import styles from "./css/Category.module.css";

export const Brands = ({
  setPages,
  setSelectedPage,
  selectedType,
  setSelectedBrand,
  selectedBrand,
}) => {
  const { item } = useContext(Context);

  const selectBrand = async (id) => {
    setSelectedBrand(id);
    const response = await fetchItems(selectedType, id, 1, 24);
    item.setItems(response.rows);
    setSelectedPage(1);
    countAndSetPages(response.count, setPages);
  };

  return (
    <ul className={styles.items}>
      {item.brands.map((brand) => (
        <li
          key={brand.id}
          className={`${styles.item} ${
            brand.id === selectedBrand ? styles.selected : ""
          }`}
        >
          <button onClick={() => selectBrand(brand.id)}>
            {brand.name.length < 20
              ? brand.name
              : `${brand.name.substr(0, 20)}..`}
          </button>
        </li>
      ))}
    </ul>
  );
};
