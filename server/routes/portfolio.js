import express from "express";
import port from "../controllers/portfolioController"

const router = express.Router();

// Route to get list of crypto currencies for drop down.
router.get("/", port.findAll);
router.get("/:id", port.findById);
router.get("/port/:id",port.getPortfolioAndStocks);
router.get("/user/:id",port.getPortfolioAndStocksbyUserId);
router.get("/nostock/:id",port.getPortfoliobyUserId);
router.post("/", port.create);
router.put("/:id", port.update);
router.delete("/:id", port.remove);

// Export routes for server.js to use.
export default router;
