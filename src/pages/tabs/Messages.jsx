import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Search, Send, User, MessageCircle, Loader, Paperclip } from 'lucide-react';

const MessagesTab = ({ user, initialTarget, onClearTarget }) => {
    const [contacts, setContacts] = useState([]);
    const [activeChat, setActiveChat] = useState(null);
    const [messages, setMessages] = useState([]);
    const [inputValue, setInputValue] = useState('');
    const [isSearching, setIsSearching] = useState(false);
    const [searchResults, setSearchResults] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [loadingMessages, setLoadingMessages] = useState(false);
    
    const messagesEndRef = useRef(null);
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5056';

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        fetchContacts();
        
        // Handle initial target from Students Registry
        if (initialTarget) {
            startChatWithTarget(initialTarget);
        }

        // Poll for new messages every 10 seconds (simplistic real-time)
        const interval = setInterval(() => {
            fetchContacts();
            if (activeChat) fetchMessages(activeChat.other_id);
        }, 10000);

        return () => {
            clearInterval(interval);
            if (onClearTarget) onClearTarget();
        };
    }, []);

    useEffect(() => {
        if (activeChat) {
            fetchMessages(activeChat.other_id);
        }
    }, [activeChat]);

    useEffect(scrollToBottom, [messages]);

    const fetchContacts = async () => {
        try {
            const res = await axios.get(`${API_URL}/api/portal/messages/recent/${user.id}`);
            setContacts(res.data);
        } catch (err) {
            console.error('Failed to fetch contacts:', err);
        }
    };

    const fetchMessages = async (otherId) => {
        try {
            const res = await axios.get(`${API_URL}/api/portal/messages/${user.id}/${otherId}`);
            setMessages(res.data);
        } catch (err) {
            console.error('Failed to fetch messages:', err);
        }
    };

    const startChatWithTarget = (target) => {
        const otherId = target.studentId || target.staffId || target.id;
        const newChat = {
            other_id: otherId,
            name: `${target.firstName} ${target.lastName}`,
            role: target.role || 'student'
        };
        setActiveChat(newChat);
        // If not in contacts, add temporarily or just set active
        if (!contacts.find(c => c.other_id === otherId)) {
            setContacts([newChat, ...contacts]);
        }
    };

    const handleSearch = async (query) => {
        setSearchQuery(query);
        if (query.length < 2) {
            setIsSearching(false);
            setSearchResults([]);
            return;
        }

        setIsSearching(true);
        try {
            // If teacher, search for students. If student, search for staff.
            const endpoint = user.role === 'teacher' ? 'students' : 'staff';
            const res = await axios.get(`${API_URL}/api/portal/${endpoint}/search`, {
                params: { q: query }
            });
            setSearchResults(res.data);
        } catch (err) {
            console.error('Search error:', err);
        }
    };

    const sendMessage = async () => {
        if (!inputValue.trim() || !activeChat) return;

        try {
            const payload = {
                sender_id: user.id,
                receiver_id: activeChat.other_id,
                message: inputValue.trim()
            };
            await axios.post(`${API_URL}/api/portal/messages`, payload);
            setInputValue('');
            fetchMessages(activeChat.other_id);
            fetchContacts();
        } catch (err) {
            console.error('Send error:', err);
        }
    };

    const formatTime = (ts) => {
        const date = new Date(ts);
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    return (
        <div className="animate-in fade-in duration-700 w-full flex gap-8 h-[calc(100vh-140px)] font-inter">
            {/* Sidebar: Contacts & Search */}
            <div className="w-[380px] bg-white rounded-[28px] border border-slate-100 shadow-sm flex flex-col overflow-hidden">
                <div className="p-8 pb-6 border-b border-slate-50">
                    <h2 className="text-xl font-black text-[#1C2B4E] mb-6 tracking-tight">Messages</h2>
                    <div className="relative group">
                        <input
                            type="text"
                            placeholder="Find students or teachers..."
                            value={searchQuery}
                            onChange={(e) => handleSearch(e.target.value)}
                            className="w-full bg-[#F8FAFC] border border-slate-100 rounded-2xl py-3.5 pl-12 pr-4 text-[13px] font-black text-[#1C2B4E] focus:outline-none focus:ring-4 focus:ring-blue-50/50 transition-all placeholder:text-slate-300"
                        />
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#004AAD] transition-colors">
                            <Search size={18} />
                        </div>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto custom-scrollbar px-4 pt-4 pb-8 space-y-1.5">
                    {searchQuery.length >= 2 && searchResults.length > 0 && (
                        <div className="px-4 py-2 border-b border-slate-50 mb-4">
                            <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Search Results</p>
                            {searchResults.map((res) => (
                                <div
                                    key={res.studentId || res.staffId}
                                    onClick={() => { startChatWithTarget({ ...res, role: user.role === 'teacher' ? 'student' : 'teacher' }); setSearchQuery(''); }}
                                    className="mt-2 p-3 hover:bg-blue-50/50 rounded-xl cursor-pointer flex items-center gap-3 transition-all"
                                >
                                    <div className="w-8 h-10 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600 font-black text-[10px]">
                                        {res.firstName[0]}{res.lastName[0]}
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-xs font-black text-[#1C2B4E]">{res.firstName} {res.lastName}</p>
                                        <p className="text-[9px] font-bold text-slate-300 uppercase tracking-tighter">
                                            {res.class || res.department || 'Staff'}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {contacts.length > 0 ? (
                        contacts.map((contact) => (
                            <div
                                key={contact.other_id}
                                onClick={() => setActiveChat(contact)}
                                className={`p-4 rounded-2xl cursor-pointer transition-all flex items-center gap-4 border border-transparent ${activeChat?.other_id === contact.other_id ? 'bg-[#004AAD]/5 border-[#004AAD]/10 shadow-sm' : 'hover:bg-slate-50'}`}
                            >
                                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-sm relative ${activeChat?.other_id === contact.other_id ? 'bg-[#004AAD] text-white' : 'bg-slate-100 text-slate-400'}`}>
                                    <User size={20} />
                                    {contact.is_read === false && contact.sender_id !== user.id && (
                                        <span className="absolute -top-1 -right-1 w-3 h-3 bg-rose-500 border-2 border-white rounded-full"></span>
                                    )}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex justify-between items-start mb-0.5">
                                        <h4 className="text-[14px] font-black text-[#1C2B4E] truncate">{contact.name}</h4>
                                        <span className="text-[9px] font-black text-slate-300 whitespace-nowrap ml-2 uppercase tracking-tighter">
                                            {contact.created_at ? formatTime(contact.created_at) : ''}
                                        </span>
                                    </div>
                                    <p className="text-[12px] truncate pr-4 font-bold text-slate-300 tracking-tight leading-tight">
                                        {contact.message || 'No messages yet'}
                                    </p>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="mt-20 text-center opacity-40 grayscale px-10">
                            <MessageCircle className="mx-auto mb-4" size={40} />
                            <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">No Recent Chats</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Chat Area */}
            <div className="flex-1 bg-white rounded-[28px] border border-slate-100 shadow-sm flex flex-col overflow-hidden relative">
                {activeChat ? (
                    <>
                        {/* Header */}
                        <div className="p-6 px-10 border-b border-slate-50 flex items-center justify-between bg-white/80 backdrop-blur-md z-10 sticky top-0">
                            <div className="flex items-center gap-5">
                                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center text-[#1C2B4E] shadow-sm border border-slate-100/50">
                                    <User size={22} />
                                </div>
                                <div>
                                    <h3 className="text-[16px] font-black text-[#1C2B4E] mb-0.5">{activeChat.name}</h3>
                                    <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.3)]"></div>
                                        <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest leading-none">Online - {activeChat.role}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Messages */}
                        <div className="flex-1 overflow-y-auto p-10 space-y-8 custom-scrollbar bg-[#F8FAFC]/30 flex flex-col">
                            {messages.map((msg, i) => (
                                <div key={i} className={`flex flex-col ${msg.sender_id === user.id ? 'items-end' : 'items-start'} gap-2`}>
                                    <div className={`max-w-[75%] px-6 py-4 rounded-[24px] text-[14px] font-black leading-relaxed shadow-sm ${
                                        msg.sender_id === user.id
                                            ? 'bg-[#004AAD] text-white rounded-tr-none shadow-blue-100/30'
                                            : 'bg-white text-[#1C2B4E] rounded-tl-none border border-slate-50'
                                    }`}>
                                        {msg.message}
                                    </div>
                                    <span className="text-[9px] font-black text-slate-300 mx-2 uppercase tracking-widest flex items-center gap-2">
                                        {formatTime(msg.created_at)}
                                        {msg.sender_id === user.id && (
                                            <CheckCircleIcon />
                                        )}
                                    </span>
                                </div>
                            ))}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input */}
                        <div className="p-8 bg-white border-t border-slate-50">
                            <div className="flex items-center gap-4 max-w-[98%] mx-auto">
                                <button className="w-12 h-12 rounded-2xl bg-slate-50 text-slate-300 flex items-center justify-center hover:bg-slate-100 transition-all active:scale-[0.9]">
                                    <Paperclip size={20} />
                                </button>
                                <div className="flex-1 relative">
                                    <input
                                        type="text"
                                        value={inputValue}
                                        onChange={(e) => setInputValue(e.target.value)}
                                        onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                                        placeholder="Type your message..."
                                        className="w-full bg-[#F8FAFC] border border-slate-100 rounded-2xl py-4.5 pl-6 pr-14 text-[14px] font-black text-[#1C2B4E] focus:outline-none focus:bg-white focus:ring-4 focus:ring-blue-100/20 transition-all placeholder:text-slate-300"
                                    />
                                    <button 
                                        onClick={sendMessage}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-[#004AAD] text-white rounded-xl flex items-center justify-center shadow-lg shadow-blue-100 hover:scale-105 active:scale-95 transition-all"
                                    >
                                        <Send size={18} className="transform -translate-y-0.5 translate-x-0.5" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center space-y-8 opacity-40 grayscale">
                        <div className="w-24 h-24 bg-slate-50 rounded-[40px] flex items-center justify-center text-slate-200 shadow-inner">
                            <MessageCircle size={48} />
                        </div>
                        <div className="text-center">
                            <h3 className="text-[12px] font-black text-[#1C2B4E] uppercase tracking-[0.3em] mb-2">Select a Conversation</h3>
                            <p className="text-[10px] font-bold text-slate-300 tracking-tighter uppercase">Pick a student or teacher from the sidebar to start chatting</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

const CheckCircleIcon = () => (
    <svg className="w-3.5 h-3.5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
);

export default MessagesTab;
