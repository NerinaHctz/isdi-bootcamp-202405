import 'dotenv/config'
import mongoose from 'mongoose'

import createPost from './createPost.js'

mongoose.connect(process.env.MONGODB_URI)
    .then(() => createPost('66bb01ec11ee5fa8de368abd', 'httpshttps://media.giphy.com/media/gHbQG42yJMVHy/giphy.gif?cid=ecf05e47avd97k5cxmhrnbrgkinaptz3nbevbd8mrtpulz06&ep=v1_gifs_search&rid=giphy.gif&ct=gnlknvliver', 'lalalaaaa'))
    .catch(error => console.error(error))
    .finally(() => mongoose.disconnect())