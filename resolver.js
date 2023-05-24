const grpc = require("@grpc/grpc-js");
const protoLoader = require("@grpc/proto-loader");

// Load the protobuf
const authProtoPath = "auth.proto";
const todoProtoPath = "todo.proto";

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

// GraphQL resolvers

const resolvers = {
  Query: {
    getTodoItem: (_, { id }) => {
        // Create gRPC clients for todo services
        const todoService = new todoProto.TodoService(
            "localhost:50051",
            credentials.createInsecure()
          );
      return new Promise((resolve, reject) => {
        todoService.GetTodoItem({ id }, (error, response) => {
          if (error) {
            reject(error);
          } else {
            resolve({items:response.items});
          }
        });
      });
    },
    listTodoItems: () => {
        // Create gRPC clients for todo services
        const todoService = new todoProto.TodoService(
            "localhost:50051",
            credentials.createInsecure()
          );
      return new Promise((resolve, reject) => {
        todoService.ListTodoItems({}, (error, response) => {
          if (error) {
            reject(error);
          } else {
            resolve(response.todos);
          }
        });
      });
    },
  },
  Mutation: {
    registerUser: (_, { username, password }) => {
        // Create gRPC clients for authentication
        const authService = new authProto.AuthService(
            "localhost:50052",
            credentials.createInsecure()
          );

      return new Promise((resolve, reject) => {
        authService.registerUser(
          { username, password },
          (error, response) => {
            if (error) {
              reject(error);
            } else {
              resolve(response.user);
            }
          }
        );
      });
    },
    loginUser: (_, { username, password }) => {
        // Create gRPC clients for authentication
        const authService = new authProto.AuthService(
            "localhost:50052",
            credentials.createInsecure()
          );

      return new Promise((resolve, reject) => {
        authService.loginUser({ username, password }, (error, response) => {
          if (error) {
            reject(error);
          } else {
            resolve(response.user);
          }
        });
      });
    },
    createTodoItem: (_, { title, description }) => {
        // Create gRPC clients for todo services
        const todoService = new todoProto.TodoService(
            "localhost:50051",
            credentials.createInsecure()
          );
      return new Promise((resolve, reject) => {
        todoService.createTodoItem(
          { title, description },
          (error, response) => {
            if (error) {
              reject(error);
            } else {
              resolve(response.todo);
            }
          }
        );
      });
    },

  },
};
module.exports = resolvers;
