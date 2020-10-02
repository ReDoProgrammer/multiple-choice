const mongoose=require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt');
const common = require('../common/common');
const SALT_WORK_FACTOR = 10;

const UserSchema = new Schema({
  member_code:{type:String,default:common.MemberCode(),unique:true},
  username:{type:String,default:'',unique:true},
  password:{type:String,default:''},
  fullname:{type:String,default:''},
  phone:{type:String,default:''},
  is_admin:{type:Boolean,default:false},
  user_type:{type:Number,default:0},
  avatar:{type:String,default:''},
  contributed_question:{type:Boolean,default:true},
  job:{
    type:Schema.Types.ObjectId,
    ref:'job'
  },
  comments:[{
    type:Schema.Types.ObjectId,
    ref:'comment'
  }]
});

UserSchema.pre('save', function(next) {
    var user = this;

    // only hash the password if it has been modified (or is new)
    if (!user.isModified('password')) return next();

    // generate a salt
    bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
        if (err) return next(err);

        // hash the password using our new salt
        bcrypt.hash(user.password, salt, function(err, hash) {
            if (err) return next(err);

            // override the cleartext password with the hashed one
            user.password = hash;
            next();
        });
    });
});



UserSchema.methods.ComparePassword = function(candidatePassword, cb) {
    bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
        if (err) return cb(err);
        cb(null, isMatch);
    });
};


module.exports = mongoose.model("user",UserSchema);
