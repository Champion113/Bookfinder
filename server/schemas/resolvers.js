const { AuthenticationError } = require('apollo-server-express');
const { User } = require("../models");
const auth = require('../utils/auth');
const { signToken } = require('../utils/auth');

const resolvers = {
    Query: {
        me: async (parent, args, context) => {
            if (context.user) {
                const userData = await (await User.findOne({ _id: context.user._id })).select("-_v -password")
                return userData;
            }
            throw new AuthenticationError('Not login')
        },
    },
    Mutation: {
        //execute the loginUser mutation set up using Apollo Server
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
        },
        //execute the addUser mutation   
        addUser: async (parent, args) => {
            const user = await User.create(args);
            const token = signToken(user);

            return { token, user };
        },
        //execute the saveBook mutation 
        saveBook: async (parent, { bookData }, context) => {
            const book = await Book.create(args);
            if (context.user) {
                const updatedUser = await User.findByIdAndUpdate(
                    { _id: context.user._id },
                    { $push: { savedBooks: bookData } },
                    { new: true }
                );
                return updatedUser;
            }
            throw new AuthenticationError("Must be login")

        },
        //execute the removeBook Mutation
        removeBook: async (parent, { bookId }, context) => {
            if (context.user) {
                const updatedUser = await User.findByIdAndUpdate(
                    { _id: context.user._id },
                    { $pull: { savedBooks: { bookId } } },
                    { new: true }
                );
                return updatedUser;
            }
            throw new AuthenticationError("Must be login")

        },




    },

};

module.exports = resolvers;