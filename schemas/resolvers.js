const { AuthenticationErro } = require('apollo-server-express');
const { User, Category, Image, Lesson, Module, Paragraph, Section, Video} = require('../models');
const { signToken } = require('../utils/auth');


const resolvers = {
  Query: {
    categories: async () => {
      return await Category.find();
    },
    modules: async (parent, { moduleCategory, moduleTitle, moduleSection, moduleVideo }) => {
      const params = {};

      if (moduleCategory) {
        params.moduleCategory = moduleCategory;
      }

      if (moduleSection) {
        params.moduleSection = moduleSection;
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
      .populate('moduleSection')
      .populate('moduleVideo')
      ;
    },
    module: async (parent, { _id }) => {
      return await Module.findById(_id)
      .populate('moduleCategory')
      .populate('moduleSection')
      .populate('moduleVideo');
    },
    sections: async (parent, { sectionLesson, sectionTitle, }) => {
      const params = {};

  
      if (sectionLesson) {
        params.sectionLesson = sectionLesson;
      }

      if(sectionTitle) {
        params.sectionTitle = {
          $regex: sectionTitle
        };
      }

      return await Section.find(params)
      .populate('sectionLesson')
      ;
    },
    section: async (parent, { _id }) => {
      return await Section.findById(_id).populate('sectionLesson');
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
          populate: 'moduleSection',
          populate: 'friends'
        })
        .populate({
          path: 'completedModules',
          populate: 'moduleSection'
        });

        return user;
      }
    },
  }
}

module.exports = resolvers;