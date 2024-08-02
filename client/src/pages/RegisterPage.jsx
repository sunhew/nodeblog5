import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import PasswordStrengthChecker from '../utils/PasswordStrengthChecker';
import '../styles/_PasswordStrengthChecker.scss';

const RegisterPage = () => {
    const [youName, setYouName] = useState('');
    const [youEmail, setYouEmail] = useState('');
    const [youPass, setYouPass] = useState('');
    const [errors, setErrors] = useState({});
    const [showPasswordChecker, setShowPasswordChecker] = useState(false);
    const [isPasswordValid, setIsPasswordValid] = useState(false);
    const navigate = useNavigate();
    const passwordInputRef = useRef(null);

    const validateForm = () => {
        const newErrors = {};

        if (!youName.trim()) {
            newErrors.youName = '이름을 입력하세요.';
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!youEmail) {
            newErrors.youEmail = '이메일을 입력하세요.';
        } else if (!emailRegex.test(youEmail)) {
            newErrors.youEmail = '유효한 이메일 주소를 입력하세요.';
        }

        if (!isPasswordValid) {
            newErrors.youPass = '비밀번호 조건을 충족하지 않습니다.';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleFocus = () => {
        setShowPasswordChecker(true);
    };

    const handleBlur = () => {
        setTimeout(() => {
            setShowPasswordChecker(false);
        }, 200);
    };

    const register = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        try {
            const response = await fetch('http://localhost:8880/register', {
                method: 'POST',
                body: JSON.stringify({ youName, youEmail, youPass }),
                headers: { 'Content-Type': 'application/json' },
            });

            const responseData = await response.json();
            console.log('response data:', responseData);

            if (response.status === 200) {
                alert("회원가입 완료");
                navigate('/login');
            } else {
                alert(`회원가입 실패: ${responseData.message}`);
            }
        } catch (error) {
            console.error('Error:', error);
            alert('회원가입 요청 중 오류가 발생했습니다.');
        }
    };

    return (
        <section id='login'>
            <h2>회원가입</h2>
            <div className='member__inner'>
                <form onSubmit={register}>
                    <fieldset>
                        <legend className='blind'>회원가입 영역</legend>
                        <div>
                            <label htmlFor="youName" className='blind'>이름</label>
                            <input
                                type="text"
                                id='youName'
                                placeholder='이름'
                                value={youName}
                                onChange={e => {
                                    setYouName(e.target.value);
                                    setErrors(prev => ({ ...prev, youName: '' }));
                                }}
                            />
                            {errors.youName && <span className='msg'>{errors.youName}</span>}
                        </div>
                        <div>
                            <label htmlFor="youEmail" className='blind'>이메일</label>
                            <input
                                type="email"
                                id='youEmail'
                                placeholder='이메일'
                                value={youEmail}
                                onChange={e => {
                                    setYouEmail(e.target.value);
                                    setErrors(prev => ({ ...prev, youEmail: '' }));
                                }}
                            />
                            {errors.youEmail && <span className='msg'>{errors.youEmail}</span>}
                        </div>
                        <div style={{ position: 'relative' }} ref={passwordInputRef}>
                            <label htmlFor="youPass" className='blind'>비밀번호</label>
                            <input
                                type="password"
                                id='youPass'
                                placeholder='비밀번호'
                                value={youPass}
                                onFocus={handleFocus}
                                onBlur={handleBlur}
                                onChange={e => {
                                    setYouPass(e.target.value);
                                    setErrors(prev => ({ ...prev, youPass: '' }));
                                }}
                            />
                            {errors.youPass && <span className='msg'>{errors.youPass}</span>}
                            {showPasswordChecker && <PasswordStrengthChecker password={youPass} setPasswordValid={setIsPasswordValid} />}
                        </div>
                        <div>
                            <button type="submit">회원가입</button>
                        </div>
                    </fieldset>
                </form>
            </div>
        </section>
    );
};

export default RegisterPage;
