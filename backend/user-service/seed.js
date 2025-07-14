const mongoose = require("mongoose");
const dotenv = require("dotenv");
const User = require("./src/models/User");
const { generateReferralCode } = require("./src/utils/referralUtils");

dotenv.config({ path: './.env' });

const seedUser = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB Connected...');

    // Check if a root user already exists to prevent duplicates
    const existingRootUser = await User.findOne({ isRootSponsor: true });
    if (existingRootUser) {
      console.log('Root user already exists. Skipping seeding.');
      mongoose.connection.close();
      return;
    }

    const password = 'test'; // You might want to hash this or make it dynamic

    const newUser = new User({
      name: 'sadique',
      email: 'tempsadique@gmail.com',
      password: password, // Mongoose pre-save hook will hash this
      referralCodeLeft: generateReferralCode(),
      referralCodeRight: generateReferralCode(),
      isRootSponsor: true,
    });

    await newUser.save();
    console.log(`${name} user seeded successfully!`);
    console.log('Left Referral Code:', newUser.referralCodeLeft);
    console.log('Right Referral Code:', newUser.referralCodeRight);

    mongoose.connection.close();
    console.log('MongoDB Disconnected.');
  } catch (error) {
    console.error('Error seeding user:', error);
    process.exit(1);
  }
};

seedUser();
