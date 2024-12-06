import express from "express";
import { authenticate, authorize } from "../middleware/auth.js";
import Orders from "../models/orders.js";

const OrdersRouter = express.Router();

OrdersRouter.post(
  "/items",
  authenticate,
  authorize(["admin"]),
  async (req, res) => {
    try {
      const { name, price, isAvailable } = req.body;
      const newItem = await Orders.create({ name, price, isAvailable });

      res.status(201).send(newItem);
    } catch (error) {
      res.status(500).send(`Error creating item: ${error.message}`);
    }
  }
);

OrdersRouter.put(
  "/items/:id",
  authenticate,
  authorize(["admin"]),
  async (req, res) => {
    try {
      const { id } = req.params;
      const { name, price, isAvailable } = req.body;
      const updatedItem = await Orders.findByIdAndUpdate(
        id,
        { name, price, isAvailable },
        { new: true, runValidators: true }
      );

      if (!updatedItem) {
        return res.status(404).send("Order item not found");
      }

      res.status(200).send(updatedItem);
    } catch (error) {
      res.status(500).send(`Error updating item: ${error.message}`);
    }
  }
);

OrdersRouter.delete(
  "/items/:id",
  authenticate,
  authorize(["admin"]),
  async (req, res) => {
    try {
      const { id } = req.params;
      const deletedItem = await Orders.findByIdAndDelete(id);

      if (!deletedItem) {
        return res.status(404).send("Order item not found");
      }

      res.status(200).send(deletedItem);
    } catch (error) {
      res.status(500).send(`Error deleting item: ${error.message}`);
    }
  }
);

OrdersRouter.get("/items/:id", authenticate, async (req, res) => {
  try {
    const { id } = req.params;
    const item = await Orders.findById(id);

    if (!item) {
      return res.status(404).send("Order item not found");
    }

    res.status(200).send(item);
  } catch (error) {
    res.status(500).send(`Error retrieving item: ${error.message}`);
  }
});

OrdersRouter.get("/items", authenticate, async (req, res) => {
  try {
    const items = await Orders.find();

    res.status(200).send(items);
  } catch (error) {
    res.status(500).send(`Error retrieving items: ${error.message}`);
  }
});

OrdersRouter.get("/items/below/:price", authenticate, async (req, res) => {
  try {
    const { price } = req.params;
    const items = await Orders.find({ price: { $lt: price } });

    res.status(200).send(items);
  } catch (error) {
    res.status(500).send(`Error retrieving items: ${error.message}`);
  }
});

OrdersRouter.get("/items/available", authenticate, async (req, res) => {
  try {
    const items = await Orders.find({ isAvailable: true });

    res.status(200).send(items);
  } catch (error) {
    res.status(500).send(`Error retrieving available items: ${error.message}`);
  }
});

OrdersRouter.post("/validate", authenticate, async (req, res) => {
  try {
    const { items } = req.body;

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).send("Invalid order: items list is required");
    }

    const orderValidation = await Promise.all(
      items.map(async (id) => {
        const item = await Orders.findById(id);
        
        return item ? { id, valid: true } : { id, valid: false };
      })
    );

    res.status(200).send(orderValidation);
  } catch (error) {
    res.status(500).send(`Error validating order: ${error.message}`);
  }
});

export default OrdersRouter;
