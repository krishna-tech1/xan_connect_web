import React from 'react';

const AnnouncementsTab = () => {
    const announcements = [
        {
            title: 'Parent-Teacher Meeting Scheduled',
            date: 'Feb 25, 2026',
            tag: 'Meeting',
            tagColor: 'bg-blue-50 text-blue-600 border-blue-100',
            content: 'Dear Parents, the Parent-Teacher Meeting for Class 10-A has been scheduled for March 5th, 2026 at 10:00 AM in the school auditorium. Please make it a point to attend.',
            hasAttachment: true
        },
        {
            title: 'New Library Books Collection',
            date: 'Jan 10, 2026',
            tag: 'General',
            tagColor: 'bg-gray-100 text-gray-600 border-gray-200',
            content: 'We are pleased to inform that 200+ new books have been added to the school library across various subjects. Students are encouraged to explore the new collection.',
            hasAttachment: false
        },
        {
            title: 'Mid-Term Examination Schedule Released',
            date: 'Feb 25, 2026',
            tag: 'Exam',
            tagColor: 'bg-orange-50 text-orange-600 border-orange-100',
            content: 'The mid-term examination schedule for all classes has been released and is now available for download. Please ensure students prepare accordingly.',
            hasAttachment: true
        },
        {
            title: 'Annual Sports Day — Registration Open',
            date: 'Feb 25, 2026',
            tag: 'Event',
            tagColor: 'bg-green-50 text-green-600 border-green-100',
            content: 'The Annual Sports Day will be held on March 15th. Students interested in participating can register through their class teacher. Events include track & field, team sports, and cultural activities.',
            hasAttachment: true
        },
        {
            title: 'Holiday Notice — Pongal Festival',
            date: 'Jan 10, 2026',
            tag: 'Holiday',
            tagColor: 'bg-red-50 text-red-600 border-red-100',
            content: 'School will remain closed from January 14th to January 17th on account of the Pongal Festival. Normal classes will resume from January 18th.',
            hasAttachment: true
        }
    ];

    return (
        <div className="animate-in fade-in duration-500 w-full font-inter space-y-6 pb-12">
            {announcements.map((item, i) => (
                <div key={i} className="bg-white rounded-[24px] border border-slate-100 shadow-sm overflow-hidden group hover:border-[#004AAD]/20 transition-all">
                    <div className="p-8">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h3 className="text-xl font-bold text-[#1C2B4E] mb-2 group-hover:text-[#004AAD] transition-colors">{item.title}</h3>
                                <div className="flex items-center gap-2 text-xs font-semibold text-slate-300">
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    {item.date}
                                </div>
                            </div>
                            <span className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-tight border ${item.tagColor}`}>
                                {item.tag}
                            </span>
                        </div>

                        <p className="text-sm font-semibold text-slate-400 leading-relaxed mb-6">
                            {item.content}
                        </p>

                        {item.hasAttachment && (
                            <button className="flex items-center gap-2 text-[#004AAD] font-black text-xs hover:underline decoration-2 underline-offset-4">
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                </svg>
                                Download Attachment
                            </button>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default AnnouncementsTab;
