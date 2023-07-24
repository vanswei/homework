const mongoose = require('mongoose')
mongoose.connect('mongodb://127.0.0.1:27017/blog', { useNewUrlParser: true, useUnifiedTopology: true })

mongoose.connection.on('connected', function() {
    console.log('链接成功', 'mongodb://127.0.0.1:27017/blog')
})

mongoose.connection.on('error', function(err) {
    console.log('链接错误', err)
})

mongoose.connection.on('disconnetction', function() {
    console.log('断开链接')
})
module.exports = mongoose