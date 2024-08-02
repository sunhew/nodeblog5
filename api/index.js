const express = require('express');
const app = express();
const cors = require('cors');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');

const User = require('./models/User');
const Board = require('./models/Board');

const salt = bcrypt.genSaltSync(10);
const secret = 'webstroyboy';

// 미들웨어 설정
app.use(cors({ credentials: true, origin: 'http://localhost:3000' }));
app.use(express.json());
app.use(cookieParser());

// MongoDB에 연결
mongoose.connect("mongodb+srv://gsim12:qwe123%21%40%23@cluster0.gbht9fu.mongodb.net/myDatabase?retryWrites=true&w=majority&appName=Cluster0", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 5000 // 서버 선택 타임아웃 설정
})
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection error:', err));

// 회원가입 엔드포인트
app.post('/register', async (req, res) => {
    const { youName, youEmail, youPass } = req.body;
    console.log(req.body); // 서버로 전달된 데이터 로그 출력

    try {
        const userInfo = await User.create({
            youName,
            youEmail,
            youPass: bcrypt.hashSync(youPass, salt)
        });
        res.status(200).json(userInfo);
    } catch (err) {
        console.error('회원가입 오류:', err); // 오류 로그 추가
        res.status(400).json({ message: err.message });
    }
});

// 이름 중복 검사 엔드포인트
app.post('/check-name', async (req, res) => {
    const { youName } = req.body;

    try {
        const user = await User.findOne({ youName });
        if (user) {
            return res.status(400).json({ message: '이미 사용중인 이름입니다.' });
        }
        res.status(200).json({ message: '사용 가능한 이름입니다.' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// 이메일 중복 검사 엔드포인트
app.post('/check-email', async (req, res) => {
    const { youEmail } = req.body;

    try {
        const user = await User.findOne({ youEmail });
        if (user) {
            return res.status(400).json({ message: '이미 가입된 이메일입니다.' });
        }
        res.status(200).json({ message: '사용 가능한 이메일입니다.' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});


// 로그인 엔드포인트
app.post('/login', async (req, res) => {
    const { youEmail, youPass } = req.body;

    try {
        const userInfo = await User.findOne({ youEmail });
        if (!userInfo) {
            return res.status(400).json({ message: '이메일 또는 비밀번호가 정확하지 않습니다.' });
        }

        const isPassValid = bcrypt.compareSync(youPass, userInfo.youPass);
        if (!isPassValid) {
            return res.status(400).json({ message: '이메일 또는 비밀번호가 정확하지 않습니다.' });
        }

        jwt.sign(
            { youName: userInfo.youName, youEmail, id: userInfo._id },
            secret,
            { expiresIn: '1d' },
            (err, token) => {
                if (err) {
                    return res.status(500).json({ message: err.message });
                }
                res.cookie('token', token, { httpOnly: true }).json({
                    id: userInfo._id,
                    youName: userInfo.youName,
                    youEmail,
                    token
                });
            }
        );
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
});

// 로그인 상태 확인 엔드포인트
app.get('/profile', (req, res) => {
    const { token } = req.cookies;

    jwt.verify(token, secret, (err, info) => {
        if (err) {
            return res.json({ message: '토큰 검증 실패, 관리자에게 문의하세요!' });
        }
        res.json(info);
    });
});

// 로그아웃 엔드포인트
app.post('/logout', (req, res) => {
    res.cookie('token', '').json({ message: '로그아웃 성공' });
});

// 게시글 작성 엔드포인트
app.post("/board", (req, res) => {
    const { boardTitle, boardContents } = req.body; // 필드 이름 수정
    const token = req.cookies.token;

    if (!token) {
        return res.status(401).json({ message: "로그인을 하지 않았습니다." });
    }

    jwt.verify(token, secret, async (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: "유효한 토큰이 아닙니다." });
        }

        try {
            const boardInfo = await Board.create({
                boardTitle,
                boardContents, // 필드 이름 수정
                boardAuthor: decoded.id,
                boardViews: 0,
            });
            res.status(200).json(boardInfo);
        } catch (err) {
            console.error(err);
            res.status(400).json({ message: err.message });
        }
    });
});

// 게시글 목록 조회 엔드포인트
app.get("/board", async (req, res) => {
    try {
        const boardInfo = await Board.find().populate('boardAuthor', 'youName').sort({ createdAt: -1 });
        res.status(200).json(boardInfo);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// 게시글 상세 조회 및 조회수 증가 엔드포인트
app.get('/board/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const boardInfo = await Board.findById(id).populate('boardAuthor', 'youName');

        if (!boardInfo) {
            return res.status(404).json({ message: "게시물을 찾을 수 없습니다." });
        }

        boardInfo.boardViews += 1;
        await boardInfo.save();

        res.status(200).json(boardInfo);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// 게시글 삭제 엔드포인트
app.delete('/board/:id', (req, res) => {
    const { id } = req.params;
    const token = req.cookies.token;

    if (!token) {
        return res.status(401).json({ message: "로그인을 하지 않았습니다." });
    }

    jwt.verify(token, secret, async (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: "유효하지 않은 토큰입니다." });
        }

        try {
            const boardInfo = await Board.findById(id);
            if (!boardInfo) {
                return res.status(400).json({ message: "게시물을 찾을 수 없습니다." });
            }
            if (boardInfo.boardAuthor.toString() !== decoded.id) {
                return res.status(403).json({ message: "삭제 권한이 없습니다." });
            }

            await Board.findByIdAndDelete(id);
            return res.status(200).json({ message: "게시물이 삭제되었습니다." });
        } catch (err) {
            return res.status(400).json({ message: err.message });
        }
    });
});

// 게시글 수정 엔드포인트
app.put('/board/:id', (req, res) => {
    const { id } = req.params;
    const { title, content } = req.body;
    const token = req.cookies.token;

    if (!token) {
        return res.status(401).json({ message: "로그인을 하지 않았습니다." });
    }

    jwt.verify(token, secret, async (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: "유효하지 않은 토큰입니다." });
        }

        try {
            const boardInfo = await Board.findById(id);

            if (!boardInfo) {
                return res.status(400).json({ message: "게시물을 찾을 수 없습니다." });
            }

            if (boardInfo.boardAuthor.toString() !== decoded.id) {
                return res.status(403).json({ message: "수정 권한이 없습니다." });
            }

            boardInfo.boardTitle = title;
            boardInfo.boardContents = content; // 필드 이름 수정
            await boardInfo.save();

            return res.status(200).json({ message: "게시물이 수정되었습니다." });
        } catch (err) {
            return res.status(400).json({ message: err.message });
        }
    });
});

// 서버 시작
app.listen(8880, () => {
    console.log('8880 서버가 작동되고 있습니다.');
});
