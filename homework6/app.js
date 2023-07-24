const express = require('express')
require('./index.js')
const session = require('express-session')
const app = express()
const bodyParser = require('body-parser')
const md5 = require('md5')
const path = require('path')
const User = require('./userModel')
const Number = require('./numberModel')

app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: true
}))


app.get('/', function(req, res, next) {
    res.sendFile(path.resolve(__dirname, "./view/login.html"))
})

app.get('/a', function(req, res, next) {
    res.sendFile(path.resolve(__dirname, "./view/register.html"))
})




app.post('/register', async(req, res) => {
    const { name, password } = req.body

    try {
        const existingUser = await User.findOne({ name })
        if (existingUser) {
            return res.status(400).json({ message: '用户名已存在' })
        }

        const salt = Math.random().toString(36).substring(2, 15)
        const user = new User({
            name,
            salt,
            password: md5(name + salt + password)
        })

        await user.save()

        res.json({ message: '注册成功' })
    } catch (error) {
        console.error('注册时出错：', error)
        res.status(500).json({ message: '服务器错误' })
    }
});



app.post('/login', async(req, res) => {
    const { name, password } = req.body;

    try {
        const user = await User.findOne({ name })

        if (!user || user.password !== md5(name + user.salt + password)) {
            return res.status(401).json({ message: '用户名或密码不正确' })
        }

        req.session.userid = user._id

        res.json({ message: `Hello ${name}` })
    } catch (error) {
        console.error('登录时出错：', error)
        res.status(500).json({ message: '服务器错误' })
    }
})




const authMiddleware = (req, res, next) => {
    if (!req.session.userid) {
        return res.status(401).json({ message: '未登录用户' })
    }
    next();
}


app.get('/start', authMiddleware, async(req, res) => {
    try {
        const randomNumber = Math.floor(Math.random() * 101)
        const number = new Number({
            userid: req.session.userid,
            number: randomNumber
        })

        await number.save()

        res.json({ message: '随机数已生成' })
    } catch (error) {
        console.error('生成随机数时出错：', error)
        res.status(500).json({ message: '服务器错误' })
    }
})



app.get('/number/:number', authMiddleware, async(req, res) => {
    const { number } = req.params
    try {
        const userNumber = await Number.findOne({ userid: req.session.userid })

        if (userNumber.number > number) {
            res.json({ result: 'big' })
        } else if (userNumber.number < number) {
            res.json({ result: 'small' })
        } else {
            res.json({ result: 'equal' })
        }

    } catch (error) {
        console.error('处理Number请求时出错：', error)
        res.status(500).json({ message: '服务器错误' })
    }
})


app.listen(4000, () => {
    console.log('服务器运行在 http://localhost:4000')
})