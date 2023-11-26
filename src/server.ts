import app from './app'
import mongoose from 'mongoose'
import config from './config'

// getting-started.js

async function server() {
  try {
    await mongoose.connect(
      'mongodb+srv://L2-B2-assignment-2:L2-B2-assignment-2@cluster0.37kn8jw.mongodb.net/L2-B2-assignment-2?retryWrites=true&w=majority',
    )

    console.log('Connected to MongoDB')
    app.listen(process.env.PORT, () => {
      console.log(`Example app listening on port ${config.port}`)
    })
  } catch (error) {
    console.log(error)
  }
}

server().catch((err) => console.log(err))
