let mongoose = require('mongoose');
let Schema = mongoose.Schema;
let bcrypt = require('bcrypt');
let devEnv = require('../configs/dev.env.config');
let dbUrl;
if(devEnv) {
    console.log('DEVELOPMENT ENVIRONMENT for database');
    dbUrl = "mongodb://localhost:27017/spave"; //local Mongo server
}
else {
    console.log('PRODUCTION ENVIRONMENT for database');
    dbUrl = `mongodb://hashcode:lekkysonra@ds235388.mlab.com:35388/etickett`;
}
mongoose.connect(dbUrl, {autoIndex: true})
    .catch(reason=> {
        console.log("Reason for rejection"+reason);
    })
    .then(value=> {
        console.log("Onfuffilled "+value);
    });

let BankSchema = new Schema({
    account_number: {
        type: String,
        required: true
    },
    recipient_code: {
        type: String,
        required: true,
    },
    bank_code: String,
    bank_long_code: String,
    bank_name: String
});

let UserSchema = new Schema({
    username: {
        type: String,
        unique: true,
        required: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        unique: true,
        required: true,
        trim: true
    },
    first_name: String,
    last_name: String,
    bank: { type: Schema.Types.ObjectId, ref: 'Bank',},
    city: String,
    spendings: [{type: Schema.Types.ObjectId, ref: 'Spending'}],
    savings: [{type: Schema.Types.ObjectId, ref: 'Saving'}]
});


UserSchema.methods.validatePassword = (password)=> {
    return bcrypt.compare(password, this.password);
};


let UserLogin = mongoose.model('User', UserSchema);
let Bank = mongoose.model('Bank', BankSchema);

let userExists = (username, callback) => {
    UserLogin.findOne({username: username.toString().trim()}, (err, user) => {
        callback(err, user);
    });
};

let saveUser = (user, callback) => {
    let newUser;
    if (user !== null) {
        bcrypt.hash(user.password, 10, (err, hash) => {
            if (err) throw err;
            user.password = hash;
            newUser = new UserLogin({
                username: user.username,
                password: user.password,
                email: user.email,
                first_name: user.first_name,
                last_name: user.last_name,
                about: '',
                bank: user.bank,
            });
            newUser.save((err1) => {
                if (err1) {
                    throw err1;
                }
                console.log('User created');
                callback(newUser);
            });
        });

    }
};

let findEmail = (email, callback) => {
    UserLogin.findOne({email: email.toString().trim()}, (err, user) => {
        if (err) throw err;
        callback(user);
    });
};


module.exports.userExists = userExists;
module.exports.saveNewUser = saveUser;
module.exports.findEmail = findEmail;
module.exports.User = UserLogin;
module.exports.Bank = Bank;
