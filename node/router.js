const express = require('express');
const router = express.Router();
let totalRooms = 0;

router.put('/roomId', (req, res) => {
  totalRooms += 1;
  res.json({totalRooms});
});

router.get('/roomId', (req, res) => {
  res.json({totalRooms});
});

router.delete('/room/:Id', (req, res) => {

});

module.exports = router;