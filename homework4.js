const express = require('express')
const redis = require('redis')

const app = express()
const path = require('path');
const client = redis.createClient()
    //加载静态页面
app.use(express.static(path.join(__dirname, 'public')))



//生成随机数R并保存
app.get('/start', (req, res) => {
    const R = Math.floor(Math.random() * 101)
    client.set('R', R)
    res.send('OK')
});

//比较number和R的值
app.get('/:number', (req, res) => {
    const number = parseInt(req.params.number)
    client.get('R', (err, reply) => {
        if (err) {
            // 处理错误
            console.error(err);
            res.status(500).send('Internal Server Error');
        } else {
            const R = parseInt(reply);
            //获取R的值
            if (number < R) {
                res.send('smaller')
            } else if (number > R) {
                res.send('bigger')
            } else {
                res.send('equal')
                const newR = Math.floor(Math.random() * 101)
                client.set('R', newR)

            }
        }
    });
});


//启动服务器
app.listen(3000, () => {
    console.log('Server started on port 3000')
});