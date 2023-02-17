import axios from "axios";
import React, { useEffect } from "react";
import { useState } from "react";
import { SERVER_URL } from "../config";
import { countAndSetPages } from "../utils/countAndSetPages";

import styles from "./css/Category.module.css";

export const Types = ({
  setItems,
  setPages,
  setSelectedPage,
  selectedType,
  selectedBrand,
  setSelectedType,
}) => {
  const [types, setTypes] = useState([]);

  useEffect(() => {
    loadTypes();
  }, []);

  const loadTypes = async () => {
    await axios.get(SERVER_URL + "/api/type").then((response) => {
      setTypes(response.data);
    });
  };

  const selectType = async (id) => {
    setSelectedType(id);
    const response = await axios.get(
      SERVER_URL +
        `/api/item?typeId=${id}${
          selectedBrand ? `&brandId=${selectedBrand}` : ""
        }`
    );
    setItems(response.data.rows);
    setSelectedPage(1);
    countAndSetPages(response, setPages);
  };

  return (
    <ul className={styles.items}>
      {types.map((type) => (
        <li
          key={type.id}
          className={`${styles.item} ${
            type.id === selectedType ? styles.selected : ""
          }`}
        >
          <button
            onClick={() => selectType(type.id)}
          >
            {type.name.length < 20 ? type.name : `${type.name.substr(0, 20)}..`}
          </button>
        </li>
      ))}
    </ul>
  );
};
