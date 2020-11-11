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

  // create Video
  const videoData = [];
  for(let i = 0; i < 24; i +=1 ) {
    const videoNumber = `${i}`;
    const videoTitle = faker.commerce.productName();
    const videoOverview = faker.lorem.words(Math.round(Math.random() * 20) + 1);
    const videoReleaseDate = faker.date.past();
    //store the video
    videoData.push({ videoNumber, videoTitle, videoOverview, videoReleaseDate });
  }
  const createdVideos = await Video.collection.insertMany(videoData);
 // console.log(createdVideos.insertedIds[''])

   // create section data
   const sectionData = [];
   for (let i = 0; i < 120; i += 1) {
     const sectionNumber = `${i}`;
     const sectionTitle = faker.commerce.productName();
     const sectionOverview = faker.lorem.words(Math.round(Math.random() * 20) + 1);
     const sectionReleaseDate = faker.date.past();
 
     sectionData.push({ sectionNumber, sectionTitle, sectionOverview, sectionReleaseDate });
 
   };
   const createdSections = await Section.collection.insertMany(sectionData);
  
  // create modules data
  const moduleData = [];
  for (let i = 0; i < 24; i += 1) {
    const moduleNumber = `${i}`;
    const moduleTitle = faker.commerce.productName();
    const moduleOverview = faker.lorem.words(Math.round(Math.random() * 20) + 1);
    const moduleReleaseDate = faker.date.past();
    const modulePoster = faker.image.imageUrl();
    const moduleCategory = `Category${(Math.round(i * 0.2) + 1)}`;
    const moduleVideo = await createdVideos.insertedIds[`${i}`]; // ANITA - this works, but will need updating when we have mutliple Videos
    const moduleSection = await createdSections.insertedIds[`${i}`]; // ANITA This needs updating for mutliple Sections
    // store the modules
    moduleData.push({ moduleNumber, moduleTitle, moduleOverview, moduleReleaseDate, modulePoster, moduleCategory, moduleVideo, moduleSection });
  }
  const createdModules = await Module.collection.insertMany(moduleData);

 
  
  // create section data
  const lessonData = [];
  for (let i = 0; i < 120; i += 1) {
    const lessonNumber = `${i}`;
    const lessonTitle = faker.commerce.productName();
    const lessonOverview = faker.lorem.words(Math.round(Math.random() * 20) + 1);
    const lessonReleaseDate = faker.date.past();
    // store the lesson
    lessonData.push({ lessonNumber, lessonTitle, lessonOverview, lessonReleaseDate });
      //assign lesson to a section
    const randomSectionIndex = Math.floor(Math.random() * createdSections.ops.length);
    const { sectionNumber, _id: sectionId } = createdSections.ops[randomSectionIndex];
    const updatedSection = await Section.updateOne(
    { _id: sectionId },
    { $push: { sectionLesson: lessonData._id } }
  )
  }
  const createdLessons = await Section.collection.insertMany(lessonData);

  // created linked moduleVideos

  console.log('all done!');
  process.exit(0);
});