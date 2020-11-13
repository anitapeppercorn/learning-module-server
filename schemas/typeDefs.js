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
    paragraphRef: Int
    paragraphNumber: Int
    paragraphContent: String
    paragraphImage: [Image]
    paragraphVideo: [Video]
    paragraphReleaseDate: String
  }

  type Section {
    _id: ID
    sectionNumber: Int
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

  type Video {
    _id: ID
    videoNumber: Int
    videoTitle: String
    videoContent: String
    videoOverview: String
    videoReleaseDate: String
  }

  type Module {
    _id: ID
    moduleNumber: Int
    moduleTitle: String
    moduleOverview: String
    moduleReleaseDate: String
    modulePoster: String
    moduleCategory: String
    moduleVideo: [Video]
    moduleLesson: [Lesson]
  }

  type User {
    _id: ID!
    userName: String
    email: String
    friends: [User]
    completedModules: [Module]
  }

  type Auth {
    token: ID
    user: User
  }
  

  type Query {
    modules(moduleTitle: String, moduleLesson: ID, moduleVideo: ID, lessonSection: ID, sectionParagraph: ID): [Module]
    module(_id: ID!): Module
    lessons(lessonTitle: String, lessonSection: ID, sectionParagraph:ID): [Lesson]
    lesson(_id: ID!): Lesson
    sections(sectionNumber: Int,sectionTitle: String, sectionParagraph: ID): [Section]
    section(_id: ID!): Section
    paragraphs(_id: ID): [Paragraph]
    paragraph(_id: ID!): Paragraph
    user: User
  }

  type Mutation {
    addUser(userName:String!, email: String!, password: String!): Auth
    updateUser(userName: String, email: String, password: String): User
    updateModule(_id: ID, completedModules: ID): User
    login(email: String!, password: String!): Auth
    addFriend(_id:ID, friendId: ID!):User 
  }

`;

module.exports = typeDefs;
