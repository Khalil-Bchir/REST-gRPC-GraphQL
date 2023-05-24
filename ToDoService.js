const grpc = require("@grpc/grpc-js");
const protoLoader = require("@grpc/proto-loader");
const sqlite3 = require("sqlite3");

// Load the protobuf
const todoProtoPath = "todo.proto";
const packageDefinition = protoLoader.loadSync(todoProtoPath, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});

const todoProto = grpc.loadPackageDefinition(packageDefinition).todo;

// Create an SQLite3 database connection
const db = new sqlite3.Database("database.db");

// Execute initial database setup
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS Todo (
      id TEXT PRIMARY KEY,
      title TEXT,
      description TEXT,
      completed INTEGER
    )
  `);
});

const ToDoService = {
  createTodoItem: (call, callback) => {
    const { title, description } = call.request;

    const id = Math.random().toString(36).substring(7);
    const completed = false;

    const statement = db.prepare(
      "INSERT INTO Todo (id, title, description, completed) VALUES (?, ?, ?, ?)"
    );

    statement.run(id, title, description, completed, function (err) {
      if (err) {
        console.error("Error creating todo item:", err);
        callback(err);
      } else {
        callback(null, { todo: { id, title, description, completed } });
      }
    });

    statement.finalize();
  },

  getTodoItem: (call, callback) => {
    const { id } = call.request;

    const statement = db.prepare("SELECT * FROM Todo WHERE id = ?");
    statement.get(id, function (err, row) {
      if (err) {
        console.error("Error retrieving todo item:", err);
        callback(err);
      } else if (row) {
        const { id, title, description, completed } = row;
        callback(null, { todo: { id, title, description, completed } });
      } else {
        callback({
          code: grpc.status.NOT_FOUND,
          details: "Todo item not found",
        });
      }
    });

    statement.finalize();
  },

  listTodoItems: (call, callback) => {
    const statement = db.prepare("SELECT * FROM Todo");
    statement.all(function (err, rows) {
      if (err) {
        console.error("Error retrieving todo items:", err);
        callback(err);
      } else {
        const todos = rows.map(({ id, title, description, completed }) => ({
          id,
          title,
          description,
          completed,
        }));
        callback(null, { todos });
      }
    });

    statement.finalize();
  },
};

const server = new grpc.Server();
server.addService(todoProto.TodoService.service, ToDoService);
const port = 50051;
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
console.log(`ToDo List microservice running on port ${port}`);
