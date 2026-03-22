import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ResultsTab = ({ user }) => {
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5056';
    const [marks, setMarks] = useState([]);
    const [loading, setLoading] = useState(true);

    const studentId = user?.details?.studentId || user?.id;

    useEffect(() => {
        if (!studentId) return;
        const fetchMarks = async () => {
            setLoading(true);
            try {
                const res = await axios.get(`${API_URL}/api/portal/student-marks/${studentId}`);
                setMarks(res.data);
            } catch (err) {
                console.error('Marks fetch error:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchMarks();
    }, [studentId]);

    // Group marks by subject
    const subjects = {};
    marks.forEach(m => {
        if (!subjects[m.subject]) {
            subjects[m.subject] = { subject: m.subject, teacher_name: m.teacher_name, exams: {} };
        }
        subjects[m.subject].exams[m.exam_type] = { marks: m.marks, remarks: m.remarks };
    });
    const subjectRows = Object.values(subjects);

    // Compute grade from average
    const computeGrade = (exams) => {
        const vals = Object.values(exams).map(e => parseFloat(e.marks)).filter(v => !isNaN(v));
        if (!vals.length) return '—';
        const avg = vals.reduce((a, b) => a + b, 0) / vals.length;
        if (avg >= 90) return 'A+';
        if (avg >= 80) return 'A';
        if (avg >= 70) return 'B+';
        if (avg >= 60) return 'B';
        if (avg >= 50) return 'C';
        return 'D';
    };

    // Top-level stats
    const allMarksVals = marks.map(m => parseFloat(m.marks)).filter(v => !isNaN(v));
    const averageScore = allMarksVals.length
        ? Math.round(allMarksVals.reduce((a, b) => a + b, 0) / allMarksVals.length)
        : 0;

    const overallGrade = computeGrade(Object.fromEntries(allMarksVals.map((v, i) => [i, { marks: v }])));

    const stats = [
        { label: 'Average Score', value: loading ? '...' : `${averageScore}%`, color: 'text-slate-700' },
        { label: 'Overall Grade', value: loading ? '...' : overallGrade, color: 'text-green-600' },
        { label: 'Subjects', value: loading ? '...' : subjectRows.length, color: 'text-slate-700' },
        { label: 'Total Exams', value: loading ? '...' : marks.length, color: 'text-blue-600' },
    ];

    const examTypes = [...new Set(marks.map(m => m.exam_type))].sort();

    return (
        <div className="animate-in fade-in duration-500 w-full font-inter">
            {/* Top Stats */}
            <div className="flex flex-wrap items-center gap-4 mb-8">
                <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-4">
                    {stats.map((stat, i) => (
                        <div key={i} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col items-center justify-center">
                            <h4 className={`text-2xl font-black ${stat.color} leading-none`}>{stat.value}</h4>
                            <p className="text-[11px] font-bold text-slate-300 uppercase mt-2 tracking-tight">{stat.label}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Subject-wise Results Table */}
            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden mb-10">
                <div className="px-8 py-6 border-b border-slate-50 flex items-center gap-3">
                    <div className="text-[#1C2B4E]">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z" />
                        </svg>
                    </div>
                    <h3 className="text-base font-black text-[#1C2B4E]">Subject-wise Results</h3>
                </div>

                {loading ? (
                    <div className="p-12 text-center text-slate-300 font-bold text-sm">Loading results...</div>
                ) : subjectRows.length === 0 ? (
                    <div className="p-12 text-center text-slate-300 font-bold text-sm">No marks have been entered yet.</div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-slate-50/20">
                                    <th className="px-8 py-4 text-[11px] font-bold text-slate-300 uppercase tracking-wider">Subject</th>
                                    {examTypes.map(et => (
                                        <th key={et} className="px-8 py-4 text-[11px] font-bold text-slate-300 uppercase tracking-wider">{et}</th>
                                    ))}
                                    <th className="px-8 py-4 text-[11px] font-bold text-slate-300 uppercase tracking-wider">Grade</th>
                                    <th className="px-8 py-4 text-[11px] font-bold text-slate-300 uppercase tracking-wider">Remarks</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {subjectRows.map((row, i) => {
                                    const grade = computeGrade(row.exams);
                                    // Use the remarks from the last exam_type for that subject
                                    const lastRemarks = Object.values(row.exams).slice(-1)[0]?.remarks || '—';
                                    return (
                                        <tr key={i} className="group hover:bg-slate-50/30 transition-colors">
                                            <td className="px-8 py-5">
                                                <p className="font-bold text-[#1C2B4E] uppercase text-sm">{row.subject}</p>
                                                <p className="text-[10px] font-bold text-slate-300 mt-0.5">
                                                    {row.teacher_name && row.teacher_name !== 'N/A' ? `by ${row.teacher_name}` : ''}
                                                </p>
                                            </td>
                                            {examTypes.map(et => (
                                                <td key={et} className="px-8 py-5 text-sm font-black text-slate-600">
                                                    {row.exams[et] ? `${row.exams[et].marks}` : '—'}
                                                </td>
                                            ))}
                                            <td className="px-8 py-5">
                                                <span className="bg-blue-50 text-[#004AAD] px-3 py-1.5 rounded-lg text-[11px] font-black border border-blue-100/50">
                                                    {grade}
                                                </span>
                                            </td>
                                            <td className="px-8 py-5 text-[12px] font-semibold text-slate-400">
                                                {lastRemarks}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Performance Trend */}
            {subjectRows.length > 0 && (
                <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm mb-12">
                    <h4 className="text-base font-black text-[#1C2B4E] mb-8">Performance Overview</h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {subjectRows.map((row, i) => {
                            const vals = Object.values(row.exams).map(e => parseFloat(e.marks)).filter(v => !isNaN(v));
                            const avg = vals.length ? Math.round(vals.reduce((a, b) => a + b, 0) / vals.length) : 0;
                            const isGood = avg >= 75;
                            return (
                                <div key={i} className="bg-[#F8FAFC] p-4 rounded-xl border border-slate-100/50 flex flex-col items-center justify-center text-center">
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight mb-2 opacity-60 line-clamp-1">{row.subject}</p>
                                    <div className={`flex items-center gap-1.5 mb-1 ${isGood ? 'text-green-500' : 'text-red-500'}`}>
                                        <svg className={`w-3.5 h-3.5 ${!isGood ? 'rotate-180' : ''}`} fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M16 6l2.29 2.29-4.88 4.88-4-4L2 16.59 3.41 18l6-6 4 4 6.3-6.29L22 12V6z" />
                                        </svg>
                                        <span className="text-[11px] font-black">{computeGrade(row.exams)}</span>
                                    </div>
                                    <p className="text-2xl font-black text-[#1C2B4E] leading-none">{avg}%</p>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
};

export default ResultsTab;
