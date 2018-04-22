import express from "express";
import user from "../controllers/userController"

const router = express.Router();


router.get("/", user.findAll);
router.get("/:id", user.findById);
router.get("/users/:username", user.findByUsername);
// router.post("/", user.create);
router.put("/:id", user.update);
router.delete("/:id", user.remove);

// Export routes for server.js to use.
export default router;
