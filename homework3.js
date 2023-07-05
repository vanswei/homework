const express = require('express')
const redis = require('redis')

const app = express()
const redisUrl = "redis://127.0.0.1:6379"
const client = redis.createClient(redisUrl)


//生成随机数R并保存
app.get('/start', (req, res) => {
    const randomNumber = Math.floor(Math.random() * 101)
    client.set('R', randomNumber)
    res.send('OK')
});

//比较number和R的值
app.get('/:number', (req, res) => {
    client.get('R', (err, reply) => {
        //获取R的值
        const R = parseInt(reply)
        const number = parseInt(req.params.number)
        if (number < R) {
            res.send('smaller')
        } else if (number > R) {
            res.send('bigger')
        } else if (number === R) {
            const newR = Math.floor(Math.random() * 101)
            client.set('R', newR)
            res.send('equal')
        }
    });
});


//启动服务器
app.listen(3000, () => {
    console.log('Server started on port 3000')
});
//程序1
app.listen(4000, () => {
    console.log('Server1 started on port 4000')
});
//程序2
app.listen(5000, () => {
    console.log('Server2 started on port 5000')
});