const {getTweets, getTweetsByUsername, postTweet, getUserByUsername} = require('./services/database')

const express = require('express')
const cors = require('cors')
const jwt = require('jsonwebtoken')
const app = express()
const PORT = 3333;
const APP_SECRET = 'my-secret-key-1234'

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

app.post('/tweets', async (req,res)=> {
    const{text} = req.body
    const username = req.headers['x-user'];
    const newTweet = await postTweet(text,username)
    res.json(newTweet)
})

app.post('/login', async (req,res)=>{
    const {username,password} = req.body;

    try{
        const user = await getUserByUsername(username)
        if(!user){
            res.status(401).send({error:'User not Found'})
            return;
        }

        if(password !== user.password){
            res.status(401).send({error: 'Wrong Password'})
            return;
        }

        // first paramater in sign is payload, which can be a string, or object with different properties.
        const token = jwt.sign({
            id: user.id,
            username: user.username,
            name:user.name
        },Buffer.from(APP_SECRET,'base64'))

        res.json({token})

    }catch(error){
        res.status(500).send({error:error.message})
    }

    
});

app.get('/session', async(req,res) =>{
    const token = req.headers['x-token']
    try{
        const payload = jwt.verify(token, Buffer.from(APP_SECRET,'base64'))
        res.json({message:`You are logged in as ${payload.username}`})
    }catch(error){
        res.status(401).json({error:'Invalid Token'})
    }
})

app.listen(PORT, () => console.log(`Twitter API listening on ${PORT}`))