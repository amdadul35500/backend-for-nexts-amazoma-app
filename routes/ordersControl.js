import express from "express";
import expressAsyncHandler from "express-async-handler";
import Order from "../models/orderModal.js";

const orderControlRouter = express.Router();

// GEL ALL
orderControlRouter.get(
  "/",
  expressAsyncHandler(async (req, res) => {
    try {
      const orders = await Order.find();
      res.send(orders);
    } catch (error) {
      console.log(error);
    }
  })
);

// ORDER DELETE
orderControlRouter.delete("/:id", async (req, res) => {
  try {
    const orderDelete = await Order.findByIdAndDelete(req.params.id);
    res.send("Order deleted successfully!");
  } catch (error) {
    console.log(error);
  }
});

export default orderControlRouter;
