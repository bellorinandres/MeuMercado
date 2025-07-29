// web/src/pages/ShoppingList/shoppingService.js
import axiosInstance from "../../api/axiosInstance";

export async function getShoppingListDetails(listId, token) {
  try {
    const { data } = await axiosInstance.get(`/api/lists/shopping/${listId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!data || data.length === 0) {
      const err = new Error("Lista no encontrada o sin permiso.");
      err.statusCode = 404;
      throw err;
    }

    const listName = data[0].name_list;
    const products = data.map((item) => ({
      id: item.id_item,
      name: item.product_name,
      quantity: item.quantity,
      price: item.price,
      isBought: item.is_bought,
    }));

    return { name: listName, products };
  } catch (error) {
    console.error("getShoppingListDetails Error:", error);
    throw error;
  }
}

export async function completeShoppingList(listId, payload, token) {
  try {
    const { data } = await axiosInstance.put(
      `/api/lists/${listId}/complete`,
      payload,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return data;
  } catch (error) {
    console.error("completeShoppingList Error:", error);
    throw error;
  }
}

export async function createList(listData, token) {
  try {
    const { data } = await axiosInstance.post("/api/lists", listData, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return data;
  } catch (error) {
    console.error("createList Error:", error);
    throw error;
  }
}

export async function deleteList(listId, token) {
  try {
    const { data } = await axiosInstance.delete(`/api/lists/${listId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return data;
  } catch (error) {
    console.error("deleteList Error:", error);
    throw error;
  }
}

export async function getPendingLists(token) {
  try {
    const { data } = await axiosInstance.get("/api/lists/pending", {
      headers: { Authorization: `Bearer ${token}` },
    });
    return data;
  } catch (error) {
    console.error("getPendingLists Error:", error);
    throw error;
  }
}

export async function getPurchasedLists(token) {
  try {
    const { data } = await axiosInstance.get("/api/lists/purchased", {
      headers: { Authorization: `Bearer ${token}` },
    });
    return data;
  } catch (error) {
    console.error("getPurchasedLists Error:", error);
    throw error;
  }
}
