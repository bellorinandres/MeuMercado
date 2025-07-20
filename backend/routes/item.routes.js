import express from "express";
import {
  getItemsByList,
  getItemById,
  createItem,
  deleteItem,
} from "../controllers/item.controllers.js";
import { updateItem } from "../models/item.models.js";

const itemRouter = express.Router();

itemRouter.get("/:list_id", getItemsByList);
itemRouter.get("/item/:id", getItemById);
itemRouter.post("/", createItem);
itemRouter.patch("/:id", updateItem);
itemRouter.delete("/:id", deleteItem);

export default itemRouter;
