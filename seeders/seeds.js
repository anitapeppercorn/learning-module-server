//generate dummy data
const bcrypt = require('bcrypt');
const faker = require('faker');
const db = require('../config/connection');
const { 
  User, 
  Category, 
  Module,
  Section, 
  Lesson,
  Paragraph,
  Image,
  Video
} = require('../models');

db.once('open', async () => {
  await User.deleteMany({});
  await Category.deleteMany({});
  await Module.deleteMany({});
  await Section.deleteMany({}); 
  await Lesson.deleteMany({});
  await Paragraph.deleteMany({});
  await Image.deleteMany({});
  await Video.deleteMany({});


  // create user data
  const userData = [];
  for (let i = 1; i < 4; i++) {
    const username = `user${i}`;
    const email = `${username}@gmail.com`;
    const password = await bcrypt.hash("password", 10)  // saltRounds = 10 in User.js
    userData.push({ username, email, password });
  }
  const createdUsers = await User.collection.insertMany(userData);

  // create modules data
  const moduleData = [];
  for (let i = 0; i < 24; i += 1) {
    const moduleNumber = faker.random.uuid();
    const moduleTitle = faker.commerce.title();
    const moduleOverview = faker.lorem.words(Math.round(Math.random() * 20) + 1);
    const moduleReleaseDate = faker.date.past();
    const modulePoster = faker.image.imageUrl();
    const moduleCategory = faker.commerce.department();
    const trailer = faker.image.imageUrl();
    // store the movies
    moduleData.push({ moduleNumber, moduleTitle, moduleOverview, moduleReleaseDate, modulePoster, moduleCategory,  });
  }
  const createdMovies = await Movie.collection.insertMany(movieData);

  // create friends
  for (let i = 0; i < 100; i += 1) {
    const randomUserIndex = Math.floor(Math.random() * createdUsers.ops.length);
    const { _id: userId } = createdUsers.ops[randomUserIndex];
    let friendId = userId;
    while (friendId === userId) {
      const randomUserIndex = Math.floor(Math.random() * createdUsers.ops.length);
      friendId = createdUsers.ops[randomUserIndex];
    }
    // add the friend to User.friends
    await User.updateOne({ _id: userId }, { $addToSet: { friends: friendId } });
  }
  // create likedMovies
  for (let i = 0; i < 100; i += 1) {
    const randomUserIndex = Math.floor(Math.random() * createdUsers.ops.length);
    const { _id: userId } = createdUsers.ops[randomUserIndex];
    let movieId;
    for (let i =0; i < (Math.floor(Math.random() * 10)); i += 1) {
      const randomMovieIndex = Math.floor(Math.random() * createdMovies.ops.length);
      movieId = createdMovies.ops[randomMovieIndex];
    }
    // add the movie to User.likedMovies
    await User.updateOne({ _id: userId }, { $addToSet: { likedMovies: movieId } });
    // add the user to Movie.likedUsers
    await Movie.updateOne({ _id: movieId }, { $addToSet: { likedUsers: userId } });
  }

  // create dislikedMovies
  for (let i = 0; i < 100; i += 1) {
    const randomUserIndex = Math.floor(Math.random() * createdUsers.ops.length);
    const { _id: userId } = createdUsers.ops[randomUserIndex];
    let movieId;
    for (let i =0; i < (Math.floor(Math.random() * 10)); i += 1) {
      const randomMovieIndex = Math.floor(Math.random() * createdMovies.ops.length);
      movieId = createdMovies.ops[randomMovieIndex];
    }
    // add the movie to User.dislikedMovies
    await User.updateOne({ _id: userId }, { $addToSet: { dislikedMovies: movieId } });
    // add the user to Movie.dislikedUsers
    await Movie.updateOne({ _id: movieId }, { $addToSet: { dislikedUsers: userId } });
  }

  console.log('all done!');
  process.exit(0);
});