var mongoose = require('mongoose')

main().catch(err => console.log(err));
  async function main() {
    await mongoose.connect('mongodb+srv://fmartigne:LaCapsule@cluster0.chaojog.mongodb.net/MorningNews');                     
  };

module.exports = mongoose;