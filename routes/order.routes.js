const { Router } = require("express");
const {
  addOrder,
  getOrder,
  getOrderById,
  updateOrder,
  deleteOrder,
} = require("../controller/order.controller");
const adminPolice = require("../middleware/admin.Police");

const router = Router();

router.post("/add", adminPolice(), addOrder);
router.get("/", getOrder);
router.get("/:id", getOrderById);
router.put("/:id", adminPolice(), updateOrder);
router.delete("/:id", adminPolice(), deleteOrder);

module.exports = router;
