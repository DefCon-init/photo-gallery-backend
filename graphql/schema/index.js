const { buildSchema } = require("graphql");

module.exports = buildSchema(`

type Post {
  id: ID!
  image: String!
  date: String!
  user: User!
}

type User {
  id: ID!
  email: String!
  password: String
  posts: [Post!]
}

input PostInput {
  image: String!
  date: String!
  userId: String!
}

type RootQuery {
  posts: [Post!]!
  users: [User!]!
  userById(id: String!): User!
  userByEmail(email: String!): User!
}

type RootMutation {
  createPost(postInput: PostInput): Post
}

schema {
  query: RootQuery
  mutation: RootMutation
}
`);
