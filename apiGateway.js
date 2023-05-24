const express = require("express");
const { ApolloServer } = require("@apollo/server");
const { expressMiddleware } = require("@apollo/server/express4");
const bodyParser = require("body-parser");
const cors = require("cors");
const grpc = require("@grpc/grpc-js");
const protoLoader = require("@grpc/proto-loader");

// Load the protobuf
const authProtoPath = "auth.proto";
const todoProtoPath = "todo.proto";
const resolvers = require("./resolver").default;
const typeDefs = require("./schema");

const app = express();
const authPackageDefinition = protoLoader.loadSync(authProtoPath, {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true,
  });

const todoPackageDefinition = protoLoader.loadSync(todoProtoPath, {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true,
  });

const todoProto = grpc.loadPackageDefinition(todoPackageDefinition).todo;
const authProto = grpc.loadPackageDefinition(authPackageDefinition).auth;

const server = new ApolloServer({ typeDefs, resolvers });

server.start().then(() => {
    app.use(cors(), bodyParser.json(), expressMiddleware(server));
  });

app.get("/todo",(req,res)=>{
    const todoService = new todoProto.TodoService(
        "localhost:50051",
        grpc.credentials.createInsecure()
      );
    todoService.ListTodoItems({}, (error, response) => {
        if (error) {
          res.status(500).json(error);
        } else {
          res.json(response.todos);
        }
      });
});

app.post("/todo",(req,res)=>{
    const todoService = new todoProto.TodoService(
        "localhost:50051",
        grpc.credentials.createInsecure()
      );
    todoService.CreateTodoItem(req.body, (error, response) => {
        if (error) {
          res.status(500).json(error);
        } else {
          res.json(response.todo);
        }
      });
});

app.post("/register",(req,res)=>{
    const authService = new authProto.AuthService(
        "localhost:50052",
        grpc.credentials.createInsecure()
      );
    authService.registerUser(req.body, (error, response) => {
        if (error) {
          res.status(500).json(error);
        } else {
          res.json(response);
        }
      });
});

app.post("/login",(req,res)=>{
    const authService = new authProto.AuthService(
        "localhost:50052",
        grpc.credentials.createInsecure()
      );
    authService.loginUser(req.body, (error, response) => {
        if (error) {
          res.status(500).json(error);
        } else {
          res.json(response);
        }
      });
});

// Démarrer l'application Express
const port = 3000;
app.listen(port, () => {
  console.log(`API Gateway en cours d'exécution sur le port ${port}`);
});
