const pool = require("../config/db");
const { statusValidation } = require("../validations/status.validations");
const addStatus = async (req, res) => {
  try {
    const { error, value } = statusValidation(req.body);
    if (error) {
      return res.status(404).send({ message: error.details[0].message });
    }
    const { name, description } = value;

    const newStatus = await pool.query(
      `
        INSERT INTO status (name,description)
        values($1, $2) RETURNING *
        `,
      [name, description]
    );
    console.log(newStatus);
    res.status(200).json(newStatus.rows);
  } catch (error) {
    res.status(500).json("Serverda xatolik");
    console.log(error);
  }
};

const getStatus = async (req, res) => {
  try {
    const status = await pool.query(`select * from status`);
    res.status(200).send(status.rows);
  } catch (error) {
    res.status(500).json("Serverda xatolik");
  }
};
const getStatusById = async (req, res) => {
  try {
    const id = req.params.id;
    if (isNaN(id)) {
      return res.status(400).send({ massage: "invalid id" });
    }
    const status = await pool.query(
      `
          select * from status where id = $1
          `,
      [id]
    );
    if (status.rowCount == 0) {
      return res.status(400).send({ massage: "id is not defined" });
    }
    res.status(200).send(status.rows);
  } catch (error) {
    res.status(500).json("Serverda xatolik");
  }
};

const updateStatus = async (req, res) => {
  try {
    const { error, value } = statusValidation(req.body);
    if (error) {
      return res.status(404).send({ message: error.details[0].message });
    }
    const { name, description } = value;
    const id = req.params.id;
    if (isNaN(id)) {
      return res.status(400).send({ massage: "invalid id" });
    }
    const status = await pool.query(
      `
            UPDATE status set name = $1,description = $2
            WHERE id = $3
            RETURNING *
        `,
      [name, description, id]
    );
    if (status.rowCount == 0) {
      return res.status(400).send({ massage: "id is not defined" });
    }
    res.status(200).json(status.rows);
  } catch (error) {
    res.status(500).json("Serverda xatolik");
    console.log(error);
  }
};
const deleteStatus = async (req, res) => {
  try {
    const id = req.params.id;
    if (isNaN(id)) {
      return res.status(400).send({ massage: "invalid id" });
    }
    const status = await pool.query(`DELETE FROM status WHERE id = $1`, [id]);
    if (status.rowCount == 0) {
      return res.status(400).send({ massage: "id is not defined" });
    }
    res.status(200).json("Successfully deleted");
  } catch (error) {
    res.status(500).json("Serverda xatolik");
  }
};

module.exports = {
  addStatus,
  getStatus,
  getStatusById,
  updateStatus,
  deleteStatus,
};
