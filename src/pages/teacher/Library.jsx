import React from 'react';

/**
 * Library Component
 * 
 * Rebuilt to match the teacher portal's digital library management design.
 * Features book tracking, search functionality, and issue history.
 */
const Library = () => {
    const stats = [
        { label: 'Books Issued', value: '2', icon: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253', iconColor: 'text-blue-500' },
        { label: 'Overdue', value: '1', icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z', iconColor: 'text-rose-500' },
        { label: 'Next Due Date', value: 'Mar 5', icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z', iconColor: 'text-blue-600' }
    ];

    const books = [
        { title: 'NCERT Mathematics Class 10', id: 'NCERT • 978-81-7450-123', copies: '6 copies', status: 'Available' },
        { title: 'Calculus: Early Transcendentals', id: 'NCERT • 978-81-7450-123', copies: '6 copies', status: 'Issued' },
        { title: 'Calculus: Early Transcendentals', id: 'NCERT • 978-81-7450-123', copies: '6 copies', status: 'Overdue' },
        { title: 'NCERT Mathematics Class 10', id: 'NCERT • 978-81-7450-123', copies: '6 copies', status: 'Available' }
    ];

    const history = [
        { title: 'Calculus: Early Transcendentals', issued: 'Feb 10, 2026', due: 'Mar 10, 2026', status: 'Active' },
        { title: 'Trigonometry', issued: 'Feb 10, 2026', due: 'Mar 10, 2026', status: 'Overdue' },
        { title: 'Calculus: Early Transcendentals', issued: 'Feb 10, 2026', due: 'Mar 10, 2026', status: 'Returned' }
    ];

    const getStatusStyle = (status) => {
        switch (status) {
            case 'Available': return 'bg-emerald-50 text-emerald-500';
            case 'Issued': return 'bg-orange-50 text-orange-400';
            case 'Overdue': return 'bg-rose-50 text-rose-500';
            case 'Active': return 'bg-blue-50 text-blue-600';
            case 'Returned': return 'bg-emerald-50 text-emerald-500';
            default: return 'bg-slate-50 text-slate-400';
        }
    };

    return (
        <div className="animate-in fade-in duration-700 w-full font-inter space-y-8 pb-12">
            {/* Top Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {stats.map((stat, i) => (
                    <div key={i} className="bg-white p-6 rounded-[16px] border border-slate-100 shadow-sm flex items-center justify-center flex-col text-center group hover:shadow-md transition-all">
                        <div className={`mb-3 flex items-center gap-3`}>
                            <svg className={`w-5 h-5 ${stat.iconColor}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d={stat.icon} />
                            </svg>
                            <p className="text-[13px] font-black text-slate-300 tracking-tight leading-none">{stat.value}</p>
                        </div>
                        <p className="text-[14px] font-black text-slate-500">{stat.label}</p>
                    </div>
                ))}
            </div>

            {/* Search Bar */}
            <div className="relative group">
                <input
                    type="text"
                    placeholder="Search"
                    className="w-full bg-[#F8FAFC]/50 border border-slate-100 rounded-[16px] py-4 pl-12 pr-6 text-[14px] font-bold text-[#1C2B4E] focus:outline-none focus:ring-4 focus:ring-blue-50 focus:bg-white transition-all transition-all"
                />
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#004AAD] transition-colors">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                </div>
            </div>

            {/* Book Grid */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                {books.map((book, i) => (
                    <div key={i} className="bg-white p-8 rounded-[16px] border border-slate-100 shadow-sm flex flex-col sm:flex-row justify-between items-start gap-4 hover:shadow-md transition-all">
                        <div>
                            <h3 className="text-[15px] font-black text-[#1C2B4E] leading-tight">{book.title}</h3>
                            <p className="text-[11px] font-bold text-slate-300 mt-1 uppercase tracking-tight">{book.id}</p>
                            <p className="text-[13px] font-black text-[#1C2B4E] mt-4 opacity-70">{book.copies}</p>
                        </div>
                        <span className={`px-5 py-2 rounded-lg text-[10px] font-black uppercase tracking-tight min-w-[90px] text-center ${getStatusStyle(book.status)}`}>
                            {book.status}
                        </span>
                    </div>
                ))}
            </div>

            {/* Issue History */}
            <div className="bg-white rounded-[16px] border border-slate-100 shadow-sm p-10">
                <h3 className="text-[16px] font-black text-[#1C2B4E] mb-8">Issue History</h3>
                <div className="space-y-4">
                    {history.map((item, i) => (
                        <div key={i} className="bg-[#F8FAFC]/50 border border-slate-50 p-6 rounded-[16px] flex flex-col sm:flex-row justify-between items-center gap-4 hover:border-slate-100 transition-all group">
                            <div className="flex-1">
                                <h4 className="text-[14px] font-black text-[#1C2B4E] group-hover:text-[#004AAD] transition-colors">{item.title}</h4>
                                <div className="flex items-center gap-2 mt-2">
                                    <svg className="w-3.5 h-3.5 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <p className="text-[11px] font-bold text-slate-300 tracking-tight">
                                        Issued: {item.issued} <span className="mx-1">•</span> Due: {item.due}
                                    </p>
                                </div>
                            </div>
                            <span className={`px-5 py-2 rounded-lg text-[10px] font-black uppercase tracking-tight min-w-[90px] text-center ${getStatusStyle(item.status)}`}>
                                {item.status}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Library;
