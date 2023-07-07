const jwt = require("jsonwebtoken");
const config = require("config");

module.exports = function (req, res, next) {
  if (req.method == "OPTIONS") {
    next();
  }
  try {
    const authorization = req.headers.authorization;
    if (!authorization) {
      return res.status(403).json({ message: "Client ro'yhatdan o'tmagan" });
    }

    console.log(authorization, 1);
    const bearer = authorization.split(" ")[0];
    const token = authorization.split(" ")[1];
    if (bearer != "Bearer" || !token) {
      return res
        .status(403)
        .json({ message: "Client ro'yhatdan o'tmagan (token berilmagan)" });
    }
    const decodedToken = jwt.verify(token, config.get("adminSecret"));
    console.log(decodedToken,1);
    if(decodedToken.is_creator==false && decodedToken.is_active==true){
      next()
    } else {
      res.status(400).send("Sizga bunday huquq berilmagan")
    }
  } catch (error) {
    console.log(error);
    return res
      .status(403)
      .send({ message: "Client ro'yhatdan o'tmagan (token noto'g'ri)" });
  }
};
