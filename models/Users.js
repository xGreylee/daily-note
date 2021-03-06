const mongoose = require('mongoose')
const crypto = require('crypto')
const jwt = require('jsonwebtoken')

const UserSchema = new mongoose.Schema({
	username: {
		type: String,
		lowercase: true,
		unique: true
	},
	gender: {
		type: String
	},
	nickname: {
		type: String,
		unique: true
	},
	signs: {
		type: String
	},
	hash: String,
	salt: String
})

UserSchema.methods.generateJWT = function() {

	// set expiration to 60 days
	const today = new Date()
	const exp = new Date(today)
	exp.setDate(today.getDate() + 60)

	return jwt.sign({
		_id: this._id,
		username: this.username,
		hash: this.hash,
		// salt: this.salt,
		// gender: this.gender,
		// nickname: this.nickname,
		// signs: this.signs,
		exp: parseInt(exp.getTime() / 1000),
	}, 'SECRET')
}

UserSchema.methods.setPassword = function(password) {
	this.salt = crypto.randomBytes(16).toString('hex')
	this.hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64, 'sha512').toString('hex')
}

UserSchema.methods.validPassword = function(password) {
	const hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64, 'sha512').toString('hex')
	return this.hash === hash
}

UserSchema.methods.resetPassword = function(password) {
	this.salt = crypto.randomBytes(16).toString('hex')
	const hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64).toString('hex')
	this.hash = hash
	return this.hash
}

mongoose.model('User', UserSchema)
