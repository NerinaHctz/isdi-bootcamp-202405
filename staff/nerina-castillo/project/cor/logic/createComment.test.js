import 'dotenv/config'
import mongoose from 'mongoose'
import createComment from './createComment.js'

mongoose.connect(process.env.MONGODB_URI)
    .then(() => createComment('66c597120107c18982b0053a', '66c597486b034849c9d13396', 'come on!'))
    .catch(error => console.error(error))
    .finally(() => mongoose.disconnect())