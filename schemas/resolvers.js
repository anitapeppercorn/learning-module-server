const { AuthenticationError } = require('apollo-server-express');
const { User, Module, Category, Image, Lesson, Paragraph, Progress, Section, Video } = require('../models');
const { signToken } = require('../utils/auth');

const resolvers = {
  Query: {
    categories: async () => {
      return await Category.find();
    },
    modules: async (parent, { category, name }) => {
      const params = {};

      if (category) {
        params.category = category;
      }

      if (name) {
        params.name = {
          $regex: name
        };
      }

      return await Module.find(params).populate('category');
    },
    module: async (parent, { _id }) => {
      return await Module.findById(_id).populate('category');
    },
    user: async (parent, args, context) => {
      if (context.user) {
        const user = await User.findById(context.user._id).populate({
          path: 'completedModules.modules',
          populate: 'category'
        });

        user.completedModules.sort((a, b) => b.purchaseDate - a.purchaseDate);

        return user;
      }

      throw new AuthenticationError('Not logged in');
    },
    completed: async (parent, { _id }, context) => {
      if (context.user) {
        const user = await User.findById(context.user._id).populate({
          path: 'completedModules.modules',
          populate: 'category'
        });

        return user.completedModules.id(_id);
      }

      throw new AuthenticationError('Not logged in');
    },
    checkout: async (parent, args, context) => {
      const url = new URL(context.headers.referer).origin;
      const completed = new Order({ modules: args.modules });
      const { modules } = await completed.populate('modules').execPopulate();

      const line_items = [];

      for (let i = 0; i <modules.length; i++) {
        // generate module id
        const module = await stripe.modules.create({
          name: modules[i].name,
          description: modules[i].description,
          images: [`${url}/images/${modules[i].image}`]
        });

        // generate price id using the module id
        const price = await stripe.prices.create({
          module: module.id,
          unit_amount: modules[i].price * 100,
          currency: 'usd'
        });

        // add prive id to the line items array
        line_items.push({
          price: price.id,
          quantity: 1
        });
      };

      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items,
        mode: 'payment',
        success_url: `${url}/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${url}/`
      });
    return { session: session.id };
    }
  },
  Mutation: {
    addUser: async (parent, args) => {
      const user = await User.create(args);
      const token = signToken(user);

      return { token, user };
    },
    addOrder: async (parent, { modules }, context) => {
      console.log(context);
      if (context.user) {
        const completed = new Order({ modules });

        await User.findByIdAndUpdate(context.user._id, { $push: { completedModules: completed } });

        return completed;
      }

      throw new AuthenticationError('Not logged in');
    },
    updateUser: async (parent, args, context) => {
      if (context.user) {
        return await User.findByIdAndUpdate(context.user._id, args, { new: true });
      }

      throw new AuthenticationError('Not logged in');
    },
    updateModule: async (parent, { _id, quantity }) => {
      const decrement = Math.abs(quantity) * -1;

      return await Module.findByIdAndUpdate(_id, { $inc: { quantity: decrement } }, { new: true });
    },
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
};

module.exports = resolvers;
