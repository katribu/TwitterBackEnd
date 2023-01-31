const {getTweets} = require('./services/database')

const express = require('express')
const cors = require('cors')
const app = express()
const PORT = 3000;

app.use(express.json()) // does the json parsing
app.use(cors()) // can use fetch requests to the server even though front end is using a different host.

app.get('/', (req,res) =>{
    res.send('Hello World')
})


app.get('/tweets', async(req,res)=>{
    const tweets = await getTweets()
    res.json(tweets)
    //get tweets from database
    //respond with tweets as JSON
})


app.listen(PORT, () => console.log(`Twitter API listening on ${PORT}`))