import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';

const BoardList = () => {
    const [boards, setBoards] = useState([]);

    useEffect(() => {
        fetch('http://localhost:8880/board', {
            credentials: 'include',
        })
            .then(response => response.json())
            .then(data => {
                console.log(data);
                setBoards(data)
            })
            .catch(err => console.error('Error:', err));
    }, [])

    return (
        <section className='board__inner container2'>
            <h3 className='blind'>게시판</h3>
            <div className='board__search'>
                <div className='search'>
                    <input type="search" placeholder='search' />
                    <button className='searchBtn'></button>
                </div>
            </div>
            <div className='board__table'>
                <table>
                    <caption className='blind'>게시판 목록 표</caption>
                    <colgroup>
                        <col style={{ width: '6%' }} />
                        <col style={{ width: '45%' }} />
                        <col style={{ width: '8%' }} />
                        <col style={{ width: '8%' }} />
                        <col style={{ width: '6%' }} />
                    </colgroup>
                    <thead>
                        <tr>
                            <th>번호</th>
                            <th>제목</th>
                            <th>등록자</th>
                            <th>등록일</th>
                            <th>조회수</th>
                        </tr>
                    </thead>
                    <tbody>
                        {boards.map((board, index) => (
                            <tr key={board._id} className='board__item'>
                                <td>{index + 1}</td>
                                <td><Link to={`/board/${board._id}`}>{board.boardTitle}</Link></td>
                                <td>{board.boardAuthor.youName}</td>
                                <td>{new Date(board.createdAt).toLocaleDateString()}</td>
                                <td>{board.boardViews}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <div className="board__page">
                <a href="/" className='pageLeft'>
                    <span className='blind'>이전</span>
                </a>
                <ul>
                    <li><a href="/" className='active'>1</a></li>
                </ul>
                <a href="/" className='pageRight'>
                    <span className='blind'>다음</span>
                </a>
            </div>
        </section>
    )
}

export default BoardList