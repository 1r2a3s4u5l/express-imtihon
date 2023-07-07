const { Router } = require("express");
const {
  addAdmin,
  getAdmin,
  getAdminById,
  updateAdmin,
  deleteAdmin,
  loginAdmin,
  logoutAdmin,
  refreshAdminToken,
} = require("../controller/admin.controller");
const creatorPolice = require("../middleware/creator.Police");

const router = Router();

router.post("/add", addAdmin);
router.get("/", getAdmin);
router.get("/:id", getAdminById);
router.put("/:id",creatorPolice, updateAdmin);
router.delete("/:id",creatorPolice, deleteAdmin);
router.post("/login", loginAdmin);
router.post("/logout", logoutAdmin);
router.post("/refresh", refreshAdminToken);

module.exports = router;
