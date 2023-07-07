const { Router } = require("express");

const operationRouter = require("./operation.routes");
const orderRouter = require("./order.routes");
const adminRouter = require("./admin.routes");
const statusRouter = require("./status.routes");
const currency_typeRouter = require("./currency_type.routes");
const router = Router();

router.use("/operation", operationRouter);
router.use("/order", orderRouter);
router.use("/admin", adminRouter);
router.use("/status", statusRouter);
router.use("/currency_type", currency_typeRouter);

module.exports = router;
