import React, { useState, useEffect } from 'react';
import LoginPage from './pages/Login';
import Sidebar from './components/Sidebar';
import DashboardTab from './pages/tabs/Dashboard';
import AttendanceTab from './pages/tabs/Attendance';
import TransportTab from './pages/tabs/Transport';
import ResultsTab from './pages/tabs/Results';
import TimetableTab from './pages/tabs/Timetable';
import FeesTab from './pages/tabs/Fees';
import HomeworkTab from './pages/tabs/Homework';
import AnnouncementsTab from './pages/tabs/Announcements';
import MessagesTab from './pages/tabs/Messages';
import DocumentsTab from './pages/tabs/Documents';

// Teacher Tabs
import TeacherDashboard from './pages/teacher/TeacherDashboard';
import MyClasses from './pages/teacher/MyClasses';
import MarkAttendance from './pages/teacher/MarkAttendance';
import ExamsMarks from './pages/teacher/ExamsMarks';
import AssignHomework from './pages/teacher/AssignHomework';
import TeacherTimetable from './pages/teacher/TeacherTimetable';
import Library from './pages/teacher/Library';
import Reports from './pages/teacher/Reports';
import StudentsRegistry from './pages/teacher/StudentsRegistry';
import LeaveRequests from './pages/teacher/LeaveRequests';

