import Location from "../models/Location.js";
import redis from "../config/redis.js";

export const trackLocation = async (req, res) => {
  const { latitude, longitude } = req.body;
  if (!latitude || !longitude) {
    return res.status(400).send("Location data is required");
  }

  try {
    const locationData = { latitude, longitude, timestamp: new Date() };

    await redis.set(
      `user:${req.user.id}:location`,
      JSON.stringify(locationData),
      "EX",
      600,
    );

    const location = new Location({ userId: req.user.id, ...locationData });
    await location.save();

    res.status(201).send("location saved");
  } catch (error) {
    console.log(">>>>> trackLocation: error : ", error);
    res.status(500).send("Error saving location");
  }
};
