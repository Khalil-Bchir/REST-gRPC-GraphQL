# REST gRPC GraphQL
 
# Todo List and User Authentication Microservices

This project implements a Todo List and User Authentication system using gRPC, REST, and GraphQL. It consists of microservices for managing todo items and handling user authentication.

## Technologies Used

- Node.js
- gRPC
- Express.js
- SQLite3
- Apollo Server
- REST API
- GraphQL

## Project Structure

The project is structured as follows:

- `todoService.js`: gRPC service for managing todo items.
- `todo.proto`: Protocol Buffer file defining the todo service API.
- `authService.js`: gRPC service for user authentication.
- `auth.proto`: Protocol Buffer file defining the authentication service API.
- `apiGateway.js`: REST API gateway for handling HTTP requests.
- `resolver.js`: GraphQL resolver functions.
- `schema.js`: GraphQL schema definitions.
- `database.db`: SQLite3 database file for storing todo items and user data.

## Getting Started

1. Clone the repository:

   ```shell
   git clone <repository-url>
Install dependencies:

shell
Copy code
cd <project-directory>
npm install
Start the gRPC services:

shell
Copy code
node todoService.js
node authService.js
Start the API gateway:

shell
Copy code
node apiGateway.js
Access the application:

Todo List gRPC service: localhost:50051
Authentication gRPC service: localhost:50052
REST API: localhost:3000
GraphQL API: localhost:4000/graphql
API Documentation
The API documentation for the Todo List and User Authentication services can be found in the respective proto files: todo.proto and auth.proto. These files define the available methods and their request/response formats.

Contributing
Contributions are welcome! If you find any issues or want to add new features, please open an issue or submit a pull request.

License