function App() {
    const [user, setUser] = useState(null);
    const [activeTab, setActiveTab] = useState('dashboard');
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [showLogoutModal, setShowLogoutModal] = useState(false);

    // Check for saved session
    useEffect(() => {
        const savedUser = localStorage.getItem('user');
        if (savedUser) {
            setUser(JSON.parse(savedUser));
        }
    }, []);

    const handleLogin = (userData) => {
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
    };

    const handleLogout = () => {
        setUser(null);
        localStorage.removeItem('user');
        setActiveTab('dashboard');
        setShowLogoutModal(false);
    };

    if (!user) {
        return <LoginPage onLogin={handleLogin} />;
    }

    const renderContent = () => {
        // Teacher Specific Views
        if (user.role === 'teacher') {
            switch (activeTab) {
                case 'dashboard':
                    return <TeacherDashboard user={user} />;
                case 'classes':
                    return <MyClasses />;
                case 'attendance_mark':
                    return <MarkAttendance />;
                case 'exams':
                    return <ExamsMarks />;
                case 'homework_assign':
                    return <AssignHomework />;
                case 'timetable':
                    return <TeacherTimetable />;
                case 'students':
                    return <StudentsRegistry />;
                case 'library':
                    return <Library />;
                case 'messages':
                    return <MessagesTab user={user} />;
                case 'documents':
                    return <DocumentsTab />;
                case 'reports':
                    return <Reports />;
                case 'leaves':
                    return <LeaveRequests />;
                case 'settings':
                    return (
                        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
                            <div className="w-20 h-20 bg-blue-50 rounded-3xl flex items-center justify-center text-[#004AAD] mb-6">
                                <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 15a3 3 0 100-6 3 3 0 000 6z" />
                                </svg>
                            </div>
                            <h2 className="text-2xl font-black text-[#1C2B4E] mb-2">Profile Settings</h2>
                            <p className="text-slate-400 max-w-sm font-bold">Personal information and preference management coming soon.</p>
                        </div>
                    );
            }
        }

        // Parent/Student Specific Views
        switch (activeTab) {
            case 'dashboard':
                return <DashboardTab user={user} onTabChange={setActiveTab} />;
            case 'attendance':
                return <AttendanceTab />;
            case 'results':
                return <ResultsTab />;
            case 'timetable':
                return <TimetableTab />;
            case 'homework':
                return <HomeworkTab />;
            case 'announcements':
                return <AnnouncementsTab />;
            case 'messages':
                return <MessagesTab />;
            case 'documents':
                return <DocumentsTab />;
            case 'fees':
                return <FeesTab />;
            case 'transport':
                return <TransportTab />;
            default:
                return (
                    <div className="flex flex-col items-center justify-center h-[60vh] text-center">
                        <div className="w-20 h-20 bg-slate-100 rounded-3xl flex items-center justify-center text-slate-300 mb-6">
                            <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                            </svg>
                        </div>
                        <h2 className="text-2xl font-black text-secondary mb-2">{activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Coming Soon</h2>
                        <p className="text-accent max-w-sm">We're currently porting this feature to the desktop experience. Stay tuned!</p>
                    </div>
                );
        }
    };

    return (
        <div className="min-h-screen bg-[#F8FAFC] flex selection:bg-primary selection:text-white">
            <Sidebar
                activeTab={activeTab}
                onTabChange={setActiveTab}
                user={user}
                isOpen={isSidebarOpen}
                setIsOpen={setIsSidebarOpen}
            />

            <main className={`flex-1 transition-all duration-300 ${isSidebarOpen ? 'ml-64' : 'ml-0'} min-h-screen flex flex-col`}>
                {/* Global Header - Refined with Glassmorphism */}
                <header className="sticky top-0 z-30 flex justify-between items-center px-10 py-4 glass border-b border-white/20 shadow-[0_1px_3px_0_rgba(0,0,0,0.02)] transition-all duration-300">
                    <div className="flex items-center gap-8">
                        {!isSidebarOpen && (
                            <button
                                onClick={() => setIsSidebarOpen(true)}
                                className="p-2.5 bg-[#004AAD] text-white rounded-xl shadow-lg shadow-blue-100 hover:scale-105 active:scale-95 transition-all"
                            >
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 6h16M4 12h16M4 18h16" />
                                </svg>
                            </button>
                        )}

                        {user.role === 'parent' && (
                            <div className="flex items-center gap-4">
                                <div className="flex flex-col">
                                    <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-0.5 ml-1">Student</span>
                                    <div className="flex items-center gap-4 px-4 py-2 bg-white/50 rounded-xl border border-slate-100/50 group cursor-pointer hover:bg-white transition-all shadow-sm">
                                        <div className="w-6 h-6 rounded-lg bg-blue-50 flex items-center justify-center">
                                            <span className="text-[10px] font-black text-[#004AAD]">A</span>
                                        </div>
                                        <span className="text-[13px] font-bold text-[#1C2B4E]">Aaryan</span>
                                        <svg className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-600 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </div>
                                </div>
                            </div>
                        )}

                        {user.role === 'teacher' && activeTab === 'dashboard' && (
                            <h2 className="text-[20px] font-black text-[#1C2B4E] tracking-tight">Good Morning, Mrs. Priya Das!</h2>
                        )}

                        {user.role === 'teacher' && activeTab === 'classes' && (
                            <h2 className="text-[20px] font-black text-[#1C2B4E] tracking-tight">My Classes</h2>
                        )}

                        {user.role === 'teacher' && activeTab === 'attendance_mark' && (
                            <div className="flex items-center gap-6">
                                <h2 className="text-[20px] font-black text-[#1C2B4E] tracking-tight">Attendance</h2>
                                <div className="flex items-center gap-3">
                                    <span className="text-[12px] font-bold text-slate-300 uppercase tracking-tight">Class</span>
                                    <div className="relative group">
                                        <select className="bg-white border border-slate-100 text-[#1C2B4E] px-4 py-2 rounded-xl font-black text-[13px] focus:outline-none focus:ring-4 focus:ring-blue-50 transition-all appearance-none cursor-pointer shadow-sm pr-9 min-w-[120px]">
                                            <option>10 - A</option>
                                            <option>10 - B</option>
                                            <option>12 - C</option>
                                        </select>
                                        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 group-hover:text-[#004AAD] transition-colors">
                                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                                            </svg>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {user.role === 'teacher' && activeTab === 'exams' && (
                            <div className="flex items-center gap-6">
                                <h2 className="text-[20px] font-black text-[#1C2B4E] tracking-tight">Exams & Marks</h2>
                                <div className="flex items-center gap-3">
                                    <span className="text-[12px] font-bold text-slate-300 uppercase tracking-tight">Class</span>
                                    <div className="relative group">
                                        <select className="bg-white border border-slate-100 text-[#1C2B4E] px-4 py-2 rounded-xl font-black text-[13px] focus:outline-none focus:ring-4 focus:ring-blue-50 transition-all appearance-none cursor-pointer shadow-sm pr-9 min-w-[120px]">
                                            <option>10 - A</option>
                                            <option>10 - B</option>
                                            <option>12 - C</option>
                                        </select>
                                        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 group-hover:text-[#004AAD] transition-colors">
                                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                                            </svg>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {user.role === 'teacher' && activeTab === 'homework_assign' && (
                            <h2 className="text-[20px] font-black text-[#1C2B4E] tracking-tight">Homework</h2>
                        )}

                        {user.role === 'teacher' && activeTab === 'timetable' && (
                            <h2 className="text-[20px] font-black text-[#1C2B4E] tracking-tight">TimeTable</h2>
                        )}

                        {user.role === 'teacher' && activeTab === 'library' && (
                            <h2 className="text-[20px] font-black text-[#1C2B4E] tracking-tight">Library</h2>
                        )}

                        {user.role === 'teacher' && activeTab === 'messages' && (
                            <h2 className="text-[20px] font-black text-[#1C2B4E] tracking-tight">Messages</h2>
                        )}

                        {user.role === 'teacher' && activeTab === 'documents' && (
                            <h2 className="text-[20px] font-black text-[#1C2B4E] tracking-tight">Documents</h2>
                        )}

                        {user.role === 'teacher' && activeTab === 'reports' && (
                            <h2 className="text-[20px] font-black text-[#1C2B4E] tracking-tight">Reports</h2>
                        )}

                        {user.role === 'teacher' && activeTab === 'students' && (
                            <h2 className="text-[20px] font-black text-[#1C2B4E] tracking-tight">Students</h2>
                        )}
                    </div>

                    <div className="flex items-center gap-8">
                        <button className="relative p-2 text-slate-400 hover:text-[#004AAD] transition-all hover:bg-blue-50 rounded-xl group">
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                            </svg>
                            <span className="absolute top-2 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white group-hover:scale-110 transition-transform"></span>
                        </button>

                        <div className="h-8 w-[1px] bg-slate-100"></div>

                        <div className="flex items-center gap-4">
                            <div className="flex flex-col items-end text-right">
                                <span className="text-[12px] font-extrabold text-[#1C2B4E] leading-none">{user.name}</span>
                                <span className="text-[10px] font-bold text-slate-300 uppercase tracking-tight mt-1">{user.role}</span>
                            </div>
                            <div className="w-10 h-10 bg-gradient-to-br from-[#004AAD] to-[#003991] rounded-2xl flex items-center justify-center text-white font-black text-sm shadow-lg shadow-blue-100 cursor-pointer hover:scale-105 active:scale-95 transition-all">
                                {user.name[0]}
                            </div>
                            <button
                                onClick={() => setShowLogoutModal(true)}
                                className="ml-2 w-9 h-9 flex items-center justify-center text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                                title="Logout"
                            >
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </header>

                {/* Main Content Area */}
                <section className="p-10 flex-1 overflow-y-auto custom-scrollbar page-transition">
                    <div className="max-w-[1400px] mx-auto">
                        {renderContent()}
                    </div>
                </section>
            </main>

            {/* Logout Confirmation Modal */}
            {showLogoutModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 animate-in fade-in duration-300">
                    {/* Backdrop */}
                    <div
                        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
                        onClick={() => setShowLogoutModal(false)}
                    ></div>

                    {/* Modal Card */}
                    <div className="bg-white w-full max-w-[400px] rounded-[32px] shadow-2xl relative z-10 p-10 animate-in zoom-in-95 duration-300 text-center border border-white/20">
                        <div className="w-20 h-20 bg-rose-50 rounded-3xl flex items-center justify-center text-rose-500 mx-auto mb-8 shadow-sm">
                            <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                            </svg>
                        </div>

                        <h3 className="text-[22px] font-black text-[#1C2B4E] mb-3 tracking-tight">Logout</h3>
                        <p className="text-slate-400 font-bold mb-10 leading-relaxed px-4">
                            Are you sure you want to <span className="text-rose-500">logout</span> from the school portal?
                        </p>

                        <div className="grid grid-cols-2 gap-4">
                            <button
                                onClick={() => setShowLogoutModal(false)}
                                className="py-4 rounded-2xl bg-slate-50 text-slate-400 font-black text-[14px] hover:bg-slate-100 transition-all active:scale-[0.98]"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleLogout}
                                className="py-4 rounded-2xl bg-[#004AAD] text-white font-black text-[14px] shadow-lg shadow-blue-100/50 hover:bg-[#003991] transition-all active:scale-[0.98]"
                            >
                                Yes, Logout
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Global CSS for scrollbars */}
            <style dangerouslySetInnerHTML={{
                __html: `
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #F8FAFC;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #E2E8F0;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #CBD5E1;
        }
      `}} />
        </div>
    );
}

export default App;
