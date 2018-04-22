import express from "express";
import port from "../controllers/portfolioController"

const router = express.Router();


router.get("/", port.findAll);
router.get("/:id", port.findById);
router.get("/port/:UserId",port.getPortfolioAndStocks);
router.get("/user/:UserId",port.getPortfolioAndStocksbyUserId);
router.get("/nostock/:UserId",port.getPortfoliobyUserId);
router.post("/", port.create);
router.put("/:id", port.update);
router.delete("/:id", port.remove);

// Export routes for server.js to use.
export default router;
