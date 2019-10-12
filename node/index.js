const express = require('express');
const router = express.Router();

router.get('/xx', (req, res) => {
  res.send('xx354');
});

module.exports = router;