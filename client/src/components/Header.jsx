import React, { useContext, useEffect, useState, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { UserContext } from '../context/userContext';
import { navLists } from '../constants';

const Header = () => {
    const { userInfo, setUserInfo } = useContext(UserContext); // UserContext를 사용하여 사용자 정보를 가져옴
    const [isProfileOpen, setIsProfileOpen] = useState(false); // 프로필 창 열림/닫힘 상태를 관리하는 상태 변수
    const [isDarkMode, setIsDarkMode] = useState(() => {
        const savedMode = localStorage.getItem('darkMode'); // 로컬 스토리지에서 다크 모드 상태를 불러옴
        return savedMode ? JSON.parse(savedMode) : false; // 저장된 상태가 있으면 불러오고, 없으면 기본값 false 사용
    });
    const profileRef = useRef(null); // 프로필 요소를 참조하기 위한 Ref 객체
    const location = useLocation(); // 현재 라우터 위치를 가져옴

    useEffect(() => {
        // 서버에서 사용자 프로필 정보를 가져와서 UserContext에 설정
        fetch('http://localhost:8880/profile', {
            credentials: 'include',
        }).then(response => {
            response.json().then(userInfo => {
                setUserInfo(userInfo);
            });
        });
    }, [setUserInfo]);

    useEffect(() => {
        // 프로필 외부 클릭 시 프로필 창을 닫음
        const handleClickOutside = (event) => {
            if (profileRef.current && !profileRef.current.contains(event.target)) {
                setIsProfileOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    useEffect(() => {
        // 라우터 위치가 변경될 때 프로필 창을 닫음
        setIsProfileOpen(false);
    }, [location]);

    useEffect(() => {
        // 다크 모드 상태에 따라 body 클래스 조절
        if (isDarkMode) {
            document.body.classList.add('dark-mode');
        } else {
            document.body.classList.remove('dark-mode');
        }
    }, [isDarkMode]);

    const logout = () => {
        // 로그아웃 요청을 서버로 보내고 성공하면 사용자 정보를 null로 설정
        fetch('http://localhost:8880/logout', {
            credentials: 'include',
            method: 'POST'
        }).then(response => {
            if (response.ok) {
                setUserInfo(null);
                alert("로그아웃이 되었습니다.");
                setIsProfileOpen(false);
            } else {
                alert("로그아웃에 실패했습니다.");
            }
        });
    }

    const toggleProfile = (e) => {
        e.preventDefault();
        setIsProfileOpen(!isProfileOpen); // 프로필 창 열림/닫힘 토글
    }

    const toggleDarkMode = () => {
        const newMode = !isDarkMode; // 다크 모드 상태 토글
        setIsDarkMode(newMode);
        localStorage.setItem('darkMode', JSON.stringify(newMode)); // 새로운 다크 모드 상태를 로컬 스토리지에 저장
        document.body.classList.toggle('dark-mode', newMode); // body 클래스도 업데이트
    }

    return (
        <header id='header'>
            <div className='header__inner container'>
                <h1 className='logo'>
                    <Link to='/'>websloper</Link>
                </h1>

                <nav className='nav'>
                    <ul>
                        {navLists.map((nav, key) => (
                            <li key={key}><Link to={nav.src}>{nav.title}</Link></li>
                        ))}
                    </ul>
                </nav>

                <div className='utils'>
                    <button className='search'>
                        <span className='blind'>search</span>
                    </button>
                    <button className={isDarkMode ? 'sun' : 'dark'} onClick={toggleDarkMode}>
                        {/* 다크 모드 상태에 따라 아이콘 변경 */}
                        <img src={isDarkMode ? process.env.PUBLIC_URL + '/svg/dark.svg' : process.env.PUBLIC_URL + '/svg/sunny.svg'} alt="Mode Icon" className="dark-mode-icon" />
                    </button>
                    <button className='navBtn'>
                        <span className='blind'>nav</span>
                    </button>
                    {userInfo?.youName && (
                        <span className='face' onClick={toggleProfile}></span>
                    )}

                    {isProfileOpen && (
                        <div className='profile' ref={profileRef}>
                            <ul>
                                <li className='profile-id'>{userInfo.youName}</li>
                                <li className='profile-email'>{userInfo.youEmail}</li>
                                <span className='profile-logout' onClick={logout}>
                                    <span className='blind' onClick={logout}>logout</span>
                                </span>
                            </ul>
                            <ul>
                                <li><a href='/'>프로필</a></li>
                                <li><a href='/'>내가 쓴글</a></li>
                                <li><a href='/'>댓글</a></li>
                            </ul>
                            <ul>
                                <li><Link to="/boardWrite">게시판 글쓰기</Link></li>
                            </ul>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
}

export default Header;
