import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Search, Send, User, MessageCircle, Loader, Paperclip, Trash2, CheckCheck } from 'lucide-react';

const MessagesTab = ({ user, initialTarget, onClearTarget }) => {
    const [contacts, setContacts] = useState([]);
    const [activeChat, setActiveChat] = useState(null);
    const [messages, setMessages] = useState([]);
    const [inputValue, setInputValue] = useState('');
    const [isSearching, setIsSearching] = useState(false);
    const [searchResults, setSearchResults] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    
    const messagesEndRef = useRef(null);
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5056';

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        fetchContacts();
        
        if (initialTarget) {
            startChatWithTarget(initialTarget);
        }

        const interval = setInterval(() => {
            fetchContacts();
            if (activeChat) fetchMessages(activeChat.other_id);
        }, 8000);

        return () => {
            clearInterval(interval);
            if (onClearTarget) onClearTarget();
        };
    }, []);

    useEffect(() => {
        if (activeChat) {
            fetchMessages(activeChat.other_id);
            markAsRead(activeChat.other_id);
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

    const markAsRead = async (otherId) => {
        try {
            await axios.patch(`${API_URL}/api/portal/messages/read/${user.id}/${otherId}`);
            fetchContacts();
        } catch (err) {
            console.error('Read receipt error:', err);
        }
    };

    const deleteMessage = async (msgId) => {
        if (!window.confirm('Delete this message for everyone?')) return;
        try {
            await axios.delete(`${API_URL}/api/portal/messages/${msgId}`);
            if (activeChat) fetchMessages(activeChat.other_id);
        } catch (err) {
            alert('Failed to delete message');
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
        if (!contacts.find(c => c.other_id === otherId)) {
            setContacts([newChat, ...contacts]);
        }
    };

    const handleSearch = async (query) => {
        setSearchQuery(query);
        if (query.length < 2) {
            setSearchResults([]);
            return;
        }

        try {
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
        if (!ts) return "";
        const date = new Date(ts);
        // Correctly return Current Indian Standard Time (IST)
        return date.toLocaleTimeString('en-IN', { 
            timeZone: 'Asia/Kolkata', 
            hour: '2-digit', 
            minute: '2-digit',
            hour12: true 
        });
    };

    return (
        <div className="animate-in fade-in duration-700 w-full flex gap-8 h-[calc(100vh-140px)] font-inter">
            {/* Sidebar: Contacts & Search */}
            <div className="w-[380px] bg-white rounded-[28px] border border-slate-100 shadow-sm flex flex-col overflow-hidden">
                <div className="p-8 pb-6 border-b border-slate-100">
                    <h2 className="text-xl font-black text-[#1C2B4E] mb-6 tracking-tight">Messages</h2>
                    <div className="relative group">
                        <input
                            type="text"
                            placeholder="Find students or teachers..."
                            value={searchQuery}
                            onChange={(e) => handleSearch(e.target.value)}
                            className="w-full bg-[#F8FAFC] border border-slate-200 rounded-2xl py-3.5 pl-12 pr-4 text-[13px] font-black text-[#1C2B4E] focus:outline-none focus:ring-4 focus:ring-blue-50/50 transition-all placeholder:text-slate-500"
                        />
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#004AAD] transition-colors">
                            <Search size={18} />
                        </div>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto custom-scrollbar px-4 pt-4 pb-8 space-y-1.5">
                    {searchQuery.length >= 2 && (
                        <div className="px-4 py-2 border-b border-slate-100 mb-4 bg-blue-50/50 rounded-2xl mx-2">
                            <p className="text-[10px] font-black text-[#004AAD] uppercase tracking-widest mb-2">Search Results</p>
                            {searchResults.length > 0 ? searchResults.map((res) => (
                                <div
                                    key={res.studentId || res.staffId}
                                    onClick={() => { startChatWithTarget({ ...res, role: user.role === 'teacher' ? 'student' : 'teacher' }); setSearchQuery(''); }}
                                    className="p-3 hover:bg-white rounded-xl cursor-pointer flex items-center gap-3 transition-all mb-1 shadow-sm border border-transparent hover:border-blue-100"
                                >
                                    <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center text-blue-700 font-extrabold text-[12px]">
                                        {res.firstName[0]}{res.lastName[0]}
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-xs font-black text-[#1C2B4E]">{res.firstName} {res.lastName}</p>
                                        <p className="text-[9px] font-bold text-slate-500 uppercase tracking-tighter">
                                            {res.class || res.department || 'Staff'}
                                        </p>
                                    </div>
                                </div>
                            )) : (
                                <p className="text-[10px] text-slate-500 py-2 italic">No results found...</p>
                            )}
                        </div>
                    )}

                    {contacts.length > 0 ? (
                        contacts.map((contact) => (
                            <div
                                key={contact.other_id}
                                onClick={() => setActiveChat(contact)}
                                className={`p-4 rounded-2xl cursor-pointer transition-all flex items-center gap-4 border border-transparent ${activeChat?.other_id === contact.other_id ? 'bg-[#004AAD]/5 border-[#004AAD]/10 shadow-sm' : 'hover:bg-slate-50'}`}
                            >
                                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-sm relative ${activeChat?.other_id === contact.other_id ? 'bg-[#004AAD] text-white' : 'bg-slate-100 text-slate-600'}`}>
                                    <User size={20} />
                                    {contact.unread_count > 0 && (
                                        <span className="absolute -top-1 -right-1 min-w-[20px] h-5 px-1.5 bg-rose-500 border-2 border-white rounded-full text-[9px] font-black text-white flex items-center justify-center">
                                            {contact.unread_count}
                                        </span>
                                    )}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex justify-between items-start mb-0.5">
                                        <h4 className={`text-[14px] truncate ${contact.unread_count > 0 ? 'font-black text-[#1C2B4E]' : 'font-bold text-[#1C2B4E]/80'}`}>{contact.name}</h4>
                                        <span className="text-[9px] font-black text-slate-500 whitespace-nowrap ml-2 uppercase tracking-tighter">
                                            {contact.created_at ? formatTime(contact.created_at) : ''}
                                        </span>
                                    </div>
                                    <p className={`text-[12px] truncate pr-4 tracking-tight leading-tight ${contact.unread_count > 0 ? 'font-black text-[#1C2B4E]' : 'font-bold text-slate-500'}`}>
                                        {contact.message || 'No messages yet'}
                                    </p>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="mt-20 text-center opacity-40 grayscale px-10">
                            <MessageCircle className="mx-auto mb-4" size={40} />
                            <p className="text-[11px] font-black text-slate-600 uppercase tracking-[0.2em]">No Recent Chats</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Chat Area */}
            <div className="flex-1 bg-white rounded-[28px] border border-slate-100 shadow-sm flex flex-col overflow-hidden relative">
                {activeChat ? (
                    <>
                        {/* Header */}
                        <div className="p-6 px-10 border-b border-slate-100 flex items-center justify-between bg-white/80 backdrop-blur-md z-10 sticky top-0">
                            <div className="flex items-center gap-5">
                                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-50 to-slate-100 flex items-center justify-center text-[#1C2B4E] shadow-sm border border-slate-200">
                                    <User size={22} />
                                </div>
                                <div>
                                    <h3 className="text-[16px] font-black text-[#1C2B4E] mb-0.5">{activeChat.name}</h3>
                                    <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.3)]"></div>
                                        <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest leading-none">Online - {activeChat.role}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Messages */}
                        <div className="flex-1 overflow-y-auto p-10 space-y-8 custom-scrollbar bg-[#F8FAFC]/50 flex flex-col">
                            {messages.map((msg, i) => (
                                <div key={i} className={`flex flex-col ${msg.sender_id === user.id ? 'items-end' : 'items-start'} gap-2 group`}>
                                    <div className={`relative max-w-[75%] px-6 py-4 rounded-[24px] text-[14px] font-bold leading-relaxed shadow-sm transition-all ${
                                        msg.sender_id === user.id
                                            ? 'bg-[#004AAD] text-white rounded-tr-none shadow-blue-100/30'
                                            : 'bg-white text-[#1C2B4E] rounded-tl-none border border-slate-100'
                                    }`}>
                                        {msg.message}
                                        {msg.sender_id === user.id && (
                                            <button 
                                                onClick={() => deleteMessage(msg.id)}
                                                className="absolute -left-10 top-1/2 -translate-y-1/2 p-2 text-slate-300 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-all active:scale-90"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        )}
                                    </div>
                                    <span className="text-[9px] font-black text-slate-600 mx-2 uppercase tracking-widest flex items-center gap-2">
                                        {formatTime(msg.created_at)}
                                        {msg.sender_id === user.id && (
                                            <CheckCheck size={18} className={msg.is_read ? 'text-[#004AAD]' : 'text-slate-400'} />
                                        )}
                                    </span>
                                </div>
                            ))}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input Area - Restyled for Premium Feel */}
                        <div className="p-8 px-10 bg-white border-t border-slate-100 shadow-[0_-15px_40px_rgba(0,0,0,0.03)] z-10">
                            <div className="flex items-center gap-4 max-w-[99%] mx-auto relative group">
                                <div className="flex-1 relative">
                                    <input
                                        type="text"
                                        value={inputValue}
                                        onChange={(e) => setInputValue(e.target.value)}
                                        onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                                        placeholder="Write your message..."
                                        className="w-full bg-[#F8FAFC]/80 border border-slate-200 rounded-[20px] py-6 pl-8 pr-16 text-[15px] font-bold text-[#1C2B4E] focus:outline-none focus:bg-white focus:ring-4 focus:ring-blue-50/50 focus:border-blue-200 transition-all placeholder:text-slate-400 shadow-sm"
                                    />
                                    <button 
                                        onClick={sendMessage}
                                        className="absolute right-3.5 top-1/2 -translate-y-1/2 w-12 h-12 bg-[#004AAD] text-white rounded-2xl flex items-center justify-center shadow-lg shadow-blue-200 hover:bg-[#003d8f] hover:scale-105 active:scale-95 transition-all z-20 group-focus-within:shadow-blue-300"
                                    >
                                        <Send size={22} className="transform -translate-y-0.5 translate-x-0.5" />
                                    </button>
                                </div>
                            </div>
                            <p className="text-[10px] text-center mt-3 font-black text-slate-400 uppercase tracking-widest opacity-60">Press enter to send your message instantly</p>
                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center space-y-8 opacity-60">
                        <div className="w-24 h-24 bg-slate-50 rounded-[40px] flex items-center justify-center text-slate-200 shadow-inner">
                            <MessageCircle size={48} className="text-slate-300" />
                        </div>
                        <div className="text-center">
                            <h3 className="text-[12px] font-black text-[#1C2B4E] uppercase tracking-[0.3em] mb-2">Select a Conversation</h3>
                            <p className="text-[10px] font-bold text-slate-600 tracking-tighter uppercase">Pick a student or teacher from the sidebar to start chatting</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MessagesTab;
