let allBanks;
let text ='';
let PaystackTransfer = require('paystack-transfer')('sk_test_e66c2632e32e419cabaa01d0f749ce5ac2221e06');
let fs =  require('fs');
allBanks = Object.keys(PaystackTransfer.all_banks).map(key => PaystackTransfer.all_banks[key]);
allBanks.forEach((bank)=> {
    text += `<option value="${bank.slug}">${bank.name}</option>\n`;
});

fs.writeFileSync('banks.html', text);