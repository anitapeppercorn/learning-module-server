const { gql } = require('apollo-server-express');

const typeDefs = gql`

  type Image {
    _id: ID
    imageNumber: Int
    imageTitle: String
    imageContent: String
    imageOverview: String
    imageReleaseDate: String
  }

  type Lesson {
    _id: ID
    lessonNumber: String
    lessonTitle: String
    lessonOverview: String
    lessonReleaseDate: String
    lessonParagraph: [Paragraph]
  }

  type Paragraph {
    _id: ID
    paragraphRef: String
    paragraphNumber: Int
    paragraphContent: String
    paragraphPoster: [String]
    paragraphVideo: [Video]
    paragraphReleaseDate: String
  }

  type Section {
    _id: ID
    sectionNumber: Int
    sectionTitle: String
    sectionOverview: String
    sectionReleaseDate: String
    sectionLesson: [Lesson]
  }

  type Module {
    _id: ID
    moduleNumber: Int
    moduleTitle: String
    moduleOverview: String
    moduleReleaseDate: String
    modulePoster: [String]
    moduleCategory: String
    moduleVideo: [Video]
    moduleSection: [Section]
  }

  type Video {
    videoNumber: Int
    videoTitle: String
    videoContent: String
    videoOverview: String
    videoReleaseDate: String
  }

  type User {
    _id: ID!
    username: String
    email: String
    friends: [User]
    completedModules: [Progress]
  }

  type Category {
    _id: ID
    name: String
  }

  type Progress {
    _id: ID!
    finishDate: String
    modules: [Module]
  }

  type Auth {
    token: ID
    user: User
  }

  type Query {
    completed(_id: ID!): Progress
    modules: [Module]
    module(_id: ID!): Module
    categories: [Category]
    lessons(section: ID): [Lesson]
    sections: [Section]
    paragraphs: [Paragraph]

    user: User
  }

  type Mutation {
    addUser(username: String!, email: String!, password: String!): Auth
    addCompleted(modules: [ID]!): Progress
    updateUser(username: String, email: String, password: String): User
    login(email: String!, password: String!): Auth
  }

`;

module.exports = typeDefs;
