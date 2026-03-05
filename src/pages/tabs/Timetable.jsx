import React from 'react';

/**
 * TimetableTab Component
 * 
 * Renders a pixel-perfect academic timetable matching the provided design.
 */
const TimetableTab = () => {
    // Days of the week (Mon-Sat as per image)
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    // Schedule data mapped exactly from the reference image
    const schedule = [
        {
            time: '9:00 am',
            periods: [
                { subject: 'Social', teacher: 'Mr. Anil Sharma' },
                { subject: 'Science', teacher: 'Mr. Rajiv Menon' },
                { subject: 'Hindi', teacher: 'Mrs. Sunita Yadav' },
                { subject: 'Computer', teacher: 'Ms. Neha' },
                { subject: 'Social', teacher: 'Mr. Anil Sharma' },
                { subject: 'Hindi', teacher: 'Mrs. Sunita Yadav' },
            ]
        },
        {
            time: '10:00 am',
            periods: [
                { subject: 'English', teacher: 'Ms. Priya Das' },
                { subject: 'Computer', teacher: 'Ms. Neha' },
                { subject: 'Art', teacher: 'Mr. Vikram' },
                { subject: 'Hindi', teacher: 'Mrs. Sunita Yadav' },
                { subject: 'Hindi', teacher: 'Mrs. Sunita Yadav' },
                { subject: 'Social', teacher: 'Mr. Anil Sharma' },
            ]
        },
        // BREAK (10:45 am - 11:00 am)
        {
            time: '11:00 am',
            periods: [
                { subject: 'Science', teacher: 'Mr. Rajiv Menon' },
                { subject: 'Social', teacher: 'Mr. Anil Sharma' },
                { subject: 'English', teacher: 'Ms. Priya Das' },
                { subject: 'Science', teacher: 'Mr. Rajiv Menon' },
                { subject: 'Art', teacher: 'Mr. Vikram' },
                { subject: 'Computer', teacher: 'Ms. Neha' },
            ]
        },
        {
            time: '12:00 pm',
            periods: [
                { subject: 'Hindi', teacher: 'Mrs. Sunita Yadav' },
                { subject: 'English', teacher: 'Ms. Priya Das' },
                { subject: 'Mathematics', teacher: 'Ms. Sarah Khan' },
                { subject: 'Social', teacher: 'Mr. Anil Sharma' },
                { subject: 'Mathematics', teacher: 'Ms. Sarah Khan' },
                { subject: 'English', teacher: 'Ms. Priya Das' },
            ]
        },
        // LUNCH (12:30 pm - 1:00 pm)
        {
            time: '1:00 pm',
            periods: [
                { subject: 'Computer', teacher: 'Ms. Neha' },
                { subject: 'Hindi', teacher: 'Mrs. Sunita Yadav' },
                { subject: 'Social', teacher: 'Mr. Anil Sharma' },
                { subject: 'English', teacher: 'Ms. Priya Das' },
                { subject: 'English', teacher: 'Ms. Priya Das' },
                { subject: 'P E T', teacher: 'Mr. Rajiv Menon' },
            ]
        },
        {
            time: '2:00 pm',
            periods: [
                { subject: 'P E T', teacher: 'Mr. Rajiv Menon' },
                { subject: 'Mathematics', teacher: 'Ms. Sarah Khan' },
                { subject: 'Computer', teacher: 'Ms. Neha' },
                { subject: 'Mathematics', teacher: 'Ms. Sarah Khan' },
                { subject: 'Computer', teacher: 'Ms. Neha' },
                { subject: 'Art', teacher: 'Mr. Vikram' },
            ]
        }
    ];

    return (
        <div className="animate-in fade-in duration-500 w-full font-inter">
            {/* Download Button */}
            <div className="flex justify-end mb-6">
                <button className="bg-[#004AAD] hover:bg-[#003991] text-white px-6 py-2.5 rounded-lg font-bold flex items-center gap-2 shadow-sm transition-all text-sm">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 16l-4-4h3V4h2v8h3l-4 4zm-9 4h18v2H3v-2z" />
                    </svg>
                    Download as PDF
                </button>
            </div>

            {/* Timetable Card */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] p-0 mb-10 overflow-hidden">
                <div className="overflow-x-auto">
                    <div className="min-w-[900px] p-8">
                        {/* Header Row */}
                        <div className="grid grid-cols-[100px_repeat(6,1fr)] gap-4 mb-10">
                            <div className="text-[13px] font-bold text-slate-300">Time</div>
                            {days.map((day) => (
                                <div key={day} className="text-[13px] font-bold text-slate-300 text-center">
                                    {day}
                                </div>
                            ))}
                        </div>

                        {/* Schedule Rows */}
                        <div className="space-y-4">
                            {schedule.map((row, rowIndex) => (
                                <React.Fragment key={rowIndex}>
                                    <div className="grid grid-cols-[100px_repeat(6,1fr)] gap-4 items-center">
                                        <div className="text-[15px] font-bold text-slate-800">{row.time}</div>
                                        {row.periods.map((period, colIndex) => (
                                            <div
                                                key={colIndex}
                                                className="bg-[#F9FAFB] border border-slate-50/50 rounded-xl py-4 px-2 flex flex-col items-center justify-center text-center shadow-sm min-h-[85px] hover:shadow-md hover:scale-[1.02] transition-all cursor-default"
                                            >
                                                <span className="text-[15px] font-black text-[#1C2B4E] truncate w-full">{period.subject}</span>
                                                <span className="text-[10px] font-bold text-slate-300 mt-1 truncate w-full">{period.teacher}</span>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Dividers (Break and Lunch) matches image locations */}
                                    {rowIndex === 1 && (
                                        <div className="flex items-center gap-4 py-2">
                                            <div className="flex-1 h-[1px] bg-slate-100/60"></div>
                                            <span className="text-[10.5px] font-bold text-slate-400/80 tracking-widest whitespace-nowrap">
                                                Break <span className="font-semibold lowercase ml-1">(10:45 am - 11:00 am)</span>
                                            </span>
                                            <div className="flex-1 h-[1px] bg-slate-100/60"></div>
                                        </div>
                                    )}

                                    {rowIndex === 3 && (
                                        <div className="flex items-center gap-4 py-2">
                                            <div className="flex-1 h-[1px] bg-slate-100/60"></div>
                                            <span className="text-[10.5px] font-bold text-slate-400/80 tracking-widest whitespace-nowrap">
                                                Lunch <span className="font-semibold lowercase ml-1">(12:30 pm - 1:00 pm)</span>
                                            </span>
                                            <div className="flex-1 h-[1px] bg-slate-100/60"></div>
                                        </div>
                                    )}
                                </React.Fragment>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TimetableTab;
