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
function playGameCallback(callback) {
    request('http://localhost:3000/start', (err, res, body) => {
        if (err) {
            callback(err)
        } else {
            console.log(body)
            makeGuessCallback(0, 1000000, callback)
        }
    });
}

function makeGuessCallback(min, max, callback) {
    const number = Math.floor((min + max) / 2)
    request(`http://localhost:3000/${number}`, (err, res, body) => {
        if (err) {
            callback(err)
        } else {
            if (body === 'equal') {
                console.log('模拟玩一次猜数字游戏(callback方式)找到的答案:', number)
                callback(null)
            } else if (body === 'smaller') {

                console.log(body, number)
                makeGuessCallback(number + 1, max, callback)

            } else if (body === 'bigger', callback) {

                console.log(body, number)
                makeGuessCallback(min, number - 1, callback)
            }
        }
    });
}

playGameCallback((err) => {
    if (err) {
        console.error(err)
    }
})


// 模拟玩一次猜数字游戏（Promise方式）
function playGamePromise() {
    return requestPromise('http://localhost:3000/start')
        .then(() => {
            return makeGuessPromise(0, 1000000)
        })
        .catch((err) => {
            console.error(err)
        });
}

function makeGuessPromise(min, max) {
    const number = Math.floor((min + max) / 2)
    return requestPromise(`http://localhost:3000/${number}`)
        .then((result) => {
            if (result === 'equal') {
                console.log('模拟玩一次猜数字游戏(Promise方式)所找到的答案:', number)
            } else if (result === 'smaller') {
                console.log(result, number)
                return makeGuessPromise(number + 1, max)
            } else if (result === 'bigger') {
                console.log(result, number)
                return makeGuessPromise(min, number - 1)
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
        await makeGuessAsync(0, 1000000)
    } catch (err) {
        console.error(err)
    }
}

async function makeGuessAsync(min, max) {
    try {
        const number = Math.floor((min + max) / 2)
        const response = await request(`http://localhost:3000/${number}`)
        if (response === 'equal') {
            console.log('模拟玩一次猜数字游戏(async/await方式)所找到的答案:', number)
        } else if (response === 'smaller') {
            console.log(response, number)
            await makeGuessAsync(number + 1, max)
        } else if (response === 'bigger') {
            console.log(response, number)
            await makeGuessAsync(min, number - 1)
        }

    } catch (err) {
        console.error(err)
    }
}

playGameAsync()