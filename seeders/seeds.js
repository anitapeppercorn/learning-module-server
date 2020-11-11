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
    const moduleNumber = `${i}`;
    const moduleTitle = faker.commerce.productName();
    const moduleOverview = faker.lorem.words(Math.round(Math.random() * 20) + 1);
    const moduleReleaseDate = faker.date.past();
    const modulePoster = faker.image.imageUrl();
    const moduleCategory = `Category${(Math.round(i * 0.2) + 1)}`;
    const moduleVideo = faker.image.imageUrl();
    // store the modules
    moduleData.push({ moduleNumber, moduleTitle, moduleOverview, moduleReleaseDate, modulePoster, moduleCategory, moduleVideo });
  }
  const createdModules = await Module.collection.insertMany(moduleData);

  // create section data
  const sectionData = [];
  for (let i = 0; i < 120; i += 1) {
    const sectionNumber = `${i}`;
    const sectionTitle = faker.commerce.productName();
    const sectionOverview = faker.lorem.words(Math.round(Math.random() * 20) + 1);
    // store the section
    sectionData.push({ sectionNumber, sectionTitle, sectionOverview });
     //assign section to a module
    const randomModuleIndex = Math.floor(Math.random() * createdModules.ops.length);
    const { moduleNumber, _id: moduleId } = createdModules.ops[randomModuleIndex];
    const updatedModule = await Module.updateOne(
    { _id: moduleId },
    { $push: { moduleSection: sectionData._id } }
  );
  }
  const createdSections = await Section.collection.insertMany(sectionData);



  console.log('all done!');
  process.exit(0);
});