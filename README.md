### Anonymouse Timeline Node.js

### How to use
```
# 사전에 접속 가능한 MongoDB를 가지고 있어야 합니다.
# PowerShell 환경변수 설정: $env:MONGO_DB="{데이터베이스 접속 URL}"
# CMD 환경변수 설정: set MONGO_DB={데이터베이스 접속 URL}
yarn install
nodemon app.js
```
### Tutorial
* Express: Node.js 서버 프레임워크
* Mongoose: mongoDB 라이브러리
* Body-Parser: Request Body 값을 오브젝트로 변환하는 라이브러리
```
yarn init
yarn add express mongoose body-parser
```
* Connect MongoDB
```
# https://github.com/ndb796/Anonymous-Timeline-Node.js/commit/81e6adc8ceb350afdfbd8f5cdbbc8d3ab6fba869
```
* Add Board Create Module
```
# https://github.com/ndb796/Anonymous-Timeline-Node.js/commit/331915f2edbd021d72c93861fbb378b0ec4fb547
# REST API Test (http://localhost:3000/api/board : POST)
{
  "name": "gildong",
  "password": "123123",
  "content": "안녕하세요?"
}
# Check the data in MongoDB
```
* Add All Boards Read Module
```
# https://github.com/ndb796/Anonymous-Timeline-Node.js/commit/c1b7a212bb33800f066225d27ab37993e4abbe5f
# REST API Test (http://localhost:3000/api/board?name=gildong&content=안녕 : GET)
```
* Add Detail, Update, Delete Module
```
# https://github.com/ndb796/Anonymous-Timeline-Node.js/commit/391126b9642669c948f7cef2a073fd71d7c5c7a4
# REST API Test (http://localhost:3000/api/board/1 : GET)
# REST API Test (http://localhost:3000/api/board/1 : PUT)
Header - password: 123123
{
  "name": "gildong",
  "password": "456456",
  "content": "반갑습니다."
}
# REST API Test (http://localhost:3000/api/board/1 : DELETE)
Header - password: 456456
```