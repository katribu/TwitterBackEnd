const {Pool} = require('pg') // class that we use from the pgAdmin database

const database = new Pool({
    user:'postgres',
    host: 'localhost',
    database:'Tweets',
    password: '100759094',
    port: 5432,
})

async function getTweets(){
    const result = await database.query(`
    SELECT
        tweets.id,
        tweets.message,
        tweets.created_at,
        users.name,
        users.username
    FROM 
        tweets
    INNER JOIN users ON
        tweets.user_id = users.id
    ORDER BY created_at DESC;
    `); // this returns a promise on the rows that they match.
    // console.log(result)
    return result.rows;
}

async function getTweetsByUsername(username){
    const result = await database.query(`
    SELECT
        tweets.id,
        tweets.message,
        tweets.created_at,
        users.name,
        users.username
    FROM 
        tweets
    INNER JOIN users ON
        tweets.user_id = users.id
    WHERE
        users.username = $1
    ORDER BY created_at DESC;

    `,[username]);
    return result.rows
}
//$1 means prevents sequel injection and refers to the first item (index 0) in the array,
// which is the second argument in database.query

async function postTweet(text,username){
    const userResult = await database.query(`
    SELECT
        users.id
    FROM 
        users
    WHERE 
        username = $1

    `,[username])

    const user = userResult.rows[0]
    const tweetResult = await database.query(`
    INSERT INTO tweets
        (message,user_id)
    VALUES
        ($1,$2)
    RETURNING 
        *
    `,[text, user.id]);
    const newTweet = tweetResult.rows[0];
    return newTweet
}


module.exports = {
    getTweets,
    getTweetsByUsername,
    postTweet
}