let express = require('express');
let router = express.Router();
let databaseController = require('./database.controller');
let PaystackTransfer = require('paystack-transfer')('sk_test_e66c2632e32e419cabaa01d0f749ce5ac2221e06');
let User = databaseController.User;
let Bank = databaseController.Bank;
const Spending =  require('../models/spending');
const Saving =  require('../models/saving');


const returnError = (res)=> {
    return res.json({status: 'error'});
};

const returnSuccess = (res)=> {
    return res.json({status: 'success'});
};


router.post('/add-spending', (req, res) => {
    let name = req.body.name;
    let amount = req.body.amount;
    let cycle = req.body.cycle;
    let status = req.body.status;
    let bank_name = req.body.bank_name;
    let account_number = req.body.status;
    let user_id = req.body.user_id;

    User.findOne({_id: user_id}, (err, user) => {
        if(err) return returnError(res);
        if(user){
            const spnd = {
                name: name,
                amount: amount,
                cycle: cycle,
                status: status,
                bank_name: bank_name,
                account_number: account_number,
                user_id: user_id
            };
            Spending.create(spnd, (err1, savedSpnd) => {
                if(err1) return returnError(res);
                if(savedSpnd) {
                    if(!user.spendings) user.spendings = [];
                    user.spendings.push(savedSpnd._id);
                    user.save((err2, upUser) => {
                        if(err2) returnError(res);
                        return returnSuccess(res);
                    })
                }
            })
        }
    })
});

router.post('/get-spendings', (req, res) => {
    let user_id =  req.body.user_id;
    User.findOne({_id: user_id})
        .populate('spendings')
        .exec((err, user) => {
        if(err) return returnError(res);
        if(user){
            return res.json({'status': 'success', 'body': user.spendings});
        }
        else {
            return returnError(res);
        }
    })
});

router.post('/add-saving', (req, res) => {
    let name = req.body.name;
    let amount = req.body.amount;
    let cycle = req.body.cycle;
    let status = req.body.status;
    let user_id = req.body.user_id;

    User.findOne({_id: user_id}, (err, user) => {
        if(err) return returnError(res);
        if(user){
            const spnd = {
                name: name,
                total_amount: amount,
                cycle: cycle,
                status: status,
                amount_saved: 0,
                user_id: user_id
            };
            Saving.create(spnd, (err1, savedSvn) => {
                if(err1) return returnError(res);
                if(savedSvn) {
                    if(!user.savings) user.savings = [];
                    user.savings.push(savedSvn._id);
                    user.save((err2, upUser) => {
                        if(err2) returnError(res);
                        return returnSuccess(res);
                    })
                }
            })
        }
    })
});

router.post('/get-savings', (req, res) => {
    let user_id =  req.body.user_id;
    User.findOne({_id: user_id})
        .populate('savings')
        .exec((err, user) => {
        if(err) return returnError(res);
        if(user){
            return res.json({'status': 'success', 'body': user.savings});
        }
        else {
            return returnError(res);
        }
    })
});

module.exports = router;