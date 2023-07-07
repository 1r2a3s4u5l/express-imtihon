const { Router } = require("express");
const {
  addStatus,
  getStatus,
  getStatusById,
  updateStatus,
  deleteStatus,
} = require("../controller/status.controller");
const adminPolice = require("../middleware/admin.Police");

const router = Router();

router.post("/add",adminPolice, addStatus);
router.get("/", getStatus);
router.get("/:id", getStatusById);
router.put("/:id",adminPolice, updateStatus);
router.delete("/:id",adminPolice, deleteStatus);

module.exports = router;
