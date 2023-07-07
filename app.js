const express = require("express");
const config = require("config");
const mainRouter = require("./routes/index.routes");
const error_handing = require("./middleware/error_handing.middleware");
const logger = require("./services/logger");
const PORT = config.get("port") || 3030;
const cookieparser = require('cookie-parser');

// logger.log("info", "LOG ma'lumotlar");
// logger.error("ERROR ma'lumotlar");
// logger.debug("DEBUG ma'lumotlar");
// logger.warn("WARN ma'lumotlar");
// logger.info("INFO ma'lumotlar");

const app = express();

app.use(express.json());
app.use(cookieparser()); 
app.use("/api", mainRouter);

app.use(error_handing);


async function start() {
  try {
    app.listen(PORT, () => {
      console.log(`Server ${PORT}-portda ishga tushdi`);
    });
  } catch (error) {
    console.log(error);
  }
}

start();
