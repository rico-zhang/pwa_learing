const express = require('express');
const bodyParser = require('body-parser');
const serveStatic = require('serve-static');
const app = express();

app.use(serveStatic('public'))


// parse various different custom JSON types as JSON
app.use(bodyParser.json({ type: 'application/*+json' }))

// parse some custom thing into a Buffer
app.use(bodyParser.raw({ type: 'application/vnd.custom-type' }))

// parse an HTML body into a string
app.use(bodyParser.text({ type: 'text/html' }))



app.get('/api/getMovies', (req, res) => {
    res.send({
        randomNum: randomNum(1, 100)
    });
});

function randomNum(min, max) {
    return parseInt((Math.random() * (max - min) + min))
}

app.listen(8080, () => {
    console.log('启动成功');
})
