let passport = require('passport');
let express = require('express');
let router = express.Router();
let databaseController = require('./database.controller');
let PaystackTransfer = require('paystack-transfer')('sk_test_e66c2632e32e419cabaa01d0f749ce5ac2221e06');
let User = databaseController.User;
let Bank = databaseController.Bank;
const LocalStrategy = require('passport-local').Strategy;

const { check, validationResult } = require('express-validator/check');
const { matchedData, sanitize } = require('express-validator/filter');

const bcrypt = require("bcrypt");

let app = express();

app.use(router);


passport.use(new LocalStrategy(
    (username, password, done) => {
        databaseController.userExists(username.toString().toLowerCase(), (exists) =>{
            if(exists){}
            else{
                return done(null, false);
            }
        })
    }
));


router.post('/signup', [

    check('username').exists().withMessage('Enter username').trim().isLength({min : 5}).withMessage("Minimum length for username is 5"),
    check('email').isEmail().withMessage('Enter a valid email').trim().normalizeEmail(),
    check('password').exists().withMessage('Enter a strong password').isLength({min : 5}).withMessage("Minimum length for password is 5"),
    check('first_name').exists().withMessage('Enter first name').trim().isLength({min : 3}).withMessage("Minimum length for first name is 3"),
    check('last_name').exists().withMessage('Enter last name').trim().isLength({min : 3}).withMessage("Minimum length for last name is 3"),
    check('account_number').exists().withMessage('Enter account number').trim().isLength({min : 10}).withMessage("Bank account must be 10 digits"),
    check('bank_name').exists().withMessage('Enter bank name')

], (req, res)=> {
    const errors = validationResult(req);
    let errorArray = [];
    let body = req.body;

    let allBanks;
    allBanks = Object.keys(PaystackTransfer.all_banks).map(key => PaystackTransfer.all_banks[key]);

    errors.array().forEach((err1)=> {
       errorArray.push(err1.msg)
    });
    if (!errors.isEmpty()) {
        return res.json({signUpErrors: errorArray, logInErrors: null, signUpBody: body, logInBody: null});
        // return res.status(200).json({ errors: errors.array() });
    }

    let username = body.username;
    let email = body.email;
    let password = body.password;
    let firstName = body.first_name;
    let lastName = body.last_name;

    let accountNumber = body.account_number;
    let bankType = body.bank_name.toString().replace(new RegExp('-', 'g'),'_');

    let userBank = PaystackTransfer.all_banks[bankType.toString()];


    databaseController.userExists(username, (user)=>{
        if(user !== null){
            return res.json({signUpErrors: ["Sorry, this username is already taken. Try another one"], logInErrors: ["You can now log in with your details"], signUpBody: body, logInBody: null});
        }
        databaseController.User.findOne({email: email}, (err32, userByEmail)=> {
            if(err32) throw err32;
            if(userByEmail){
                return res.json({signUpErrors: ["Sorry, this email is already in use by another user."], logInErrors: ["You can now log in with your details"], signUpBody: body, logInBody: null});
            }
            else {
                if(user === null){
                    PaystackTransfer.createRecipient((firstName + " "+lastName), username, accountNumber, userBank, {email: email})
                        .then(function(respbody){
                            console.log("Paystack recipient creation : "+ JSON.stringify(respbody));
                            if(respbody.message === 'Recipient already exists'){
                                return res.json({signUpErrors: ['This account number is already being used by another user'], logInErrors: null, signUpBody: body, logInBody: null});
                            }
                            else if(respbody.message === 'Account number is invalid'){
                                return res.json({signUpErrors: ['Your account detail is invalid'], logInErrors: null, signUpBody: body, logInBody: null});
                            }
                            else {
                                let bankDetails = {
                                    account_number: accountNumber,
                                    bank_code: userBank.code,
                                    bank_long_code: userBank.longcode,
                                    bank_name: userBank.name,
                                    recipient_code: respbody.data.recipient_code
                                };

                                Bank.create(bankDetails, (err, bank)=> {
                                   if(err) throw err;
                                   if(bank){
                                       let newUser = {
                                           username: username,
                                           password: password,
                                           first_name : firstName,
                                           last_name: lastName,
                                           email: email,
                                           bank: bank._id
                                       };

                                       databaseController.saveNewUser(newUser, (user)=>{
                                           return res.json({signUpErrors: null, logInErrors: ["You can now log in with your details"], signUpBody: null, logInBody: null});
                                       });
                                   }
                                });



                            }

                        }).catch(function(error){
                        console.log(error);
                        return res.json({signUpErrors: ["An error occured while creating your account"], logInErrors: null, signUpBody: body, logInBody: null});
                    });


                }
            }

        });

    })
});

router.post('/login', [
    check('username').exists().withMessage('Enter username').trim(),
    check('password').exists().withMessage('Enter a password')
], (req, res)=> {
    const errors = validationResult(req);
    let errorArray = [];
    errors.array().forEach((err1)=> {
        errorArray.push(err1.msg)
    });
    let body = req.body;
    let username = body.username;
    let password = body.password;

    if (!errors.isEmpty()) {
        return res.json({signUpErrors: null, logInErrors: errorArray, signUpBody: null, logInBody: body});
    }

    User.findOne({username: username.toString().trim()}, (err, user) => {
        if (err) {
            throw err;
        }
        if(!user) {
            return res.json({signUpErrors: null, logInErrors: ["User does not exist"], signUpBody: null, logInBody: body});
        }

        bcrypt.compare(password, user.password, (errrr, result) => {
            if (result) {
                req.session.username = user.username;
                req.session.userId = user._id;
                console.log("Saved id is " + req.session.id);
                return res.json({signUpErrors: null, logInErrors: ["correct"], signUpBody: null, logInBody: body});
            }
            else {
                return res.json({signUpErrors: null, logInErrors: ["Oops! Wrong password."], signUpBody: null, logInBody: body});
            }
        });

    });
});

router.get('/logout', (req, res, next)=> {
    if(req.session){
        req.session.destroy((err)=>{
            if(err){
                return next(err);
            }
            else res.redirect('/');
        });
    }
    else res.redirect('/');

});

module.exports = app;


