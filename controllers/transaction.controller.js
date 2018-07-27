let express = require('express');
let router = express.Router();
let databaseController = require('./database.controller');
let PaystackTransfer = require('paystack-transfer')('sk_test_e66c2632e32e419cabaa01d0f749ce5ac2221e06');
let User = databaseController.User;
let Bank = databaseController.Bank;
let Spending =  require('../models/spending');


router.post('/add-spending', (req, res) => {
    let name = req.body.name;
    let amount = req.body.amount;
    let cycle = req.body.cycle;
    let status = req.body.status;
    let bank_name = req.body.bank_name;
    let account_number = req.body.status;



});