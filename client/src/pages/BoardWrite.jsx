import React, { useState, useRef, useEffect } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { useNavigate } from 'react-router-dom';

const modules = {
    toolbar: [
        [{ 'header': [1, 2, false] }],
        ['bold', 'italic', 'underline', 'strike', 'blockquote'],
        [{ 'list': 'ordered' }, { 'list': 'bullet' }, { 'indent': '-1' }, { 'indent': '+1' }],
        ['link', 'image'],
        ['clean']
    ],
};

const formats = [
    'header',
    'bold', 'italic', 'underline', 'strike', 'blockquote',
    'list', 'bullet', 'indent',
    'link', 'image'
];

const BoardWrite = () => {
    const [boardTitle, setBoardTitle] = useState('');
    const [boardContents, setBoardContents] = useState('');
    const navigate = useNavigate();
    const quillRef = useRef(null); // ReactQuill 참조를 위한 Ref

    useEffect(() => {
        // 페이지가 로드될 때 에디터에 포커스
        if (quillRef.current) {
            quillRef.current.getEditor().focus();
        }
    }, []);

    const boardWrite = async (e) => {
        e.preventDefault();

        const data = {
            boardTitle,
            boardContents
        };

        if (!boardTitle || !boardContents) {
            alert('제목과 내용을 모두 입력해주세요.');
            return;
        }

        const response = await fetch('http://localhost:8880/board', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify(data),
        });

        console.log(response);

        if (response.ok) {
            alert("글쓰기 성공");
            navigate('/board');
            resetForm(); // 폼 초기화
        } else {
            const errorData = await response.json();
            alert(`글쓰기 실패: ${errorData.message}`);
        }
    };

    const resetForm = () => {
        setBoardTitle('');
        setBoardContents('');
        setTimeout(() => {
            if (quillRef.current) {
                quillRef.current.getEditor().focus(); // 폼 리셋 후 에디터에 포커스
            }
        }, 0);
    };

    return (
        <section className='board__inner container2'>
            <h3 className='blind'>게시판 글쓰기</h3>
            <div className='board__write'>
                <form onSubmit={boardWrite}>
                    <fieldset>
                        <legend className="blind">게시글 작성하기</legend>
                        <div>
                            <label htmlFor="boardTitle">제목</label>
                            <input
                                type="text"
                                id="boardTitle"
                                name="boardTitle"
                                placeholder='제목을 작성하세요!'
                                value={boardTitle}
                                onChange={e => setBoardTitle(e.target.value)}
                            />
                        </div>
                        <div>
                            <ReactQuill
                                ref={quillRef} // ReactQuill에 Ref 추가
                                value={boardContents}
                                modules={modules}
                                formats={formats}
                                onChange={setBoardContents}
                                onFocus={() => {
                                    if (quillRef.current) {
                                        quillRef.current.getEditor().enable(); // 에디터 활성화
                                    }
                                }}
                                onBlur={() => {
                                    if (quillRef.current) {
                                        quillRef.current.getEditor().disable(); // 에디터 비활성화
                                    }
                                }}
                            />
                        </div>
                        <div className="btn">
                            <button type="submit">저장하기</button>
                        </div>
                    </fieldset>
                </form>
            </div>
        </section>
    );
};

export default BoardWrite;
