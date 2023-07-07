const { Router } = require("express");
const {
  addOperation,
  getOperation,
  getOperationById,
  updateOperation,
  deleteOperation,
} = require("../controller/operation.controller");
const adminPolice = require("../middleware/admin.Police");

const router = Router();

router.post("/add",adminPolice, addOperation);
router.get("/", getOperation);
router.get("/:id", getOperationById);
router.put("/:id",adminPolice, updateOperation);
router.delete("/:id",adminPolice, deleteOperation);

module.exports = router;
