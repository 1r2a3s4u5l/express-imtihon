const pool = require("../config/db");
const { orderValidation } = require("../validations/order.validations");
const addOrder = async (req, res) => {
  try {
    const { error, value } = orderValidation(req.body);
    if (error) {
      return res.status(404).send({ message: error.details[0].message });
    }
    const {
      order_unique_id,
      full_name,
      phone_number,
      product_link,
      summa,
      currency_type_id,
      truck,
      email,
      description,
    } = value;

    const newOrder = await pool.query(
      `
        INSERT INTO orders (order_unique_id,full_name,phone_number,product_link,summa,currency_type_id,truck,email,description)
        values($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *
        `,
      [
        order_unique_id,
        full_name,
        phone_number,
        product_link,
        summa,
        currency_type_id,
        truck,
        email,
        description,
      ]
    );
    console.log(newOrder);
    res.status(200).json(newOrder.rows);
  } catch (error) {
    res.status(500).json("Serverda xatolik");
    console.log(error);
  }
};

const getOrder = async (req, res) => {
  try {
    const order = await pool.query(`select * from orders`);
    res.status(200).send(order.rows);
  } catch (error) {
    res.status(500).json("Serverda xatolik");
  }
};
const getOrderById = async (req, res) => {
  try {
    const id = req.params.id;
    if (isNaN(id)) {
      return res.status(400).send({ massage: "invalid id" });
    }
    const order = await pool.query(
      `
          select * from orders where id = $1
          `,
      [id]
    );
    if (order.rowCount == 0) {
      return res.status(400).send({ massage: "id is not defined" });
    }
    res.status(200).send(order.rows);
  } catch (error) {
    res.status(500).json("Serverda xatolik");
  }
};

const updateOrder = async (req, res) => {
  try {
    const { error, value } = orderValidation(req.body);
    if (error) {
      return res.status(404).send({ message: error.details[0].message });
    }
    const id = req.params.id;
    const {
      order_unique_id,
      full_name,
      phone_number,
      product_link,
      summa,
      currency_type_id,
      truck,
      email,
      description,
    } = value;
    if (isNaN(id)) {
      return res.status(400).send({ massage: "invalid id" });
    }
    const order = await pool.query(
      `
            UPDATE orders set order_unique_id = $1,full_name = $2,phone_number = $3,product_link = $4,summa = $5,currency_type_id = $6,truck = $7,email = $8,description = $9
            WHERE id = $10
            RETURNING *
        `,
      [
        order_unique_id,
        full_name,
        phone_number,
        product_link,
        summa,
        currency_type_id,
        truck,
        email,
        description,
        id,
      ]
    );
    if (order.rowCount == 0) {
      return res.status(400).send({ massage: "id is not defined" });
    }
    res.status(200).json(order.rows);
  } catch (error) {
    res.status(500).json("Serverda xatolik");
    console.log(error);
  }
};
const deleteOrder = async (req, res) => {
  try {
    const id = req.params.id;
    if (isNaN(id)) {
      return res.status(400).send({ massage: "invalid id" });
    }
    const order = await pool.query(`DELETE FROM orders WHERE id = $1`, [id]);
    if (order.rowCount == 0) {
      return res.status(400).send({ massage: "id is not defined" });
    }
    res.status(200).json("Successfully deleted");
  } catch (error) {
    res.status(500).json("Serverda xatolik");
  }
};

module.exports = {
  addOrder,
  getOrder,
  getOrderById,
  updateOrder,
  deleteOrder,
};
