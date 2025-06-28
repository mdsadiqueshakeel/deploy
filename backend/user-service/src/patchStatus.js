// patchStatus.js
const mongoose = require("mongoose");
const User = require("./models/User");

mongoose.connect("mongodb+srv://mlmdevelopment001:NconnectionN@affilateproject.oilsuaa.mongodb.net/?retryWrites=true&w=majority&appName=AffilateProject");

(async () => {
  const users = await User.find({ status: { $exists: false } });

  for (const user of users) {
    user.status = null;
    user.statusUpdatedAt = null;
    await user.save();
    console.log(`🛠 Patched user: ${user.name}`);
  }

  console.log("✅ All users patched.");
  process.exit(0);
})();
