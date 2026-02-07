const clientURL = process.env.CLIENT_URL || "http://localhost:3000";

module.exports = (token) => {
  return `${clientURL}/user/confirm/${token}`;
};
