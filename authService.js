const grpc = require("@grpc/grpc-js");
const protoLoader = require("@grpc/proto-loader");

// Load the protobuf
const authProtoPath = "auth.proto";
const packageDefinition = protoLoader.loadSync(authProtoPath, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});

const authProto = grpc.loadPackageDefinition(packageDefinition).auth;

const users = [];

const AuthService = {
  registerUser: (call, callback) => {
    const { username, password } = call.request;
    const user = {
      id: users.length + 1,
      username,
      password,
    };
    users.push(user);
    callback(null, { user });
  },

  loginUser: (call, callback) => {
    const { username, password } = call.request;
    const user = users.find(
      (user) => user.username === username && user.password === password
    );
    if (user) {
      callback(null, { user });
    } else {
      callback({
        code: grpc.status.NOT_FOUND,
        details: "Invalid username or password",
      });
    }
  },
};

const server = new grpc.Server();
server.addService(authProto.AuthService.service, AuthService);
const port = 50052;
server.bindAsync(
  `0.0.0.0:${port}`,
  grpc.ServerCredentials.createInsecure(),
  (err, port) => {
    if (err) {
      console.error("Failed to bind server:", err);
      return;
    }
    console.log(`Server is running on port ${port}`);
    server.start();
  }
);
console.log(`User Authentication microservice running on port ${port}`);
