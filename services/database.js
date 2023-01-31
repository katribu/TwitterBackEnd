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
    console.log(result)
    return result.rows;
}

module.exports = {
    getTweets,
}