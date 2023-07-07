const pool = require("../config/db");
const bcryp = require("bcrypt");
const myjwt = require("../services/MyJwtServices");
const config = require("config");
const { adminValidation } = require("../validations/admin.validations");
const addAdmin = async (req, res) => {
  try {
    const { error, value } = adminValidation(req.body);
    if (error) {
      return res.status(404).send({ message: error.details[0].message });
    }
    const {
      full_name,
      user_name,
      password,
      phone_number,
      email,
      tg_link,
      description,
      is_creator
    } = value;
    const hashedPassword = await bcryp.hash(password, 7);
    const newAdmin = await pool.query(
      `
      INSERT INTO admin (full_name,user_name,hashed_password,phone_number,email,tg_link,description,is_creator)
      values($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *
      `,
      [
        full_name,
        user_name,
        hashedPassword,
        phone_number,
        email,
        tg_link,
        description,
        is_creator
      ]
      );
  
      const payload = {
        id:newAdmin.rows[0].id,
        is_creator:newAdmin.rows[0].is_creator,
        is_active:newAdmin.rows[0].is_active
      };
      const tokens = myjwt.generateTokens(payload);
      res.cookie("refreshToken", tokens.refreshToken, {
        mxAge: config.get("refresh_ms"),
        httpOnly: true,
      });
    console.log(newAdmin);
    res.status(200).json(newAdmin.rows);
  } catch (error) {
    res.status(500).json("Serverda xatolik");
    console.log(error);
  }
};
const getAdmin = async (req, res) => {
  try {
    const admin = await pool.query(`select * from admin`);
    res.status(200).send(admin.rows);
  } catch (error) {
    res.status(500).json("Serverda xatolik");
  }
};
const getAdminById = async (req, res) => {
  try {
    const id = req.params.id;
    if (isNaN(id)) {
      return res.status(400).send({ massage: "invalid id" });
    }
    const admin = await pool.query(
      `
          select * from admin where id = $1
          `,
      [id]
    );
    if (admin.rowCount == 0) {
      return res.status(400).send({ massage: "id is not defined" });
    }
    res.status(200).send(admin.rows);
  } catch (error) {
    res.status(500).json("Serverda xatolik");
  }
};
const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const admin = await pool.query(
      `
            select * from admin where email = $1
            `,
      [email]
    );
    if (!admin)
      return res.status(400).send({ message: "Email yoki parol noto'g'ri1" });
    const validPassword = await bcryp.hash(password, 7);
    if (!validPassword)
      return res.status(400).send({ message: "Email yoki parol noto'g'ri2" });

    // try {
    //   setTimeout(() => {
    //     var err = new Error("Hello");
    //     throwrr;
    //   }, 1000);
    // } catch (err) {
    //   console.log(err);
    // }
    const hashedPassword = await bcryp.hash(password, 7);

    const payload = {
      id:admin.rows[0].id,
      is_creator:admin.rows[0].is_creator,
      is_active:admin.rows[0].is_active
    };
    const tokens = myjwt.generateTokens(payload);
    const hashed_token = await bcryp.hash(tokens.refreshToken, 10);
    res.cookie("refreshToken", tokens.refreshToken, {
      mxAge: config.get("refresh_ms"),
      httpOnly: true,
    });
    const adminlogin = await pool.query(
      `
      UPDATE admin set hashed_token = $1
      WHERE email = $2
      RETURNING *
            `,
      [hashed_token, email]
    );
    if (adminlogin.rowCount == 0) {
      return res.status(400).send({ massage: "email is not defined" });
    }
    res.status(200).send({ ...tokens });
  } catch (error) {
    console.log(error);
  }
};
const logoutAdmin = async (req, res) => {
  try {
    const { refreshToken } = req.cookies;
    if (!refreshToken)
      return res.error(400, { friendlyMsg: "Token is not found" });
    const hashed_token = await bcryp.hash(refreshToken, 10);
    console.log(hashed_token);
    const token = await pool.query(
      `
      SELECT * FROM admin WHERE hashed_token = $1
            `,
      [hashed_token]
    );
    if (!token) return res.error(400, { friendlyMsg: "Token topilmadi" });
    console.log(1);
    const admin_logout = await pool.query(
      `UPDATE admin set hashed_token = $1 WHERE hashed_token = $2;`,
      [null, hashed_token]
    );
    res.clearCookie("refreshToken");
    res.status(200).send("you are logged out");
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: error, friendlyMsg: "Serverda hatolik" });
  }
};
const updateAdmin = async (req, res) => {
  try {
    const { error, value } = adminValidation(req.body);
    if (error) {
      return res.status(404).send({ message: error.details[0].message });
    }
    const id = req.params.id;
    const { user_name, email, tg_link, description } = value;
    if (isNaN(id)) {
      return res.status(400).send({ massage: "invalid id" });
    }
    const admin = await pool.query(
      `
            UPDATE admin set user_name = $1,email = $2,tg_link = $3, description = $4
            WHERE id = $5
            RETURNING *
        `,
      [user_name, email, tg_link, description, id]
    );
    if (admin.rowCount == 0) {
      return res.status(400).send({ massage: "id is not defined" });
    }
    res.status(200).json(admin.rows);
  } catch (error) {
    res.status(500).json("Serverda xatolik");
    console.log(error);
  }
};
const deleteAdmin = async (req, res) => {
  try {
    const id = req.params.id;
    if (isNaN(id)) {
      return res.status(400).send({ massage: "invalid id" });
    }
    const admin = await pool.query(`DELETE FROM admin WHERE id = $1`, [id]);
    if (admin.rowCount == 0) {
      return res.status(400).send({ massage: "id is not defined" });
    }
    res.status(200).json("Successfully deleted");
  } catch (error) {
    res.status(500).json("Serverda xatolik");
  }
};
const refreshAdminToken = async (req, res) => {
  try {
    const { refreshToken } = req.cookies;
    console.log(refreshToken);
    const { password, email } = req.body;
    if (!refreshToken)
      return res.status(400).send({ message: "Token topilmadi" });
    const hashedPassword = await bcryp.hash(password, 7);
    const admin = await pool.query(
      `
            select * from admin where hashed_password = $1 and email = $2
            `,
      [hashedPassword, email]
    );
    const payload = {
      id:admin.rows[0].id,
      is_creator:admin.rows[0].is_creator,
      is_active:admin.rows[0].is_active
    };
    console.log(admin.rows);
    const tokens = myjwt.generateTokens(payload);
    res.cookie("refreshToken", tokens.refreshToken, {
      mxAge: config.get("refresh_ms"),
      httpOnly: true,
    });
    console.log(tokens.refreshToken);
    res.status(200).send({ ...tokens });
  } catch (error) {
    console.log(error);
  }
};
module.exports = {
  addAdmin,
  getAdmin,
  getAdminById,
  updateAdmin,
  deleteAdmin,
  loginAdmin,
  logoutAdmin,
  refreshAdminToken,
};
