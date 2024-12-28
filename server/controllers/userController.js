import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { pgPoll } from "../config/db.js";

export const registerUser = async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).send("All fields are required");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const query =
      "INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING *";
    const values = [name, email, hashedPassword];

    const result = await pgPoll.query(query, values);

    if (!result) {
      return res.status(400).send("Error registering user");
    }

    res.status(201).send(result.rows[0]);
  } catch (error) {
    console.log(">>>>> registerUser : error : ", error);
    res.status(500).send("Error registering user");
  }
};

export const loginUser = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).send("All fields are required");
  }

  try {
    const query = "SELECT * FROM users WHERE email = $1";
    const { rows } = await pgPoll.query(query, [email]);

    if (rows.length === 0) {
      return res.status(400).send("User not found");
    }

    const user = rows[0];
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) return res.status(400).send("Invalid credentials");

    const token = jwt.sign(
      { id: user.id, role: user.role, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1d" },
    );

    if (!token) {
      return res.status(400).send("Error generating token");
    }

    res
      .cookie("token", token)
      .header("Authorization", token)
      .send({ user, token });
  } catch (error) {
    console.log(">>>>> loginUser: error : ", error);
    res.status(500).send("Error logging in");
  }
};
