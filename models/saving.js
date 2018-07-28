const mongoose = require('mongoose');
let Schema = mongoose.Schema;

let SavingSchema = new Schema({
    name: String,
    total_amount: Number,
    cycle: Number,
    status: String,
    amount_saved: Number,
    user_id: String
});

let Saving = mongoose.model('Saving', SavingSchema);
module.exports = Saving;