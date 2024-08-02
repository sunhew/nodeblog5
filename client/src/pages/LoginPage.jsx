import React, { useContext, useState } from 'react';
import { UserContext } from '../context/userContext';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
    const [youEmail, setYouEmail] = useState('');
    const [youPass, setYouPass] = useState('');
    const { setUserInfo } = useContext(UserContext);
    const navigate = useNavigate();

    const validateForm = () => {
        if (!youEmail.trim() || !youPass.trim()) {
            alert('이메일과 비밀번호를 모두 입력하세요.');
            return false;
        }
        return true;
    };

    const login = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        const response = await fetch('http://localhost:8880/login', {
            method: 'POST',
            body: JSON.stringify({ youEmail, youPass }),
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
        });

        if (response.ok) {
            response.json().then(userInfo => {
                setUserInfo(userInfo);  // context 할당
                navigate('/');
            });
        } else {
            alert('일치하는 이메일 혹은 비밀번호가 존재하지않습니다.');
        }
    };

    return (
        <section id='login'>
            <h2>로그인</h2>
            <div className='member__inner'>
                <form onSubmit={login}>
                    <fieldset>
                        <legend className='blind'>로그인 영역</legend>
                        <div>
                            <label htmlFor="youEmail" className='blind'>이메일</label>
                            <input
                                type="text"
                                id='youEmail'
                                placeholder='이메일'
                                value={youEmail}
                                onChange={e => setYouEmail(e.target.value)}
                            />
                        </div>
                        <div>
                            <label htmlFor="youPass" className='blind'>비밀번호</label>
                            <input
                                type="password"
                                id='youPass'
                                placeholder='비밀번호'
                                value={youPass}
                                onChange={e => setYouPass(e.target.value)}
                            />
                        </div>
                        <div>
                            <button type="submit">로그인</button>
                        </div>
                    </fieldset>
                </form>
            </div>
        </section>
    );
};

export default LoginPage;
