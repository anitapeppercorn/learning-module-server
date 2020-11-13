const { AuthenticationErro } = require('apollo-server-express');
const { User, Category, Image, Lesson, Module, Paragraph, Section, Video} = require('../models');
const { signToken } = require('../utils/auth');


const resolvers = {
  Query: {
    categories: async () => {
      return await Category.find();
    },
    modules: async (parent, { moduleCategory, moduleTitle, moduleLesson, moduleVideo }) => {
      const params = {};

      if (moduleCategory) {
        params.moduleCategory = moduleCategory;
      }

      if (moduleLesson) {
        params.moduleLesson = moduleLesson;
      }

      if (moduleVideo) {
        params.moduleVideo = moduleVideo;
      }

      if(moduleTitle) {
        params.moduleTitle = {
          $regex: moduleTitle
        };
      }

      return await Module.find(params)
      .populate('moduleCategory')
      .populate('moduleLesson')
      .populate('moduleVideo')
      ;
    },
    module: async (parent, { _id }) => {
      return await Module.findById(_id)
      .populate('moduleCategory')
      .populate('moduleLesson')
      .populate('moduleVideo');
    },
    lessons: async (parent, { lessonSection, lessonTitle, }) => {
      const params = {};

  
      if (lessonSection) {
        params.lessonSection = lessonSection;
      }

      if(lessonTitle) {
        params.lessonTitle = {
          $regex: lessonTitle
        };
      }

      return await Section.find(params)
      .populate('lessonSection')
      ;
    },
    lesson: async (parent, { _id }) => {
      return await Section.findById(_id).populate('lessonSection');
    },
    paragraphs: async (parent, { paragraphRef, paragraphVideo }) => {
      const params = {};

      if(paragraphRef) {
        params.paragraphRef = {
          $regex: paragraphRef
        };
      }

      if (paragraphVideo) {
        params.paragraphVideo = paragraphVideo
      }

      return await Paragraph.find(params)
      .populate('paragraphVideo')
    },
    user: async (parent, args, context) => {
      if (context.user) {
        const user = await User.findById(context.user._id)
        .populate({
          path: 'friends',
          populate: 'moduleLesson',
          populate: 'friends'
        })
        .populate({
          path: 'completedModules',
          populate: 'moduleLesson'
        });

        return user;
      }
    },
  }
}

module.exports = resolvers;