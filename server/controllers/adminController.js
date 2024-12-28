import { pgPoll } from "../config/db.js";
import redis from "../config/redis.js";
import Location from "../models/Location.js";

export const getUsers = async (req, res) => {
  if (req.user.role !== "admin") {
    return res.status(403).send("Access Denied");
  }

  try {
    const query = "SELECT id, name, email, role from users";
    const { rows } = await pgPoll.query(query);

    res.status(201).send(rows);
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
    const locations = await Location.find({ userId: req.params.id });
    if(!locations){
      return res.status(404).send("Locations not found");
    }

    res.status(201).send({ source: "database", locations });
  } catch (error) {
    console.log(">>>>> getUserLocations: error : ", error);
    res.status(500).send("Error fetching locations");
  }
};

export const getUserCurrentLocation = async (req, res) => {
  if (req.user.role !== "admin") {
    return res.status(403).send("Access Denied!");
  }

  try {
    const cachedLocation = await redis.get(`user:${req.user.id}:location`);
    if (cachedLocation) {
      return res.status(201).send({
        source: "cache",
        location: JSON.parse(cachedLocation),
      });
    }

    const location = await Location.findOne({ userId: req.user.id }).sort({
      timestamp: -1,
    });

    if (!location) {
      return res.status(404).send("Location not found");
    }

    res.send({ source: "database", location });
  } catch (error) {
    console.log(">>>>> getUserCurrentLocation: error : ", error);
    res.status(500).send("Error fetching location");
  }
};
