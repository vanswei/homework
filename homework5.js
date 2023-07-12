const express = require('express')
const redis = require('redis')
const requestPromise = require('request-promise')
const request = require('request-promise')
const app = express()
const client = redis.createClient()

// 生成随机数R并保存
app.get('/start', (req, res) => {
    const R = Math.floor(Math.random() * 1000000)
    client.set('R', R, (err) => {
        if (err) {
            console.error(err)
            res.status(500).send('Internal Server Error')
        } else {
            res.send('OK')
        }
    });
});

// 比较number和R的值
app.get('/:number', (req, res) => {
    const number = parseInt(req.params.number)
    client.get('R', (err, reply) => {
        if (err) {
            console.error(err)
            res.status(500).send('Internal Server Error')
        } else {
            const R = parseInt(reply)
            if (number < R) {
                res.send('smaller')
            } else if (number > R) {
                res.send('bigger')
            } else {
                const newR = Math.floor(Math.random() * 1000000)
                client.set('R', newR, (err) => {
                    if (err) {
                        console.error(err)
                        res.status(500).send('Internal Server Error')
                    } else {
                        res.send('equal')
                    }
                });
            }
        }
    });
});

// 启动服务器
app.listen(3000, () => {
    console.log('Server started on port 3000')
})


// 模拟玩一次猜数字游戏（callback方式）
function playGameCallback() {
    request('http://localhost:3000/start', (err, res, body) => {
        if (err) {
            console.error(err)
        } else {
            console.log(body)
            makeGuessCallback()
        }
    });
}

function makeGuessCallback() {
    const number = Math.floor(Math.random() * 1000000)
    request(`http://localhost:3000/${number}`, (err, res, body) => {
        if (err) {
            console.error(err)
        } else {
            if (body === 'equal') {
                console.log('模拟玩一次猜数字游戏(callback方式)找到的答案:', number)
            } else {
                makeGuessCallback()
            }
        }
    });
}

playGameCallback()

// 模拟玩一次猜数字游戏（Promise方式）
function playGamePromise() {
    requestPromise('http://localhost:3000/start')
        .then(() => {
            makeGuessPromise()
        })
        .catch((err) => {
            console.error(err)
        });
}

function makeGuessPromise() {
    const number = Math.floor(Math.random() * 1000000)
    requestPromise(`http://localhost:3000/${number}`)
        .then((result) => {
            if (result === 'equal') {
                console.log('模拟玩一次猜数字游戏(Promise方式)所找到的答案:', number)
            } else {
                makeGuessPromise()
            }
        })
        .catch((err) => {
            console.error(err)
        });
}

playGamePromise()


// 模拟玩一次猜数字游戏（async/await方式）
async function playGameAsync() {
    try {
        await request('http://localhost:3000/start')
        await makeGuessAsync()
    } catch (err) {
        console.error(err)
    }
}

async function makeGuessAsync() {
    try {
        const number = Math.floor(Math.random() * 1000000)
        const response = await request(`http://localhost:3000/${number}`)
        if (response === 'equal') {
            console.log('模拟玩一次猜数字游戏(async/await方式)所找到的答案:', number)
        } else {
            await makeGuessAsync()
        }
    } catch (err) {
        console.error(err)
    }
}

playGameAsync()