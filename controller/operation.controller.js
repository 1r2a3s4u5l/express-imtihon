const pool = require("../config/db");
const { operationValidation } = require("../validations/operation.validations");
const addOperation = async (req, res) => {
  try {
    const { error, value } = operationValidation(req.body);
    if (error) {
      return res.status(404).send({ message: error.details[0].message });
    }
    const { order_id, status_id, admin_id, description } = value;

    const newOperation = await pool.query(
      `
        INSERT INTO operation (order_id,status_id, admin_id,description)
        values($1, $2, $3, $4) RETURNING *
        `,
      [order_id, status_id, admin_id, description]
    );
    console.log(newOperation);
    res.status(200).json(newOperation.rows);
  } catch (error) {
    res.status(500).json("Serverda xatolik");
    console.log(error);
  }
};

const getOperation = async (req, res) => {
  try {
    const operation = await pool.query(`select * from operation`);
    res.status(200).send(operation.rows);
  } catch (error) {
    res.status(500).json("Serverda xatolik");
  }
};
const getOperationById = async (req, res) => {
  try {
    const id = req.params.id;
    if (isNaN(id)) {
      return res.status(400).send({ massage: "invalid id" });
    }
    const operation = await pool.query(
      `
          select * from operation where id = $1
          `,
      [id]
    );
    if (operation.rowCount == 0) {
      return res.status(400).send({ massage: "id is not defined" });
    }
    res.status(200).send(operation.rows);
  } catch (error) {
    res.status(500).json("Serverda xatolik");
  }
};

const updateOperation = async (req, res) => {
  try {
    const { error, value } = operationValidation(req.body);
    if (error) {
      return res.status(404).send({ message: error.details[0].message });
    }
    const id = req.params.id;
    const { order_id, status_id, admin_id, description } = value;
    if (isNaN(id)) {
      return res.status(400).send({ massage: "invalid id" });
    }
    const operation = await pool.query(
      `
            UPDATE operation set order_id = $1,status_id = $2,admin_id = $3, description = $4
            WHERE id = $5
            RETURNING *
        `,
      [order_id, status_id, admin_id, description, id]
    );
    if (operation.rowCount == 0) {
      return res.status(400).send({ massage: "id is not defined" });
    }
    res.status(200).json(operation.rows);
  } catch (error) {
    res.status(500).json("Serverda xatolik");
    console.log(error);
  }
};
const deleteOperation = async (req, res) => {
  try {
    const id = req.params.id;
    if (isNaN(id)) {
      return res.status(400).send({ massage: "invalid id" });
    }
    const operation = await pool.query(`DELETE FROM operation WHERE id = $1`, [
      id,
    ]);
    if (operation.rowCount == 0) {
      return res.status(400).send({ massage: "id is not defined" });
    }
    res.status(200).json("Successfully deleted");
  } catch (error) {
    res.status(500).json("Serverda xatolik");
  }
};

module.exports = {
  addOperation,
  getOperation,
  getOperationById,
  updateOperation,
  deleteOperation,
};
