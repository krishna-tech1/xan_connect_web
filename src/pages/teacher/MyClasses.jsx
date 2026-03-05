import React from 'react';

/**
 * MyClasses Component
 * 
 * Rebuilt to match the provided high-fidelity reference design.
 * Displays teacher's assigned classes with student counts, schedules, and average scores.
 */
const MyClasses = () => {
    const classData = [
        {
            grade: 'Class 10-A',
            subject: 'Mathematics',
            students: '42 Students',
            schedule: [
                '9 am - Mon, Thu',
                '10 am - Wed',
                '2 pm - Fri'
            ],
            avgScore: '88%'
        },
        {
            grade: 'Class 12-B',
            subject: 'Calculus',
            students: '40 Students',
            schedule: [
                '9 am - Tue, Thu',
                '10 am - Mon',
                '2 pm - Fri'
            ],
            avgScore: '91%'
        },
        {
            grade: 'Class 9-C',
            subject: 'Mathematics',
            students: '39 Students',
            schedule: [
                '9 am - Mon, Thu',
                '10 am - Wed'
            ],
            avgScore: '83%'
        }
    ];

    return (
        <div className="animate-in fade-in duration-700 w-full font-inter space-y-8 pb-12">
            {/* Header is handled in App.jsx (Title: My Classes) */}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {classData.map((cls, idx) => (
                    <div key={idx} className="bg-white rounded-[16px] border border-slate-100 shadow-sm flex flex-col hover:shadow-md transition-all duration-300">
                        {/* Upper Section */}
                        <div className="p-8 pb-6 flex-1">
                            <h3 className="text-[17px] font-black text-[#1C2B4E]">{cls.grade}</h3>
                            <p className="text-[14px] font-bold text-slate-400 mt-1">{cls.subject}</p>

                            <div className="mt-6 flex items-center gap-2 text-slate-300">
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M9 7a4 4 0 110-8 4 4 0 010 8zm14 14v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />
                                </svg>
                                <span className="text-[13px] font-black">{cls.students}</span>
                            </div>

                            <div className="mt-6 flex flex-wrap gap-2">
                                {cls.schedule.map((time, sIdx) => (
                                    <span key={sIdx} className="bg-blue-50 text-[#004AAD] text-[11px] font-black px-4 py-2 rounded-lg border border-blue-100 leading-none">
                                        {time}
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* Lower Action Section */}
                        <div className="px-8 py-6 border-t border-slate-50 flex justify-between items-center group cursor-pointer hover:bg-slate-50/50 transition-colors rounded-b-[16px]">
                            <div>
                                <p className="text-[11px] font-black text-slate-300 uppercase tracking-widest mb-1 leading-none">Avg. Score</p>
                                <p className="text-[18px] font-black text-[#1C2B4E]">{cls.avgScore}</p>
                            </div>
                            <div className="w-10 h-10 rounded-full border border-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-[#004AAD] group-hover:text-white group-hover:border-transparent transition-all shadow-sm">
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                </svg>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default MyClasses;
