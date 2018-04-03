const mongoose = require('mongoose')

const CategorySchema = new mongoose.Schema({
	name: String,
	posts: [{
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Post'
	}]
})


mongoose.model('Category', CategorySchema)
