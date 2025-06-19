const axios = require("axios");
const USER_SERVICE_URL = process.env.USER_SERVICE_URL;

exports.getUserById = async (userId) => {
  try {
  const { data } = await axios.get(`${USER_SERVICE_URL}/user/${userId}`);
  return data;
} catch (err) {
  console.error("❌ getUserById error:", err.response?.data || err.message);
  throw err;
}
};
