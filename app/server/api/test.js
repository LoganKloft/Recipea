const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth')

router.get('/', (req, res, next) => {
    res.json({msg:"You have accessed a free endpoint"})
})

router.post('/', authMiddleware, (_0, res, _1) => {
    res.json({msg:"You have accessed a restricted endpoint"})
})

module.exports = router