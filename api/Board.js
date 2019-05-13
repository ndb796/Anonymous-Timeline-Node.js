const express = require('express');
const router = express.Router();
const Board = require('../models/Board');

router.get('/',
    // 오름차순으로 ID 값을 검색합니다.
    function(req, res, next) {
        let query = {};
        // 대소문자를 무시하고 검색 조건을 명시합니다.
        if(req.query.name) {
            query.name = {$regex:req.query.name, $options:'i'};
        }
        if(req.query.content) {
            query.content = {$regex:req.query.content, $options:'i'};
        }
        Board.find(query)
        .select("-password")
        .sort({id: 1})
        .exec(function(err, boards) {
            if(err) {
                res.status(500);
                res.json({success: false, data: err});
            }
            else {
                res.json({success: true, data: boards});
            }
        });
    }
)

router.get('/:id',
    function(req, res, next) {
        Board.findOne({id:req.params.id})
        .select("-password")
        .exec(function(err, board) {
            if(err) {
                res.status(500);
                res.json({success: false, data: err});
            }
            else if(!board) {
                res.json({success: false, data: "Board not found."});
            }
            else {
                res.json({success: true, data: board});
            }
        })
    }
)

router.post('/',
    // 내림차순으로 최신 ID 값을 검색합니다.
    function(req, res, next) {
        Board.findOne({})
        .sort({id: -1})
        .exec(function(err, board) {
            if(err) {
                res.status(500);
                res.json({success: false, data: err})
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

router.put('/:id',
    // 해당 ID 값으로 게시물을 검색합니다.
    function(req, res, next) {
        Board.findOne({id:req.params.id})
        .exec(function(err, board) {
            if(err) {
                res.status(500);
                res.json({success: false, data: err});
            }
            else if(!board) {
                res.json({success: false, data: "Board not found."});
            }
            else {
                if(board.password != req.headers.password) {
                    res.json({success: false, data: "Password is incorrect."});
                } else {
                    next();
                }
            }
        });
    },
    // 검색된 게시물을 수정합니다.
    function(req, res, next) {
        Board.findOneAndUpdate({id:req.params.id}, req.body)
        .exec(function(err, board) {
            if(err) {
                res.status(500);
                res.json({success: false, data: err});
            }
            else {
                res.json({success: true});
            }
        })
    }
)

router.delete('/:id',
    // 해당 ID 값으로 게시물을 검색합니다.
    function(req, res, next) {
        Board.findOne({id:req.params.id})
        .exec(function(err, board) {
            if(err) {
                res.status(500);
                res.json({success: false, data: err});
            }
            else if(!board) {
                res.json({success: false, data: "Board not found."});
            }
            else {
                if(board.password != req.headers.password) {
                    res.json({success: false, data: "Password is incorrect."});
                } else {
                    next();
                }
            }
        });
    },
    // 검색된 게시물을 삭제합니다.
    function(req, res, next) {
        Board.findOneAndRemove({id:req.params.id})
        .exec(function(err, board) {
            if(err) {
                res.status(500);
                res.json({success: false, data: err});
            }
            else {
                res.json({success: true});
            }
        })
    }
)

module.exports = router;