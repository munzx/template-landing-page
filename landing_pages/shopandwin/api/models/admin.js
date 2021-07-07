const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt');
const SALT_WORK_FACTOR = 10;


const adminSchema = new Schema({
	email: {
        type: String,
        trim: true,
        index: true,
        unique: true,
        lowercase: true,
        match: [/.+\@.+\..+/, 'Please provide a valid email address']
    },
    password: {
        type: String,
        default: '',
        required: 'Please provide the password',
        trim: true
    },
    access: {
        type: String,
        default: 'admin'
    },
	created: {
		type: Date,
		default: Date.now
	}
}, {strict: true});

adminSchema.pre('save', function (next) {
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

adminSchema.methods.comparePasswords = function (toBeCompared, callBack) {
	bcrypt.compare(toBeCompared, this.password, function (err, isMatch) {
		if(err) return callBack(err);
		callBack(null, isMatch);
	});
}

module.exports = mongoose.model('admin', adminSchema);