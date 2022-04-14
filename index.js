const express = require("express");
const { ApolloServer } = require("apollo-server-express");
const { graphqlUploadExpress } = require("graphql-upload");
const mongoose = require("mongoose");
const cors = require("cors");

const typeDefs = require("./graphql/typeDefs");
const resolvers = require("./graphql/resolvers");
const { MONGODB, PORT } = require("./config");

const app = express();
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
      .then(async () => {
        console.log("MongoDB Connected...");
        await server.start();

        app.use(graphqlUploadExpress());
        app.use(express.static("public"));
        app.use(cors());
        server.applyMiddleware({ app });

        await new Promise((r) => {
          console.log(
            `Server started on port http://localhost:${PORT}/graphql`
          );
          return app.listen({ port: PORT });
        });
      });
  } catch (error) {
    console.error(error.message);
  }
};
connectDB();
