import express from "express";
import {
  createList,
  deleteList,
  getShoppingListDetails,
  getListsByUser,
  completeList,
  getDetailListCompleted,
  addItemsToList,
  updateItemPrice,
} from "../controllers/list.controllers.js";

const listRouter = express.Router();

// listRouter.get("/");
listRouter.post("/", createList);
listRouter.post("/:listId/items", addItemsToList);

listRouter.get("/:user_id", getListsByUser);
listRouter.get("/shopping/:list_id", getShoppingListDetails);
listRouter.get("/completeDetails/:list_id", getDetailListCompleted);

listRouter.delete("/:list_id", deleteList);

listRouter.put("/:listId/complete", completeList);
listRouter.put("/items/:itemId", updateItemPrice);

export default listRouter;
