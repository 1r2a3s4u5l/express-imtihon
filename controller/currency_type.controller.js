const pool = require("../config/db");
const { currency_typeValidation } = require("../validations/currency_type.validations");
const addCurrency_type = async (req, res) => {
  try {
    const { error, value } = currency_typeValidation(req.body);
    if (error) {
      return res.status(404).send({ message: error.details[0].message });
    }
    const { name, description } = value;

    const newCurrency_type = await pool.query(
      `
        INSERT INTO currency_type (name,description)
        values($1, $2) RETURNING *
        `,
      [name, description]
    );
    console.log(newCurrency_type);
    res.status(200).json(newCurrency_type.rows);
  } catch (error) {
    res.status(500).json("Serverda xatolik");
    console.log(error);
  }
};

const getCurrency_type = async (req, res) => {
  try {
    const currency_type = await pool.query(`select * from currency_type`);
    res.status(200).send(currency_type.rows);
  } catch (error) {
    res.status(500).json("Serverda xatolik");
  }
};
const getCurrency_typeById = async (req, res) => {
  try {
    const id = req.params.id;
    if (isNaN(id)) {
      return res.status(400).send({ massage: "invalid id" });
    }
    const currency_type = await pool.query(
      `
          select * from currency_type where id = $1
          `,
      [id]
    );
    if (currency_type.rowCount == 0) {
      return res.status(400).send({ massage: "id is not defined" });
    }
    res.status(200).send(currency_type.rows);
  } catch (error) {
    res.status(500).json("Serverda xatolik");
  }
};

const updateCurrency_type = async (req, res) => {
  try {
    const { error, value } = currency_typeValidation(req.body);
    if (error) {
      return res.status(404).send({ message: error.details[0].message });
    }
    const id = req.params.id;
    const { name, description } = value;
    if (isNaN(id)) {
      return res.status(400).send({ massage: "invalid id" });
    }
    const currency_type = await pool.query(
      `
            UPDATE currency_type set name = $1,description = $2
            WHERE id = $3
            RETURNING *
        `,
      [name, description, id]
    );
    if (currency_type.rowCount == 0) {
      return res.status(400).send({ massage: "id is not defined" });
    }
    res.status(200).json(currency_type.rows);
  } catch (error) {
    res.status(500).json("Serverda xatolik");
    console.log(error);
  }
};
const deleteCurrency_type = async (req, res) => {
  try {
    const id = req.params.id;
    if (isNaN(id)) {
      return res.status(400).send({ massage: "invalid id" });
    }
    const currency_type = await pool.query(
      `DELETE FROM currency_type WHERE id = $1`,
      [id]
    );
    if (currency_type.rowCount == 0) {
      return res.status(400).send({ massage: "id is not defined" });
    }
    res.status(200).json("Successfully deleted");
  } catch (error) {
    res.status(500).json("Serverda xatolik");
  }
};

module.exports = {
  addCurrency_type,
  getCurrency_type,
  getCurrency_typeById,
  updateCurrency_type,
  deleteCurrency_type,
};
