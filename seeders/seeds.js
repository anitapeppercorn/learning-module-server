//generate dummy data
const bcrypt = require('bcrypt');
const faker = require('faker');
const db = require('../config/connection');
const { 
  User, 
  Module,
  Lesson,
  Section, 
  Paragraph,
  Image,
  Video
} = require('../models');
const { updateMany } = require('../models/User');

db.once('open', async () => {
  await User.deleteMany({});
  await Module.deleteMany({});
  await Lesson.deleteMany({});
  await Section.deleteMany({}); 
  await Paragraph.deleteMany({});
  await Image.deleteMany({});
  await Video.deleteMany({});

// assume 4 users
// assume 24 modules
// assume 6 lessons per module = 144
// assume 6 sections per lesson = 864 total sections
// assume 6 paragraphs per section = 5184 paragraphs
// assume images and videos to paragraph are randomly assigned
// added zoom recordings assigned to modules
// assume friends and completed modules to users are randomly assigned


  // create 4 Users
  const userData = [];
  for (let i = 1; i < 5; i++) {
    const username = `user${i}`;
    const email = `${username}@gmail.com`;
    const password = await bcrypt.hash("password", 10);  // saltRounds = 10 in User.js
    userData.push({ username, email, password});
  }
  const createdUsers = await User.collection.insertMany(userData);

  // create 24 Modules
  const moduleData = [];
  for (let i = 1; i < 25; i += 1) {
    const moduleNumber = `${i}`;
    const moduleTitle = faker.commerce.productName();
    const moduleOverview = faker.lorem.words(Math.round(Math.random() * 20) + 1);
    const moduleReleaseDate = faker.date.past();
    const moduleCategory = `Category${(Math.round(i * 0.2) + 1)}`;
    const modulePoster = faker.image.imageUrl();
    // store the modules
    moduleData.push({ moduleNumber, moduleTitle, moduleOverview, moduleReleaseDate, moduleCategory, modulePoster });
  }
  const createdModules = await Module.collection.insertMany(moduleData);

  // create 144 Lessons
  const lessonData = [];
  for (let i = 1; i < 145; i += 1) {
    const lessonNumber = `${i}`;
    const lessonTitle = faker.commerce.productName();
    const lessonOverview = faker.lorem.words(Math.round(Math.random() * 20) + 1);
    const lessonReleaseDate = faker.date.past();
    const lessonTime = `Time needed ${(Math.round(i * 0.4) + 1)} minutes`;; //assign random completion time 'string' in minutes to this lesson
    // store the lesson
    lessonData.push({ lessonNumber, lessonTitle, lessonOverview, lessonReleaseDate, lessonTime });
  }
  const createdLessons = await Lesson.collection.insertMany(lessonData);

  // create 864 Sections 
  const sectionData = [];
  for (let i = 1; i < 865; i += 1) {
    const sectionNumber = `${i}`;
    const sectionTitle = faker.commerce.productName();
    const sectionOverview = faker.lorem.words(Math.round(Math.random() * 20) + 1);
    //store the section object
    sectionData.push({ sectionNumber, sectionTitle, sectionOverview });
  };
  //seed the section object array
  const createdSections = await Section.collection.insertMany(sectionData);

    function getRandomInt(max) {
      return Math.floor(Math.random() * Math.floor(max));
    };

  // create 5184 Paragraphs
  const paragraphData = [];
  for(let i = 1; i <5185; i +=1) {
    const paragraphRef = `${getRandomInt(50)}`;
    const paragraphNumber = `${i}`;
    const paragraphContent = faker.lorem.words(Math.round(Math.random() * 100) + 1);
    const paragraphReleaseDate = faker.date.past();
      //store the paragraph object
    paragraphData.push({ paragraphRef, paragraphNumber, paragraphContent, paragraphReleaseDate });
  }
  //seed the paragraph object array
  const createdParagraphs = await Paragraph.collection.insertMany(paragraphData);

  // create Image
  const imageData = [];
  for(let i = 0; i < 24; i +=1 ) {
    const imageNumber = `${i}`;
    const imageTitle = faker.commerce.productName();
    const imageContent = faker.image.imageUrl();
    const imageOverview = faker.lorem.words(Math.round(Math.random() * 20) + 1);
    const imageReleaseDate = faker.date.past();
      //store the image object
    imageData.push({ imageNumber, imageTitle, imageOverview, imageContent, imageReleaseDate });
  }
  //seed the image object array
  const createdImages = await Image.collection.insertMany(imageData);

  // create Video
  const videoData = [];
  for(let i = 1; i < 50; i +=1 ) {
    const videoNumber = `${i}`;
    const videoTitle = faker.commerce.productName();
    const videoOverview = faker.lorem.words(Math.round(Math.random() * 20) + 1);
    const videoReleaseDate = faker.date.past();
    const videoContent = faker.image.imageUrl();
      //store the video object
    videoData.push({ videoNumber, videoTitle, videoOverview, videoContent, videoReleaseDate });
  }
  //seed the video object array
  const createdVideos = await Video.collection.insertMany(videoData);

////////////Creating Associations Between Collections
////*********************************************////

// Assign friends to users randomly:
  for (let i = 1; i < 5; i += 1) {
    const randomUserIndex = Math.floor(Math.random() * createdUsers.ops.length);
    const { _id: userId } = createdUsers.ops[randomUserIndex];// get USER ID
    let friendId=[];
    for (let i =1; i < (Math.floor(Math.random() * 4)); i += 1) {
      const randomFriendIndex = Math.floor(Math.random() * createdUsers.ops.length);
      friendId = createdUsers.ops[randomFriendIndex];// get Friend ID
    }
  // add the friend to User.friends
  await User.updateOne({ _id: userId }, { $addToSet: { friends: friendId } });
  }

// Assign completedModules to users randomly:
  for (let i = 1; i < 5; i += 1) {
    const randomUserIndex = Math.floor(Math.random() * createdUsers.ops.length);
    const { _id: userId } = createdUsers.ops[randomUserIndex];// get USER ID
    let completedModuleId=[];
    for (let i =1; i < (Math.floor(Math.random() * 4)); i += 1) {
      const randomcompletedModuleIndex = Math.floor(Math.random() * createdModules.ops.length);
      completedModuleId = createdModules.ops[randomcompletedModuleIndex];// get completedModule ID
    }
   // add the completed Modules to User.completedModules
   await User.updateOne({ _id: userId }, { $addToSet: { completedModules: completedModuleId } });
  }

// Assign lessons to associated modules randomly && Assign recordings to modules:
  for (let i = 0; i < 23; i += 1) {
    const randomModuleIndex = Math.floor(Math.random() * createdModules.ops.length);
    const { _id: moduleId } = createdModules.ops[randomModuleIndex];// get module ID

    let lessonId=[];
    for (let i =1; i < 7; i += 1) {
      const randomLessonIndex = Math.floor(Math.random() * createdLessons.ops.length);
      lessonId = createdLessons.ops[randomLessonIndex];// get lesson IDs
    }
   
   // add the lessons to Module.moduleSection
   await Module.updateOne({ _id: moduleId }, { $addToSet: { moduleLesson: lessonId} });
  }

  // Assign recordings to associated modules:
  for (let i = 0; i < 48; i += 1) {
    const randomModuleIndex = Math.floor(Math.random() * createdModules.ops.length);
    const { _id: moduleId } = createdModules.ops[randomModuleIndex];// get module ID

    // adding recording to each module
    let recordingId=[];
    recordingId.push(createdVideos.ops[i]);
   
   // add the lessons to Module.moduleSection
   await Module.updateOne({ _id: moduleId }, { $addToSet: { moduleVideo: recordingId} });
  }

// Assign sections to associated lessons randomly: 
  for (let i = 1; i < 145; i += 1) {
    const randomLessonIndex = Math.floor(Math.random() * createdLessons.ops.length);
    const { _id: lessonId } = createdLessons.ops[randomLessonIndex];// get lesson ID
    let sectionId=[];
    for (let i =1; i < (Math.floor(Math.random() * 7)); i += 1) {
      const randomSectionIndex = Math.floor(Math.random() * createdSections.ops.length);
      sectionId = createdSections.ops[randomSectionIndex];// get Section ID
    }
   // add the section to Lesson.lessonSection
   await Lesson.updateOne({ _id: lessonId }, { $addToSet: { lessonSection: sectionId } });
  }

// Assign images to associated paragraph randomly: 
for (let i = 1; i < 5000; i += 1) {
  const randomParagraphIndex = Math.floor(Math.random() * createdParagraphs.ops.length);
  const { _id: paragraphId } = createdParagraphs.ops[randomParagraphIndex];// get Paragraph ID
  let imageId=[];
  for (let i =1; i < (Math.floor(Math.random() * 3)); i += 1) {
    const randomImageIndex = Math.floor(Math.random() * createdImages.ops.length);
    imageId = createdImages.ops[randomImageIndex];// get Image ID
  }
 // add the images to Paragraph.paragraphImage
 await Paragraph.updateOne({ _id: paragraphId }, { $addToSet: { paragraphImage: imageId } });
}  

// Assign videos to associated paragraph randomly: 
for (let i = 1; i < 5000; i += 1) {
  const randomParagraphIndex = Math.floor(Math.random() * createdParagraphs.ops.length);
  const { _id: paragraphId } = createdParagraphs.ops[randomParagraphIndex];// get Paragraph ID
  let videoId=[];
  for (let i =1; i < (Math.floor(Math.random() * 3)); i += 1) {
    const randomVideoIndex = Math.floor(Math.random() * createdVideos.ops.length);
    videoId = createdVideos.ops[randomVideoIndex];// get Video ID
  }
 // add the video to Paragraph.paragraphVideo
 await Paragraph.updateOne({ _id: paragraphId }, { $addToSet: { paragraphVideo: videoId } });
}

// Assign paragraphs to associated sections randomly: 
for (let i = 1; i < 865; i += 1) {
  const randomSectionIndex = Math.floor(Math.random() * createdSections.ops.length);
  const { _id: sectionId } = createdSections.ops[randomSectionIndex];// get Section ID
  let paragraphId=[];
  for (let i =1; i < 7; i += 1) {
    const randomParagraphIndex = Math.ceil(Math.random() * createdParagraphs.ops.length);
    paragraphId = createdParagraphs.ops[randomParagraphIndex];// get Paragraph ID
  }
 // add the section to Section.sectionParagraph
 await Section.updateOne({ _id: sectionId }, { $addToSet: { sectionParagraph: paragraphId } });
}  


////////////// End creating faker data
  console.log('all done!');
  process.exit(0);
});