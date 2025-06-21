// income-service/src/utils/treeCount.js
const { getUserById } = require("../services/userService");

const countSubtreeUsers = async (userId) => {
  let count = 0;
  const user = await getUserById(userId);
  if (!user) return 0;

  // Left subtree
  if (user.leftUser) {
    count += 1 + (await countSubtreeUsers(user.leftUser));
  }

  // Right subtree
  if (user.rightUser) {
    count += 1 + (await countSubtreeUsers(user.rightUser));
  }

  return count;
};

module.exports = { countSubtreeUsers };
