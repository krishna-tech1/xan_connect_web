import React, { useState } from 'react';

/**
 * MessagesTab Component
 * 
 * A high-fidelity, premium messaging interface for the School Portal.
 * Supports both Teacher and Parent views with role-appropriate dummy data and interaction.
 */
const MessagesTab = ({ user }) => {
    const isTeacher = user?.role === 'teacher';
    const [activeChatId, setActiveChatId] = useState(0);

    // Dummy contacts based on user role
    const contacts = isTeacher ? [
        { id: 0, name: 'Mrs. Sharma', sub: 'Parent of Aryan Sharma (10-A)', lastMsg: 'I have checked the assignment.', time: '10:30 am', unread: 0, avatar: 'AS' },
        { id: 1, name: 'Mr. Kapoor', sub: 'Parent of Rohit Kapoor (10-B)', lastMsg: 'Is the science fair date confirmed?', time: 'Yesterday', unread: 1, avatar: 'RK' },
        { id: 2, name: 'Mrs. Gupta', sub: 'Parent of Ishaan Gupta (12-C)', lastMsg: 'Ishaan will be late today.', time: '09:15 am', unread: 0, avatar: 'IG' },
        { id: 3, name: 'School Admin', sub: 'Office Department', lastMsg: 'Meeting scheduled at 4 PM.', time: 'Monday', unread: 0, avatar: 'AD' },
    ] : [
        { id: 0, name: 'Mrs. Priya Das', sub: 'Class Teacher (10-A)', lastMsg: 'Good morning! Please check the progress report.', time: '10:30 am', unread: 0, avatar: 'PD' },
        { id: 1, name: 'Mr. Rajiv Menon', sub: 'Science HOD', lastMsg: 'The lab manuals are ready.', time: 'Yesterday', unread: 1, avatar: 'RM' },
        { id: 2, name: 'Ms. Sarah Khan', sub: 'Maths Teacher', lastMsg: 'Assignment due on Friday.', time: 'Monday', unread: 0, avatar: 'SK' },
        { id: 3, name: 'School Admin', sub: 'Office Department', lastMsg: 'Your fee receipt is generated.', time: 'Feb 20', unread: 0, avatar: 'AD' },
    ];

    const messageThreads = {
        0: [
            { id: 1, text: "Good morning! Just wanted to follow up on the latest assignment submission.", sender: 'them', time: '10:15 am' },
            { id: 2, text: "Hello! I have checked the assignment. Most of it is correct, but he needs to focus on trigonometry.", sender: 'me', time: '10:20 am' },
            { id: 3, text: "I have shared some practice sheets with him. Please ensure he completes them by Sunday.", sender: 'me', time: '10:25 am' },
            { id: 4, text: "Thank you so much! I will make sure he sits with them today. I have checked the assignment.", sender: 'them', time: '10:30 am' },
        ],
        1: [
            { id: 1, text: "Is the science fair date confirmed for next month?", sender: 'them', time: 'Yesterday' },
            { id: 2, text: "Yes, it is scheduled for the 15th of March.", sender: 'me', time: 'Yesterday' },
        ]
    };

    const activeMessages = messageThreads[activeChatId] || [];
    const activeContact = contacts.find(c => c.id === activeChatId) || contacts[0];

    return (
        <div className="animate-in fade-in duration-700 w-full flex gap-8 h-[calc(100vh-140px)] font-inter">
            {/* Contact List */}
            <div className="w-[380px] bg-white rounded-[28px] border border-slate-100 shadow-sm flex flex-col overflow-hidden">
                <div className="p-8 pb-4">
                    <h2 className="text-xl font-black text-[#1C2B4E] mb-6">Messages</h2>
                    <div className="relative group">
                        <input
                            type="text"
                            placeholder="Search contacts..."
                            className="w-full bg-[#F8FAFC] border border-slate-100 rounded-2xl py-3.5 pl-12 pr-4 text-[13px] font-black text-[#1C2B4E] focus:outline-none focus:ring-4 focus:ring-blue-50/50 transition-all"
                        />
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#004AAD] transition-colors">
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto custom-scrollbar px-4 pb-8 space-y-1">
                    {contacts.map((contact) => (
                        <div
                            key={contact.id}
                            onClick={() => setActiveChatId(contact.id)}
                            className={`p-4 rounded-2xl cursor-pointer transition-all flex items-center gap-4 border border-transparent ${activeChatId === contact.id ? 'bg-[#004AAD]/5 border-[#004AAD]/10' : 'hover:bg-slate-50'
                                }`}
                        >
                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-[13px] font-black shadow-sm ${activeChatId === contact.id ? 'bg-[#004AAD] text-white' : 'bg-slate-100 text-[#1C2B4E]'
                                }`}>
                                {contact.avatar}
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex justify-between items-start mb-0.5">
                                    <h4 className="text-[14px] font-black text-[#1C2B4E] truncate">{contact.name}</h4>
                                    <span className="text-[10px] font-black text-slate-300 whitespace-nowrap ml-2 uppercase tracking-tighter">{contact.time}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <p className={`text-[12px] truncate pr-4 ${contact.unread > 0 ? 'font-black text-[#004AAD]' : 'font-bold text-slate-300 uppercase tracking-tighter'}`}>
                                        {contact.lastMsg}
                                    </p>
                                    {contact.unread > 0 && (
                                        <span className="w-5 h-5 bg-[#004AAD] text-white text-[10px] font-black rounded-lg flex items-center justify-center shadow-lg shadow-blue-100 italic">
                                            {contact.unread}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Active Messaging Area */}
            <div className="flex-1 bg-white rounded-[28px] border border-slate-100 shadow-sm flex flex-col overflow-hidden">
                {/* Chat Header */}
                <div className="p-6 px-10 border-b border-slate-50 flex items-center justify-between bg-white z-10">
                    <div className="flex items-center gap-5">
                        <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center text-[13px] font-black text-[#1C2B4E] shadow-sm border border-slate-100/50">
                            {activeContact.avatar}
                        </div>
                        <div>
                            <h3 className="text-[16px] font-black text-[#1C2B4E] mb-0.5">{activeContact.name}</h3>
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
                                <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest leading-none">{activeContact.sub}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Messages Container */}
                <div className="flex-1 overflow-y-auto p-10 space-y-8 custom-scrollbar bg-[#F8FAFC]/30">
                    <div className="flex justify-center">
                        <span className="px-6 py-2 bg-white border border-slate-100 rounded-full text-[10px] font-black text-slate-300 uppercase tracking-widest shadow-sm">
                            Session Started • Today
                        </span>
                    </div>

                    {activeMessages.map((msg, i) => (
                        <div key={i} className={`flex flex-col ${msg.sender === 'me' ? 'items-end' : 'items-start'} gap-2`}>
                            <div className={`max-w-[80%] px-6 py-4 rounded-[22px] text-[14px] font-black leading-relaxed shadow-sm ${msg.sender === 'me'
                                    ? 'bg-[#004AAD] text-white rounded-tr-none shadow-blue-100/40'
                                    : 'bg-white text-[#1C2B4E] rounded-tl-none border border-slate-50'
                                }`}>
                                {msg.text}
                            </div>
                            <span className="text-[10px] font-black text-slate-300 mx-2 uppercase tracking-widest flex items-center gap-2">
                                {msg.time}
                                {msg.sender === 'me' && (
                                    <svg className="w-3.5 h-3.5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                    </svg>
                                )}
                            </span>
                        </div>
                    ))}
                </div>

                {/* Modern Premium Input Area */}
                <div className="p-10 bg-white border-t border-slate-50">
                    <div className="flex items-center gap-6 max-w-[95%] mx-auto">
                        <button className="w-12 h-12 rounded-2xl bg-slate-50 text-slate-400 flex items-center justify-center hover:bg-[#004AAD]/5 hover:text-[#004AAD] transition-all">
                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                            </svg>
                        </button>
                        <div className="flex-1 relative">
                            <input
                                type="text"
                                placeholder="Write your response here..."
                                className="w-full bg-[#F8FAFC] border border-slate-100 rounded-2xl py-4.5 pl-6 pr-12 text-[14px] font-black text-[#1C2B4E] focus:outline-none focus:ring-4 focus:ring-blue-50/50 focus:bg-white transition-all shadow-sm"
                            />
                            <button className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-[#004AAD] text-white rounded-xl flex items-center justify-center shadow-lg shadow-blue-100 hover:scale-105 active:scale-95 transition-all">
                                <svg className="w-4 h-4 rotate-45 transform translate-x-[-1px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MessagesTab;
