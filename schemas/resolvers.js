const { AuthenticationError } = require('apollo-server-express');
const { User, Image, Lesson, Module, Paragraph, Section, Video} = require('../models');
const { signToken } = require('../utils/auth');


const resolvers = {
  Query: {
    
    modules: async (parent, {moduleTitle, moduleLesson, moduleVideo }) => {
      const params = {};

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
  
      .populate('moduleLesson')
      .populate('moduleVideo')
      ;
    },
    module: async (parent, { _id }) => {
      return await Module.findById(_id)
  
      .populate('moduleLesson')
      .populate('moduleVideo');
    },
    lessons: async (parent, { lessonSection, lessonTitle }) => {
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
      return await Lesson.findById(_id).populate('lessonSection');
    },
    sections: async(parent, { sectionTitle, sectionParagraph }) => {
      const params = {};

      if(sectionTitle) {
        params.sectionTitle = sectionTitle;
      }

      if(sectionParagraph) {
        params.sectionParagraph;
      }

      return await Section.find(params);
    },
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