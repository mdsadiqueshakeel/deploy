// income-service/src/utils/statusUpdater.js
const { getUserById, updateUserStatus } = require("../services/userService");
const { getWalletData } = require("../services/walletService");
const STATUS_TIERS = require("../constants/statusTier");

const checkAndUpgradeStatus = async (userId) => {
  try {
    // Get fresh user data
    const user = await getUserById(userId);
    if (!user) {
      console.log(`❌ User not found: ${userId}`);
      return null;
    }

    // Get wallet data
    const wallet = await getWalletData(userId);
    const totalTopup = wallet?.totalTopup || 0;
    const currentStatus = user.status;

    console.log(`🔍 Checking ${user.name} (${currentStatus}) | Topup: ₹${totalTopup}`);

    // Find current tier position
    const currentTierIndex = STATUS_TIERS.findIndex(t => t.name === currentStatus);
    if (currentTierIndex === -1) {
      console.log(`⚠️ Invalid current status: ${currentStatus}`);
      return null;
    }

    // Check only higher tiers
    for (let i = currentTierIndex + 1; i < STATUS_TIERS.length; i++) {
      const tier = STATUS_TIERS[i];
      console.log(`🧐 Checking ${tier.name} requirements...`);

      // Check topup requirement
      if (totalTopup < tier.requiredTopup) {
        console.log(`❌ Needs ₹${tier.requiredTopup} topup (has ₹${totalTopup})`);
        continue;
      }

      // Check children requirements if needed
      if (tier.requiredStatus && tier.requiredChildren > 0) {
        const level1 = user.levelTree?.find(level => level.level === 1);
        const children = await Promise.all(
          (level1?.users || []).map(id => getUserById(id))
        );

        const qualifiedChildren = children.filter(
          c => c?.status === tier.requiredStatus
        ).length;

        console.log(`👥 Needs ${tier.requiredChildren} ${tier.requiredStatus} children (has ${qualifiedChildren})`);

        if (qualifiedChildren < tier.requiredChildren) {
          continue;
        }
      }

      // All requirements met - perform upgrade
      console.log(`🚀 Attempting to upgrade ${user.name} to ${tier.name}`);
      try {
        const response = await updateUserStatus({ 
          userId: userId,
          status: tier.name
        });

        if (!response.success) {
          console.log(`⚠️ Upgrade failed: ${response.error}`);
          return currentStatus;
        }

        if (response.changed) {
          console.log(`🎉 Successfully upgraded to ${tier.name}`);
          return tier.name;
        } else {
          console.log(`ℹ️ Already at ${tier.name} status`);
          return tier.name;
        }
      } catch (error) {
        console.log(`⚠️ Upgrade API error:`, error.message);
        return currentStatus;
      }
    }

    console.log(`✅ ${user.name} remains ${currentStatus}`);
    return currentStatus;
  } catch (error) {
    console.error(`🔥 Status upgrade error:`, error);
    throw error;
  }
};


const getLevelDepthByStatus = (status) => {
  const tier = STATUS_TIERS.find((t) => t.name === status);
  return tier?.levelDepth || 0;
};

module.exports = { checkAndUpgradeStatus, getLevelDepthByStatus };