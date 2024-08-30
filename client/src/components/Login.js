import React, { useState } from 'react';
import axios from 'axios';
import './Login.css';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [otp, setOtp] = useState('');
    const [showOtpField, setShowOtpField] = useState(false);
    const [isRegistering, setIsRegistering] = useState(false);

    const handleLogin = async () => {
        try {
            const response = await axios.post(
                'http://localhost:3001/auth/login',
                {
                    email,
                    password
                }
            );

            if (response.data.success) {
                setShowOtpField(true);
                alert('A one time passcode has been sent to your email. Check your inbox.')   
            } else {
                alert(response.data.message);
            }
        } catch (error) {
            console.log('hi');
            console.error('Error during login:', error.message);
            alert('An error has occurred during login.');
        }
    };

    const handleRegister = async () => {
        try {
            const response = await axios.post('http://localhost:3001/auth/register',
            {
                email,
                password
            }
        );

        if (response.data.success) {
            alert('User registered successfully.');
            setIsRegistering(false);
        } else {
            alert(response.data.message);
        }
    } catch (error) {
        console.error('Error during registration:', error.message);
        alert('An error occurred during registration.');
        }
    };

    const handleOtpVerification = async () => {
        try {
            const otpResponse = await axios.post('http://localhost:3001/auth/verify-otp',
            {
                otp
            }
        );

            if (otpResponse.data.success) {
                alert('One time passcode verified. User logged in.');
                //Redirect to dashboard or perform post-login actions
            } else {
                alert('Invalid OTP. Please try again.');
            }
        } catch (error) {
            console.error('Error during OTP verification:', error.message);
            alert('An error occurred during OTP verification.');
        }
    };

    return (
        <div className='login-container'>
            {isRegistering ? (
                <>
                    <input type='email' 
                        placeholder='Email' 
                        onChange={(e) => setEmail(e.target.value)} />
                    <input type='password' 
                        placeholder='Password'
                        onChange={(e) => setPassword(e.target.value)} />
                    <button className='login-button' onClick={handleRegister}>Register</button>
                    <button className='login-button' onClick={() => setIsRegistering(false)}>Back to Login</button>
                </>
            ) : (
                <>
                    <input type='email' 
                        placeholder='Email' 
                        onChange={(e) => setEmail(e.target.value)} />
                    <input type='password' 
                        placeholder='Password'
                        onChange={(e) => setPassword(e.target.value)} />
                    {showOtpField && (
                        <>
                            <input type='text' 
                                placeholder='OTP'
                                onChange={(e) => setOtp(e.target.value)} />
                            <button className='login-button' onClick={handleOtpVerification}>Verify OTP</button>
                        </>
                    )}
                    <button className='login-button' onClick={handleLogin}>Login</button>
                    <button className='login-button' onClick={() => setIsRegistering(true)}>Register</button>
                </>
            )}
        </div>
    );
};

export default Login;