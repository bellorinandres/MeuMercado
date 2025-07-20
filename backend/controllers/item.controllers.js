import {
  findItemsByList,
  findItemById,
  insertItem,
  removeItem,
  updateItemPriceAndStatus,
} from "../models/item.models.js";

export const getItemsByList = async (req, res) => {
  try {
    const items = await findItemsByList(req.params.list_id);
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getItemById = async (req, res) => {
  try {
    const item = await findItemById(req.params.id);
    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }
    res.json(item);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const createItem = async (req, res) => {
  try {
    const { list_id, product_name, quantity, price } = req.body;
    const result = await insertItem(list_id, product_name, quantity, price);
    res.status(201).json({ id: result.insertId, product_name });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateItemStatus = async (req, res) => {
  try {
    const { is_bought } = req.body;
    const result = await updateItem(req.params.id, is_bought);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Item not found" });
    }
    res.json({ message: "Item status updated" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const deleteItem = async (req, res) => {
  try {
    const result = await removeItem(req.params.id);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Item not found" });
    }
    res.json({ message: "Item deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateItem = async (req, res) => {
  try {
    const { price, is_bought } = req.body;

    if (typeof price !== "number" || typeof is_bought !== "number") {
      return res
        .status(400)
        .json({ message: "price and is_bought must be numbers" });
    }

    const result = await updateItemPriceAndStatus(
      req.params.id,
      price,
      is_bought
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Item not found" });
    }

    res.json({ message: "Item updated successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

