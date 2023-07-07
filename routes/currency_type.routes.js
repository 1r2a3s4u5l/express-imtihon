const { Router } = require("express");
const {
  addCurrency_type,
  getCurrency_type,
  getCurrency_typeById,
  updateCurrency_type,
  deleteCurrency_type,
} = require("../controller/currency_type.controller");
const adminPolice = require("../middleware/admin.Police");

const router = Router();

router.post("/add", addCurrency_type);
router.get("/", getCurrency_type);
router.get("/:id", getCurrency_typeById);
router.put("/:id",adminPolice, updateCurrency_type);
router.delete("/:id",adminPolice, deleteCurrency_type);

module.exports = router;
