const http = require('http')
const server = http.createServer()
server.on('request', function(req, res) { console.log('Someone visit our web server.') })
server.listen(80, function() {
    console.log('server running at http://127.0.0.1:80')
})
server.on('request', (req, res) => {
    const url = req.url
    let content = '<h1>hello word</h1>'
    if (url === '/' || url === '/index.html') {
        content = '<h1>hello world</h1>'
    } else if (url === '/about.html') {
        content = '<h1>关于页面</h1>'
    }
    res.setHeader('Content-Type', 'text/html; charset=utf-8')
    res.end(content)
})