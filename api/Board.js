const express = require('express');
const router = express.Router();
const Board = require('../models/Board');

router.get('/',
    // 오름차순으로 ID 값을 검색합니다.
    function(req, res, next) {
        let query = {};
        let searched = false;
        // 대소문자를 무시하고 검색 조건을 명시합니다.
        if(req.query.name) {
            query.name = {$regex:req.query.name, $options:'i'};
            searched = true;
        }
        if(req.query.content) {
            query.content = {$regex:req.query.content, $options:'i'};
            searched = true;
        }
        // ID를 매개변수로 입력 받는 경우, 특정한 ID로부터 5개 이내의 데이터를 가져옵니다.
        if(req.query.id) {
            let id = req.query.id
            query.id = {$gt: id - 5, $lte: id}
            Board.find(query)
            .select("-password")
            .sort({id: -1})
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
        /* ID를 매개변수로 입력 받지 않은 경우, 최근 5개의 데이터를 불러옵니다.
           이 때 검색어를 입력한 경우, 검색어에 맞는 모든 데이터를 다 불러옵니다.
        */
        else {
            if(searched) {
                Board.find(query)
                .select("-password")
                .sort({id: -1})
                .exec(function(err, boards) {
                    if(err) {
                        res.status(500);
                        res.json({success: false, data: err});
                    }
                    else {
                        res.json({success: true, data: boards});
                    }
                });
            } else {
                Board.find(query)
                .select("-password")
                .sort({id: -1})
                .limit(5)
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
        }

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