const dotenv = require("dotenv");
dotenv.config();

module.exports = {
  MONGODB: `mongodb+srv://duy1:${process.env.DB_USER_PASSWORD}@vlfeedscluster.klfdqgl.mongodb.net/?appName=VLFeedsCluster`,
  PORT: `${process.env.PORT}`,
  SECRET_KEY: `${process.env.SECRET_KEY}`,
  URL: `${process.env.URL}`,
};
