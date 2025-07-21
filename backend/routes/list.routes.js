import express from "express";
import {
  createList,
  deleteList,
  getShoppingListDetails,
  getListsByUser,
  completeList,
  DetailsListComplete,
} from "../controllers/list.controllers.js";

const listRouter = express.Router();

// listRouter.get("/");
listRouter.post("/", createList);

listRouter.get("/:user_id", getListsByUser);
listRouter.get("/shopping/:list_id", getShoppingListDetails);
listRouter.get("/completeDetails/:list_id", DetailsListComplete);

listRouter.delete("/:list_id", deleteList);

listRouter.put("/:listId/complete", completeList);

export default listRouter;
