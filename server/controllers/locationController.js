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

    await redis.xadd(
      "location_updates",
      "*",
      "userId",
      req.user.id,
      "latitude",
      latitude,
      "longitude",
      longitude,
      "timestamp",
      locationData.timestamp.toISOString(),
    );

    res.status(201).send("Location updated successfully");
  } catch (error) {
    console.log(">>>>> trackLocation: error : ", error);
    res.status(500).send("Error saving location");
  }
};

// Background worker for batching updates to MongoDB
export const flushLocationBatch = async () => {
  try {
    console.log(">>>>>⚙️ Executing flushLocationBatch");

    const messages = await redis.xread(
      "BLOCK",
      5000,
      "STREAMS",
      "location_updates",
      "0",
    );

    if (!messages || messages.length === 0) {
      console.log(">>>>> No new messages in the stream");
      return;
    }

    const [stream, entries] = messages[0];
    const locations = entries.map(([id, fields]) => {
      const location = {};
      for (let i = 0; i < fields.length; i += 2) {
        location[fields[i]] = fields[i + 1];
      }
      return location;
    });

    await Location.insertMany(locations);

    console.log(">>>>>🟢 flushLocationBatch executed successfully");

    const messageIds = entries.map(([id]) => id);
    await Promise.all(
      messageIds.map((id) => redis.xdel("location_updates", id)),
    );

    console.log(`>>>>> Flushed ${messageIds.length} locations to MongoDB`);
  } catch (error) {
    console.error(">>>>> Error flushing location batch: ", error);
  }
};
