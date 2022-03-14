const { ApolloServer } = require("apollo-server");
const mongoose = require("mongoose");

const typeDefs = require("./graphql/typeDefs");
const resolvers = require("./graphql/resolvers");
const { MONGODB, PORT } = require("./config");

//GraphQL---------------------------------------------------
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => ({ req }),
});

//MongoDB----------------------------------------------------
const connectDB = async () => {
  try {
    mongoose
      .connect(MONGODB, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      })
      .then(() => {
        console.log("MongoDB Connected...");
        return server.listen({ port: PORT });
      })
      .then((res) => {
        console.log(`Server started on port ${res.url}`);
      });
  } catch (error) {
    console.error(error.message);
  }
};
connectDB();
