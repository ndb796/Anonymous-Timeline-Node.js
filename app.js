/* Dependency 라이브러리를 불러옵니다. */
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

/* Database 설정 및 변수 초기화 */
mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGO_DB);
const db = mongoose.connection;
db.once('open', function () {
    console.log('Database Connected.');
});
db.on('error', function(err) {
    console.log('Database ERROR: ', err);
});

/* 미들웨어 설정 */
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
// 접근제어(CORS) 허용
app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.header('Access-Control-Allow-Headers', 'content-type, password');
    next();
});

/* API 경로 설정 */
app.use('/api/board', require('./api/Board'));

/* Server 환경설정 */
const port = 3000;
app.listen(port, function() {
    console.log('Listening on port: ' + port);
})