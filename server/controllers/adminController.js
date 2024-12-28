import { pgPoll } from "../config/db.js";
import redis from "../config/redis.js";
import Location from "../models/Location.js";

export const getUsers = async (req, res) => {
  if (req.user.role !== "admin") {
    return res.status(403).send("Access Denied");
  }

  try {
    const query = "SELECT id, name, email, role FROM users";
    const { rows } = await pgPoll.query(query);

    res.status(200).send(rows);
  } catch (error) {
    console.log(">>>>> getUsers: error : ", error);
    res.status(500).send("Error fetching users");
  }
};

export const getUserAllLocations = async (req, res) => {
  if (req.user.role !== "admin") {
    return res.status(403).send("Access Denied!");
  }

  try {
    const locations = await Location.find({ userId: req.params.id }).sort({
      timestamp: -1,
    });

    if (!locations || locations.length === 0) {
      return res.status(404).send("Locations not found");
    }

    res.status(200).send({ source: "database", locations });
  } catch (error) {
    console.error(">>>>> Error fetching all locations: ", error);
    res.status(500).send("Error fetching locations");
  }
};

export const getUserCurrentLocation = async (req, res) => {
  if (req.user.role !== "admin") {
    return res.status(403).send("Access Denied!");
  }

  try {
    const cachedLocation = await redis.get(`user:${req.params.id}:location`);
    if (cachedLocation) {
      return res.status(200).send({
        source: "cache",
        location: JSON.parse(cachedLocation),
      });
    }

    const location = await Location.findOne({ userId: req.params.id }).sort({
      timestamp: -1,
    });

    if (!location) {
      return res.status(404).send("Location not found");
    }

    res.status(200).send({ source: "database", location });
  } catch (error) {
    console.error("Error fetching current location: ", error);
    res.status(500).send("Error fetching location");
  }
};

// this is just for testing purposes
export const registerAdminUser = async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).send("All fields are required");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const query =
      "INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, $4) RETURNING *";
    const values = [name, email, hashedPassword, "admin"];

    const result = await pgPoll.query(query, values);

    if (!result) {
      return res.status(400).send("Error registering Admin user");
    }

    res.status(201).send(result.rows[0]);
  } catch (error) {
    console.log(">>>>> registerAdminUser: error : ", error);
    res.status(500).send("Error registering user");
  }
};
