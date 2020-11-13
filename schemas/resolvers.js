const { AuthenticationError } = require('apollo-server-express');
const { User, Image, Lesson, Module, Paragraph, Section, Video} = require('../models');
const { populate } = require('../models/User');
const { signToken } = require('../utils/auth');


const resolvers = {
  Query: {
    // Modules
    modules: async (parent, {moduleTitle, moduleLesson, moduleVideo, lessonSection, sectionParagraph}) => {
      const params = {};

      if(sectionParagraph) {
        params.sectionParagraph = sectionParagraph;
      }

      if (moduleLesson) {
        params.moduleLesson = moduleLesson;
      }

      if (moduleVideo) {
        params.moduleVideo = moduleVideo;
      }

      if (lessonSection) {
        params.lessonSection = lessonSection;
      }

      if(moduleTitle) {
        params.moduleTitle = {
          $regex: moduleTitle
        };
      }

      return await Module.find(params)
      .populate('moduleLesson')
      .populate('moduleVideo')
      .populate({
        path: 'moduleLesson',
        populate: 'lessonSection',
      })
      .populate({
        path:'moduleLesson.lessonSection',
        populate:'sectionParagraph'
      })
      ;
    },
    module: async (parent, { _id }) => {
      return await Module.findById(_id)
  
      .populate('moduleLesson')
      .populate('moduleVideo');
    },
    // Lessons
    lessons: async (parent, { lessonSection, lessonTitle, sectionParagraph }) => {
      const params = {};

      if(sectionParagraph) {
        params.sectionParagraph = sectionParagraph;
      }

      if (lessonSection) {
        params.lessonSection = lessonSection;
      }

      if(lessonTitle) {
        params.lessonTitle = {
          $regex: lessonTitle
        };
      }

      return await Lesson.find().populate('lessonSection').populate({
        path:'lessonSection',
        populate:'sectionParagraph'
      });
    },
    lesson: async (parent, { _id }) => {
      return await Lesson.findById(_id).populate('lessonSection');
    },
    // Sections
    sections: async(parent, {sectionNumber, sectionTitle, sectionParagraph }) => {
      const params = {};

      if(sectionTitle) {
        params.sectionTitle = {
          $regex: sectionTitle
        };
      }

      if(sectionNumber){
        params.sectionNumber = sectionNumber
      }

      if(sectionParagraph) {
        params.sectionParagraph;
      }

      return await Section.find(params).populate('sectionParagraph').populate('sectionTitle').populate('sectionOverview');
    },
    section: async (parent, { _id }) => {
      return await Section.findById(_id).populate('sectionParagraph');
    },
    // Paragraphs
    paragraphs: async (parent, {paragraphImage, paragraphVideo }) => {
      const params = {};

      if (paragraphVideo) {
        params.paragraphVideo = paragraphVideo
      }
      if(paragraphImage) {
        params.paragraphImage = paragraphImage
      }

      return await Paragraph.find(params)
      .populate('paragraphImage')
      .populate('paragraphVideo');
    },
    paragraph: async (parent, { _id }) => {
      return await Paragraph.findById(_id)
      .populate('paragraphImage')
      .populate('paragraphVideo');
    },
    // User
    user: async (parent, args, context) => {
      if (context.user) {
        const user = await User.findById(context.user._id).populate('friends')
        .populate({
          path: 'friends',
          populate: 'completedModules',
          populate: 'friends'
        });

        return user;
      }
      throw new AuthenticationError('Not logged in');
    }

  },
  Mutation: {
    // User add and update
    addUser: async (parent, args) => {
      const user = await User.create(args);
      const token = signToken(user);

      return { token, user };
    },
    updateUser: async (parent, args, context) => {
      if (context.user) {
        return await User.findByIdAndUpdate(context.user._id, args, { new: true });
      }

      throw new AuthenticationError('Not logged in');
    },
    // Add completedModule
    updateModule: async (parent, { _id, completedModules }) => {
      // if (context.user) {
      //   const updatedUser = await User.findByIdAndUpdate(
      //       { _id: context.user._id },
      //       { $addToSet: {  completedModules: completedModules  } },
      //       { new: true }
      //   ).populate('friends')
      //   .populate('completedModules');
      return await User.findByIdAndUpdate(_id, { $addToSet: { completedModules: completedModules } }, { new: true });
      
    },
       // throw new AuthenticationError('You need to be logged in!');
    
    // Add Friend
    addFriend: async (parent, { _id ,friendId }) => {
      // if (context.user) {
      //     const updatedUser = await User.findByIdAndUpdate(
      //         { _id: context.user._id },
      //         { $addToSet: { friends: friendId } },
      //         { new: true }
      //     ).populate('friends')
      //     .populate('completedModules');

      return await User.findByIdAndUpdate(_id, { $addToSet: { friendId: friendId } }, { new: true });
     // }

      // throw new AuthenticationError('You need to be logged in!');
  },
    // Login
    login: async (parent, { email, password }) => {
      const user = await User.findOne({ email });

      if (!user) {
        throw new AuthenticationError('Incorrect credentials');
      }

      const correctPw = await user.isCorrectPassword(password);

      if (!correctPw) {
        throw new AuthenticationError('Incorrect credentials');
      }

      const token = signToken(user);

      return { token, user };
    }
}
}

module.exports = resolvers;