import React, { useState } from 'react';
import { AppConstants } from '../utils/constants';
import loginBg from '../assets/login.png';
import schoolLogo from '../assets/logo.png';

import { portalAPI } from '../services/api';

const LoginPage = ({ onLogin }) => {
    const [role, setRole] = useState('parent'); // 'parent' (for student) or 'teacher'
    const [loginId, setLoginId] = useState('');
    const [dob, setDob] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = await portalAPI.login({
                id: loginId,
                dob: dob,
                role: role === 'parent' ? 'student' : 'teacher'
            });

            const { token, user } = response.data;
            
            // Save session
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(user));
            
            onLogin(user);
        } catch (err) {
            console.error('Login failed:', err);
            setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="h-screen w-screen flex bg-white font-sans overflow-hidden">
            {/* Left Side - Login Form */}
            <div className="w-1/2 flex items-center justify-center p-8">
                <div className="max-w-[420px] w-full px-6">
                    {/* Centered Heading with specific styling */}
                    <h1 className="text-[36px] font-[900] text-[#004AAD] text-center mb-10 tracking-tight">
                        Login
                    </h1>

                    {/* Role Toggles - Styled precisely like the image */}
                    <div className="flex mb-10 overflow-hidden border-[1.5px] border-[#004AAD] rounded-xl shadow-sm">
                        <button
                            onClick={() => setRole('parent')}
                            type="button"
                            className={`flex-1 py-3.5 text-[15px] font-[700] transition-all ${role === 'parent' ? 'bg-[#004AAD] text-white' : 'bg-white text-[#004AAD]'}`}
                        >
                            Student
                        </button>
                        <button
                            onClick={() => setRole('teacher')}
                            type="button"
                            className={`flex-1 py-3.5 text-[15px] font-[700] transition-all ${role === 'teacher' ? 'bg-[#004AAD] text-white' : 'bg-white text-[#004AAD]'}`}
                        >
                            Teacher
                        </button>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-8">
                        <div className="space-y-2.5">
                            <label className="block text-sm font-[700] text-[#2D3748] ml-0.5">
                                {role === 'teacher' ? 'Staff ID' : 'Student ID'}
                            </label>
                            <input
                                type="text"
                                value={loginId}
                                onChange={(e) => setLoginId(e.target.value)}
                                placeholder={role === 'teacher' ? 'STF-XXXXXX' : 'STU-XXXXXX'}
                                required
                                className="w-full bg-[#EBF4FF] border-none rounded-[18px] p-4 focus:ring-2 focus:ring-[#004AAD]/20 transition-all placeholder:text-[#2D3748]/40 outline-none text-[#2D3748] font-[500] text-[15px]"
                            />
                        </div>

                        <div className="space-y-2.5">
                            <label className="block text-sm font-[700] text-[#2D3748] ml-0.5">Date of Birth (Password)</label>
                            <div className="relative">
                                <input
                                    type="password"
                                    value={dob}
                                    onChange={(e) => setDob(e.target.value)}
                                    placeholder="YYYY-MM-DD"
                                    required
                                    className="w-full bg-[#EBF4FF] border-none rounded-[18px] p-4 focus:ring-2 focus:ring-[#004AAD]/20 transition-all outline-none text-[#2D3748] font-[500] text-[15px]"
                                />
                            </div>
                        </div>

                        {error && (
                            <p className="text-red-500 text-xs font-bold pl-1 animate-pulse">{error}</p>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-3/4 mx-auto bg-[#004AAD] hover:bg-[#003d8f] text-white font-[800] py-3 rounded-full shadow-xl shadow-[#004AAD]/20 transition-all flex items-center justify-center gap-2 disabled:opacity-70 text-[17px] mt-8"
                        >
                            {loading ? (
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                            ) : (
                                "Login"
                            )}
                        </button>
                    </form>
                </div>
            </div>

            {/* Right Side - Classroom Background Overlay */}
            <div className="hidden lg:block w-1/2 relative h-full">
                <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{ backgroundImage: `url(${loginBg})` }}
                >
                    <div className="absolute inset-0 bg-[#004AAD]/50 backdrop-blur-[1px]"></div>
                </div>

                <div className="relative z-10 h-full flex flex-col items-center justify-center text-white text-center p-12">
                    <div className="bg-white p-5 rounded-[24px] shadow-2xl mb-8">
                        <img
                            src={schoolLogo}
                            alt="School Logo"
                            className="w-24 h-auto"
                        />
                    </div>

                    <h2 className="text-[48px] font-[900] tracking-tight text-white mb-2 leading-tight">
                        X'an Matriculation School
                    </h2>

                    <div className="absolute bottom-6 right-8 text-white/50 text-[10px] font-bold">
                        © 2026 XAN CONNECT DIGITAL CAMPUS
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
