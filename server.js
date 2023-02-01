const {getTweets, getTweetsByUsername, postTweet} = require('./services/database')

const express = require('express')
const cors = require('cors')
const app = express()
const PORT = 3333;

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

app.get('/tweets/:username', async(req,res)=>{
    const {username} = req.params;
    const tweets = await getTweetsByUsername(username)
    res.json(tweets)
})

app.post('/tweets/:username', async (req,res)=> {
    const{text} = req.body
    const {username} = req.params
    const newTweet = await postTweet(text,username)
    res.json(newTweet)
})

app.listen(PORT, () => console.log(`Twitter API listening on ${PORT}`))