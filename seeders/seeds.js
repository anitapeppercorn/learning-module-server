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

db.once('open', async () => {
  await User.deleteMany({});
  await Module.deleteMany({});
  await Lesson.deleteMany({});
  await Section.deleteMany({}); 
  await Paragraph.deleteMany({});
  await Image.deleteMany({});
  await Video.deleteMany({});


  // create Users
  const userData = [];
  for (let i = 1; i < 4; i++) {
    const username = `user${i}`;
    const email = `${username}@gmail.com`;
    const password = await bcrypt.hash("password", 10);  // saltRounds = 10 in User.js
    //const friends = x; //assign random users as friends;
    //const completedModules = x; //assign random Modules as completed
    userData.push({ username, email, password});
  }
  const createdUsers = await User.collection.insertMany(userData);
  
  // create Modules
  const moduleData = [];
  for (let i = 0; i < 24; i += 1) {
    const moduleNumber = `${i}`;
    const moduleTitle = faker.commerce.productName();
    const moduleOverview = faker.lorem.words(Math.round(Math.random() * 20) + 1);
    const moduleReleaseDate = faker.date.past();
    const moduleCategory = `Category${(Math.round(i * 0.2) + 1)}`;
    const modulePoster = faker.image.imageUrl();
    // const moduleVideo = await createdVideos.insertedIds[`${i}`]; // ANITA - this works, but will need updating when we have mutliple Videos
    //const moduleLesson = await createdLessons.insertedIds[`${i}`]; // ANITA This needs updating for mutliple Sections
    // store the modules
    moduleData.push({ moduleNumber, moduleTitle, moduleOverview, moduleReleaseDate, moduleCategory, modulePoster });
  }
  const createdModules = await Module.collection.insertMany(moduleData);

  // create Lessons
  const lessonData = [];
  for (let i = 0; i < 50; i += 1) {
    const lessonNumber = `${i}`;
    const lessonTitle = faker.commerce.productName();
    const lessonOverview = faker.lorem.words(Math.round(Math.random() * 20) + 1);
    const lessonReleaseDate = faker.date.past();
    const lessonTime = `Time needed ${(Math.round(i * 0.4) + 1)} minutes`;; //assign random completion time 'string' in minutes to this lesson
    // store the lesson
    lessonData.push({ lessonNumber, lessonTitle, lessonOverview, lessonReleaseDate, lessonTime });
    }
  const createdLessons = await Lesson.collection.insertMany(lessonData);

   // create Sections 
   const sectionData = [];
   for (let i = 0; i < 50; i += 1) {
     const sectionNumber = `${i}`;
     const sectionTitle = faker.commerce.productName();
     const sectionOverview = faker.lorem.words(Math.round(Math.random() * 20) + 1);
     //const sectionParagraph = x; //assign random or certain unique 6 paragraphs as an array to this section;
     //store the section object
     sectionData.push({ sectionNumber, sectionTitle, sectionOverview });
   };
   //seed the section object array
   const createdSections = await Section.collection.insertMany(sectionData);

    function getRandomInt(max) {
      return Math.floor(Math.random() * Math.floor(max));
    };

    // create Paragraph
    const paragraphData = [];
    for(let i = 0; i <50; i +=1) {
      const paragraphRef = `${getRandomInt(50)}`;
      const paragraphNumber = `${i}`;
      const paragraphContent = faker.lorem.words(Math.round(Math.random() * 100) + 1);
      const paragraphReleaseDate = faker.date.past();
      //const paragraphImage = x;//randomly assigned image ID. can be array of 0, 1 or 2
      //const paragraphVideo = x;//randomly assigned video ID
      //store the paragraph object
      paragraphData.push({ paragraphRef, paragraphNumber, paragraphContent, paragraphReleaseDate });
    }
    //seed the paragraph object array
    const createdParagraphs = await Paragraph.collection.insertMany(paragraphData);
    //console.log(createdParagraphs.ops[]);

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
    for(let i = 0; i < 24; i +=1 ) {
      const videoNumber = `${i}`;
      const videoTitle = faker.commerce.productName();
      const videoContent = faker.image.imageUrl();
      const videoOverview = faker.lorem.words(Math.round(Math.random() * 20) + 1);
      const videoReleaseDate = faker.date.past();
      //store the video object
      videoData.push({ videoNumber, videoTitle, videoOverview, videoContent, videoReleaseDate });
    }
    //seed the video object array
    const createdVideos = await Video.collection.insertMany(videoData);

    // create Section associated with Lesson
    // repeat similar code to create associations for 1) Lessons associated with Modules, 
    //2) Paragraphs associated with Sections, 
    //3) Images, 4) Videos etc
    //4) random users as friends;
    //5) random Modules as completedModules
    for (let i = 0; i < 100; i += 1) {
      const randomLessonIndex = Math.floor(Math.random() * createdLessons.ops.length);
      const { _id: lessonId } = createdLessons.ops[randomLessonIndex];// get lesson ID
      let sectionId;
      for (let i =0; i < (Math.floor(Math.random() * 10)); i += 1) {
        const randomSectionIndex = Math.floor(Math.random() * createdSections.ops.length);
        sectionId = createdSections.ops[randomSectionIndex];// get Section ID
      }
      // add the section to Lesson.lessonSection
      await Lesson.updateOne({ _id: lessonId }, { $addToSet: { lessonSection: sectionId } });
    }

    // Add Lessons to Modules
    for (let i = 0; i < 100; i += 1) {
      const randomModuleIndex = Math.floor(Math.random() * createdModules.ops.length);
      const { _id: moduleId } = createdModules.ops[randomModuleIndex];// get module ID
      let lessonId;
      for (let i =0; i < (Math.floor(Math.random() * 10)); i += 1) {
        const randomLessonIndex = Math.floor(Math.random() * createdLessons.ops.length);
        lessonId = createdLessons.ops[randomLessonIndex];// get Section ID
      }
      // add the lesson to Module.moduleSection
      await Module.updateOne({ _id: moduleId }, { $addToSet: { moduleLesson: lessonId } });
    }

    // adding paragraphs to sections
    
    for (let i = 0; i < 50; i += 1) {
      const { _id: sectionId }  = createdSections.ops[i];// get module ID
      let paragraphId;
      for (let i =0; i < 10; i += 1) {
        paragraphId = createdParagraphs.ops[i];// get Section ID
        await Section.updateOne({ _id: sectionId }, { $addToSet: { sectionParagraph: paragraphId } });
      } 
      };

    ////////////// End creating faker data
  console.log('all done!');
  process.exit(0);
});