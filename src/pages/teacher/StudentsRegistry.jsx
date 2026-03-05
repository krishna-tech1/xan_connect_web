import React, { useState } from 'react';

/**
 * StudentsRegistry Component
 * 
 * Rebuilt to match the teacher portal's student performance registry design.
 * Features a split layout where the profile sidebar only appears after selection.
 */
const StudentsRegistry = () => {
    // State initialized to null so no profile shows by default
    const [selectedStudent, setSelectedStudent] = useState(null);

    const students = [
        { roll: '001', name: 'Aaryan', attendance: '92%', score: '95%', behavior: 'Excellent', behaviorColor: 'bg-emerald-50 text-emerald-500', attColor: 'text-emerald-500', class: '10 - A', exams: '4 out of 4' },
        { roll: '002', name: 'Ananya Singh', attendance: '82%', score: '85%', behavior: 'Good', behaviorColor: 'bg-blue-50 text-blue-500', attColor: 'text-orange-400', class: '10 - A', exams: '3 out of 4' },
        { roll: '003', name: 'Deepak', attendance: '96%', score: '91%', behavior: 'Excellent', behaviorColor: 'bg-emerald-50 text-emerald-500', attColor: 'text-emerald-500', class: '10 - A', exams: '4 out of 4' },
        { roll: '004', name: 'Ishaan Gupta', attendance: '88%', score: '81%', behavior: 'Excellent', behaviorColor: 'bg-emerald-50 text-emerald-500', attColor: 'text-orange-400', class: '10 - A', exams: '4 out of 4' },
        { roll: '005', name: 'Manav Joshi', attendance: '91%', score: '90%', behavior: 'Excellent', behaviorColor: 'bg-emerald-50 text-emerald-500', attColor: 'text-emerald-500', class: '10 - A', exams: '4 out of 4' },
        { roll: '006', name: 'Rahul Verma', attendance: '81%', score: '85%', behavior: 'Needs Improvement', behaviorColor: 'bg-orange-50 text-orange-400', attColor: 'text-orange-400', class: '10 - A', exams: '2 out of 4' },
        { roll: '007', name: 'Diya Sharma', attendance: '96%', score: '85%', behavior: 'Good', behaviorColor: 'bg-blue-50 text-blue-500', attColor: 'text-emerald-500', class: '10 - A', exams: '4 out of 4' },
        { roll: '008', name: 'Ishaan Gupta', attendance: '82%', score: '85%', behavior: 'Excellent', behaviorColor: 'bg-emerald-50 text-emerald-500', attColor: 'text-orange-400', class: '10 - A', exams: '4 out of 4' },
        { roll: '009', name: 'Rahul Verma', attendance: '72%', score: '85%', behavior: 'Needs Improvement', behaviorColor: 'bg-orange-50 text-orange-400', attColor: 'text-rose-500', class: '10 - A', exams: '4 out of 4' },
    ];

    return (
        <div className="animate-in fade-in duration-700 w-full font-inter flex flex-col xl:flex-row gap-8 pb-12">
            {/* Left Side: Student List */}
            <div className={`flex-1 bg-white rounded-[24px] border border-slate-100 shadow-sm p-8 h-fit transition-all duration-500 ${!selectedStudent ? 'xl:max-w-4xl mx-auto' : ''}`}>
                <div className="flex justify-between items-center mb-8">
                    <h3 className="text-[17px] font-black text-[#1C2B4E]">Marks Entry</h3>
                    {!selectedStudent && (
                        <p className="text-[12px] font-bold text-slate-300 italic animate-pulse">Click a student to view full profile</p>
                    )}
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="text-slate-300 text-[11px] font-black uppercase tracking-widest border-b border-slate-50">
                                <th className="pb-6 pl-2">Roll no</th>
                                <th className="pb-6">Name</th>
                                <th className="pb-6 text-center">Attendance</th>
                                <th className="pb-6 text-center">Avg. Score</th>
                                <th className="pb-6 text-right pr-6">Behavior</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {students.map((student, idx) => (
                                <tr
                                    key={idx}
                                    onClick={() => setSelectedStudent({
                                        ...student
                                    })}
                                    className={`group cursor-pointer transition-all ${selectedStudent?.roll === student.roll
                                        ? 'bg-[#F8FAFC]'
                                        : 'hover:bg-[#F8FAFC]/50'
                                        }`}
                                >
                                    <td className="py-6 pl-2 text-[13px] font-bold text-slate-400">{student.roll}</td>
                                    <td className="py-6 text-[14px] font-black text-[#1C2B4E]">{student.name}</td>
                                    <td className={`py-6 text-center text-[14px] font-black ${student.attColor}`}>
                                        {student.attendance}
                                    </td>
                                    <td className="py-6 text-center text-[14px] font-black text-[#1C2B4E]">
                                        {student.score}
                                    </td>
                                    <td className="py-6 text-right pr-6">
                                        <span className={`px-5 py-2 rounded-lg text-[10px] font-black uppercase tracking-tight min-w-[120px] inline-block text-center ${student.behaviorColor}`}>
                                            {student.behavior}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Right Side: Student Profile - Only visible on selection */}
            {selectedStudent && (
                <div className="w-full xl:w-[400px] flex flex-col gap-6 animate-in slide-in-from-right-8 duration-500">
                    <div className="bg-white rounded-[24px] border border-slate-100 shadow-sm p-10 flex flex-col items-center relative">
                        {/* Close Button to hide profile */}
                        <button
                            onClick={() => setSelectedStudent(null)}
                            className="absolute top-6 right-6 text-slate-300 hover:text-rose-500 transition-colors"
                        >
                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>

                        <h3 className="text-[16px] font-black text-[#1C2B4E] mb-8">Student Profile</h3>

                        {/* Avatar & Basic Info */}
                        <div className="flex flex-col items-center mb-10 text-center">
                            <div className="w-24 h-24 rounded-full mb-5 bg-slate-50 border-4 border-white shadow-sm flex items-center justify-center text-slate-200">
                                <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                            </div>
                            <h4 className="text-[18px] font-black text-[#1C2B4E]">{selectedStudent.name}</h4>
                            <p className="text-[12px] font-bold text-slate-300 mt-1 uppercase tracking-tight">
                                Roll No {selectedStudent.roll} <span className="mx-1.5">•</span> Class {selectedStudent.class}
                            </p>
                        </div>

                        {/* Detail Cards */}
                        <div className="w-full space-y-3">
                            {/* Attendance Card */}
                            <div className="bg-[#F8FAFC] rounded-2xl p-5 flex items-center gap-5 group hover:bg-slate-100 transition-colors">
                                <div className="w-10 h-10 rounded-xl bg-[#004AAD] flex items-center justify-center text-white shadow-lg shadow-blue-100">
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                </div>
                                <div>
                                    <p className="text-[11px] font-bold text-slate-300 uppercase tracking-widest leading-none mb-1.5">Attendance</p>
                                    <p className="text-[15px] font-black text-[#1C2B4E]">{selectedStudent.attendance}</p>
                                </div>
                            </div>

                            {/* Average Score Card */}
                            <div className="bg-[#F8FAFC] rounded-2xl p-5 flex items-center gap-5 group hover:bg-slate-100 transition-colors">
                                <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-100">
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                                    </svg>
                                </div>
                                <div>
                                    <p className="text-[11px] font-bold text-slate-300 uppercase tracking-widest leading-none mb-1.5">Average Score</p>
                                    <p className="text-[15px] font-black text-[#1C2B4E]">{selectedStudent.score}</p>
                                </div>
                            </div>

                            {/* Behavior Card */}
                            <div className="bg-[#F8FAFC] rounded-2xl p-5 flex items-center gap-5 group hover:bg-slate-100 transition-colors">
                                <div className="w-10 h-10 rounded-xl bg-emerald-500 flex items-center justify-center text-white shadow-lg shadow-emerald-100">
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                </div>
                                <div>
                                    <p className="text-[11px] font-bold text-slate-300 uppercase tracking-widest leading-none mb-1.5">Behavior</p>
                                    <p className="text-[15px] font-black text-[#1C2B4E]">{selectedStudent.behavior}</p>
                                </div>
                            </div>

                            {/* Exams Taken Card */}
                            <div className="bg-[#F8FAFC] rounded-2xl p-5 flex items-center gap-5 group hover:bg-slate-100 transition-colors">
                                <div className="w-10 h-10 rounded-xl bg-purple-500 flex items-center justify-center text-white shadow-lg shadow-purple-100">
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                </div>
                                <div>
                                    <p className="text-[11px] font-bold text-slate-300 uppercase tracking-widest leading-none mb-1.5">Exams Taken</p>
                                    <p className="text-[15px] font-black text-[#1C2B4E]">{selectedStudent.exams}</p>
                                </div>
                            </div>
                        </div>

                        {/* Action Button */}
                        <button className="w-full mt-10 bg-[#004AAD] text-white py-4 rounded-xl flex items-center justify-center gap-3 font-black text-[14px] shadow-lg shadow-blue-100 hover:bg-[#003991] active:scale-[0.98] transition-all">
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                            </svg>
                            Message Parent
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default StudentsRegistry;
