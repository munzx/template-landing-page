const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt');
const SALT_WORK_FACTOR = 10;


const usersSchema = new Schema({
    fullname: {
        type: String,
        default: '',
        required: "User full name is required",
        trim: true
    },
    nationality: {
        type: String,
        default: '',
        trim: true,
        required: "Nationality field is required",
    },
	mobile: {
        type: String,
        index: true,
        lowercase: true,
        required: "Mobile phone number is required",
    },
	email: {
        type: String,
        trim: true,
        index: true,
        unique: true,
        lowercase: true,
        match: [/.+\@.+\..+/, 'Please provide a valid email address']
    },
    randomStr: {
       type: String,
       required: true
    },
    recieve_newsletter: {
        type: String
     },
     privacy_policy: {
        type: String
     },
	created: {
		type: Date,
		default: Date.now
	}
}, {strict: true});

usersSchema.pre('save', function (next) {
	var user = this;
	if(!user.isModified('password')) return next();
	bcrypt.genSalt(SALT_WORK_FACTOR, function (err, salt) {
		if(err) return next(err);
		bcrypt.hash(user.password, salt, function (err, hash) {
			if(err) next(err);
			user.password = hash;
			next();
		});
	});
});

usersSchema.methods.comparePasswords = function (toBeCompared, callBack) {
	bcrypt.compare(toBeCompared, this.password, function (err, isMatch) {
		if(err) return callBack(err);
		callBack(null, isMatch);
	});
}

module.exports = mongoose.model('User', usersSchema);