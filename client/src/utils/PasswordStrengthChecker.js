import React, { useEffect, useState } from 'react';
import '../styles/_PasswordStrengthChecker.scss';

const PasswordStrengthChecker = ({ password, setPasswordValid }) => {
    const [conditionsMet, setConditionsMet] = useState({
        length: false,
        specialChar: false,
        number: false,
    });

    useEffect(() => {
        const length = password.length >= 8;
        const specialChar = /[\W_]/.test(password);
        const number = /\d/.test(password);

        setConditionsMet({ length, specialChar, number });

        const isValid = length && specialChar && number;
        setPasswordValid(isValid);
    }, [password, setPasswordValid]);

    const calculateStrength = () => {
        const metConditions = Object.values(conditionsMet).filter(Boolean).length;
        return (metConditions / 3) * 100;
    };

    return (
        <div className="common_password_strength_check_box">
            <div className="common_password_condition_text_box common_password_condition_first">
                <span className="common_password_condition_icon" style={{ backgroundColor: conditionsMet.length ? 'green' : '#ccc' }}></span>8자 이상 입력
            </div>
            <div className="common_password_condition_text_box common_password_condition_second">
                <span className="common_password_condition_icon" style={{ backgroundColor: conditionsMet.specialChar ? 'green' : '#ccc' }}></span>특수문자 1개 이상의 조합
            </div>
            <div className="common_password_condition_text_box common_password_condition_third">
                <span className="common_password_condition_icon" style={{ backgroundColor: conditionsMet.number ? 'green' : '#ccc' }}></span>최소 1개 이상의 숫자
            </div>
            <div className="common_password_strength_gage_wrapper">
                <p>비밀번호 보안성</p>
                <div className="common_password_strength_gage">
                    <div style={{ width: `${calculateStrength()}%` }}></div>
                </div>
            </div>
        </div>
    );
};

export default PasswordStrengthChecker;
