// income-service/src/routes/testRoutes.js
const express = require('express');
const router = express.Router();
const { resetAllCarryMatchedToday } = require('../utils/resetCarryForNewDay');

router.get('/test-reset-cap', async (req, res) => {
  try {
    await resetAllCarryMatchedToday(); // manually run the function
    res.status(200).json({ message: 'Cron test executed!' });
  } catch (err) {
        res.status(500).json({ error: err.message });
    }
    });

    module.exports = router;
