const express = require('express');
const router = express.Router();
const Board = require('../models/Board');

// Index 경로
router.post('/',
    // 내림차순으로 최신 ID 값을 검색합니다.
    function(req, res, next) {
        Board.findOne({})
        .sort({id: -1})
        .exec(function(err, board) {
            if(err) {
                res.status(500);
                return res.json({success: false, data: err})
            }
            else {
                // 첫 게시물인 경우 ID 0부터 시작합니다.
                res.locals.lastId = board ? board.id : 0;
                next();
            }
        });
    },
    // 새로운 ID로 게시물 정보를 저장합니다.
    function(req, res, next) {
        const newBoard = new Board(req.body);
        newBoard.date = new Date();
        newBoard.id = res.locals.lastId + 1;
        newBoard.save(function(err, board) {
            if(err) {
                res.status(500);
                res.json({success: false, data: err});
            }
            else {
                res.json({success: true, data: board})
            }
        })
    }
)

module.exports = router;