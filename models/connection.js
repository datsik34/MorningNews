var mongoose = require('mongoose')
require('dotenv').config()
const Account = process.env.NODE_MONGODB_ACCOUNT_SECRET;
const Pwd = process.env.NODE_MONGODB_PWD_SECRET;
const Collection = process.env.NODE_MONGODB_COLLECTION_SECRET;

main().catch(err => console.log(err));
async function main() {
  await mongoose.connect(`mongodb+srv://${Account}:${Pwd}@cluster0.chaojog.mongodb.net/${Collection}`);        
};

module.exports = mongoose;