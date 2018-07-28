const express = require('express');
const router = express.Router();
const databaseController = require('../controllers/database.controller');
const User = databaseController.User;
/* GET users listing. */
router.post('/get-user', function(req, res, next) {
    let user_id = req.body.user_id;
    User.findOne({_id: user_id})
        .populate('spendings')
        .populate('savings')
        .exec((err, user) => {
        if(err) return returnError(res);
        if(user){
            return res.json({status: 'success', body: user});
        }
    });
});

module.exports = router;
