/* Dependency 라이브러리를 불러옵니다. */
const express = require('express');
const app = express();
const mongoose = require('mongoose');

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

/* Server 환경설정 */
const port = 3000;
app.listen(port, function() {
    console.log('Listening on port: ' + port);
})