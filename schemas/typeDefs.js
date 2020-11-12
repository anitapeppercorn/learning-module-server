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

  type Paragraph {
    _id: ID
    paragraphRef: Number
    paragraphNumber: Number
    paragraphContent: String
    paragraphPoster: [String]
    paragraphVideo: [Video]
    paragraphReleaseDate: String
  }

  type Section {
    _id: ID
    sectionNumber: Number
    sectionTitle: String
    sectionOverview: String
    sectionReleaseDate: String
    sectionParagraph: [Paragraph]
  }

  type Lesson {
    _id: ID
    lessonNumber: Int
    lessonTitle: String
    lessonOverview: String
    lessonReleaseDate: String
    lessonSection: [Section]
    lessonTime: String
  }

  type Module {
    _id: ID
    moduleNumber: Int
    moduleTitle: String
    moduleOverview: String
    moduleReleaseDate: String
    modulePoster: [String]
    moduleCategory: Category
    moduleVideo: [Video]
    moduleLesson: [Lesson]
  }

  type Video {
    _id: ID
    videoNumber: Int
    videoTitle: String
    videoContent: String
    videoOverview: String
    videoReleaseDate: String
  }

  type User {
    _id: ID!
    userName: String
    email: String
    friends: [User]
    completedModules: [Module]
  }

  type Category {
    _id: ID
    name: String
  }

  type Auth {
    token: ID
    user: User
  }

  type Query {
    categories: [Category]
    modules(moduleCategory: ID, moduleTitle: String, moduleLesson: ID, moduleVideo: ID): [Module]
    module(_id: ID!): Module
    lessons(lessonTitle: String, sectionTitle: ID, ): [Lesson]
    lesson(_id: ID!): Lesson
    sections(sectionTitle: String, sectionParagraph: ID): [Section]
    section(_id: ID!): Section
    paragraphs( paragraphVideo: ID): [Paragraph]
    user: User
  }

  type Mutation {
    addUser(userName:String!, email: String!, password: String!): Auth
    updateUser(userName: String, email: String, password: String): User
    updateModule(_id: ID!, completedModules: String!): Module
    login(email: String!, password: String!): Auth
  }

`;

module.exports = typeDefs;
