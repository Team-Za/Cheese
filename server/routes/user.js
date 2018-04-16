import express from "express";
import stock from "../controllers/userController"

const router = express.Router();

// Route to get list of crypto currencies for drop down.
router.get("/", user.findAll);
router.get("/:id", user.findById);
router.post("/", user.create);
router.put("/:id", user.update);
router.delete("/:id", user.remove);

// Export routes for server.js to use.
export default router;
