import express from "express";
import stock from "../controllers/stockController"

const router = express.Router();

// Route to get list of crypto currencies for drop down.
router.get("/", stock.findAll);
router.get("/:id", stock.findById);
router.get("/:price/:PortfolioId", stock.findByPrice);
router.post("/", stock.create);
router.put("/:id", stock.update);
router.delete("/:id", stock.remove);

// Export routes for server.js to use.
export default router;
