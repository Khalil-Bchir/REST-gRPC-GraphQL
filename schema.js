const { gql } = require('apollo-server-express');

const typeDefs = gql`
  type User {
    id: Int
    username: String
    password: String
  }

  type Todo {
    id: String
    title: String
    description: String
    completed: Boolean
  }

  type RegisterUserResponse {
    user: User
  }

  type LoginUserResponse {
    user: User
  }

  type CreateTodoItemResponse {
    todo: Todo
  }

  type Query {
    getTodoItem(id: Int!): Todo
    listTodoItems: [Todo]
  }

  type Mutation {
    registerUser(username: String, password: String): RegisterUserResponse
    loginUser(username: String, password: String): LoginUserResponse
    createTodoItem(title: String, description: String): CreateTodoItemResponse
  }
`;

module.exports = typeDefs;
