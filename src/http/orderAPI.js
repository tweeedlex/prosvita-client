import { $authHost, $host } from "./index";

export const getUserOrders = async () => {
  const { data } = await $authHost.get("api/order/user");
  return data;
};
