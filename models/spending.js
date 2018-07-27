const mongoose = require('mongoose');
let Schema = mongoose.Schema;

let SpendingSchema = new Schema({
    name: String,
    amount: Number,
    cycle: Number,
    status: String,
    bank_name: String,
    account_number: String
});

let Spending = mongoose.model('Spending', SpendingSchema);