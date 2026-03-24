import React, { useState, useEffect } from 'react';
import { 
    Calendar, 
    Clock, 
    BookOpen, 
    CheckCircle2, 
    AlertCircle, 
    FileText, 
    Upload, 
    ExternalLink, 
    ChevronRight,
    Search,
    Filter,
    ArrowUpRight,
    Loader2,
    Paperclip
} from 'lucide-react';
import axios from 'axios';
import { toast } from 'react-toastify';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5056';

const HomeworkTab = ({ user }) => {
    const [homeworks, setHomeworks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedHomework, setSelectedHomework] = useState(null);
    const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [file, setFile] = useState(null);

    useEffect(() => {
        if (user) {
            fetchHomeworks();
        } else {
            setLoading(false);
        }
    }, [user]);

    const fetchHomeworks = async () => {
        try {
            setLoading(true);
            const studentId = user.studentId || user.id;
            const res = await axios.get(`${API_URL}/api/portal/homework/student-view/${studentId}`);
            setHomeworks(res.data);
        } catch (err) {
            console.error('Fetch Homework Error:', err);
            toast.error('Could not load homework assignments.');
        } finally {
            setLoading(false);
        }
    };

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile && selectedFile.type !== 'application/pdf') {
            toast.warning('Please select a PDF file.');
            return;
        }
        setFile(selectedFile);
    };

    const handleSubmitSubmission = async (e) => {
        e.preventDefault();
        if (!file) {
            toast.error('Please select a PDF file to submit.');
            return;
        }

        try {
            setSubmitting(true);
            const formData = new FormData();
            formData.append('homeworkId', selectedHomework.id);
            formData.append('studentId', user.studentId || user.id);
            formData.append('studentName', user.name);
            formData.append('file', file);

            await axios.post(`${API_URL}/api/portal/homework/submit`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            toast.success('Homework submitted successfully!');
            setIsSubmitModalOpen(false);
            setFile(null);
            fetchHomeworks(); // Refresh to show submission status
        } catch (err) {
            console.error('Submission Error:', err);
            toast.error('Could not submit homework.');
        } finally {
            setSubmitting(false);
        }
    };

    const filteredHomeworks = homeworks.filter(hw => {
        const matchesSearch = hw.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                             hw.subject.toLowerCase().includes(searchQuery.toLowerCase());
        const isSubmitted = !!hw.submission;
        
        switch (filter) {
            case 'Pending': return matchesSearch && !isSubmitted;
            case 'Submitted': return matchesSearch && isSubmitted;
            case 'Graded': return matchesSearch && hw.submission?.grade;
            default: return matchesSearch;
        }
    });

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center p-20 animate-pulse text-slate-300">
                <Loader2 className="animate-spin mb-4" size={40} />
                <p className="text-xs font-black uppercase tracking-widest">Loading Assignments...</p>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header with Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm flex items-center gap-6 group hover:shadow-md transition-all">
                    <div className="w-14 h-14 bg-indigo-50 rounded-2xl flex items-center justify-center text-[#0F172A] group-hover:scale-110 transition-transform">
                        <BookOpen size={24} />
                    </div>
                    <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Given</p>
                        <h4 className="text-2xl font-black text-[#0F172A]">{homeworks.length}</h4>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm flex items-center gap-6 group hover:shadow-md transition-all">
                    <div className="w-14 h-14 bg-amber-50 rounded-2xl flex items-center justify-center text-amber-500 group-hover:scale-110 transition-transform">
                        <Clock size={24} />
                    </div>
                    <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Pending Work</p>
                        <h4 className="text-2xl font-black text-[#0F172A]">{homeworks.filter(h => !h.submission).length}</h4>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm flex items-center gap-6 group hover:shadow-md transition-all">
                    <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-500 group-hover:scale-110 transition-transform">
                        <CheckCircle2 size={24} />
                    </div>
                    <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Completed</p>
                        <h4 className="text-2xl font-black text-[#0F172A]">{homeworks.filter(h => h.submission).length}</h4>
                    </div>
                </div>
            </div>

            {/* Content Body */}
            <div className="bg-white p-10 rounded-[44px] border border-slate-100 shadow-sm min-h-[500px]">
                {/* Tab Filtering */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
                    <div className="flex bg-slate-50/80 p-1.5 rounded-2xl w-fit border border-slate-100">
                        {['All', 'Pending', 'Submitted', 'Graded'].map(opt => (
                            <button
                                key={opt}
                                onClick={() => setFilter(opt)}
                                className={`px-6 py-2.5 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all ${
                                    filter === opt ? 'bg-white text-[#004AAD] shadow-sm ring-1 ring-slate-200' : 'text-slate-400 hover:text-slate-600'
                                }`}
                            >
                                {opt}
                            </button>
                        ))}
                    </div>

                    <div className="relative group">
                        <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#004AAD] transition-colors" size={16} />
                        <input 
                            type="text"
                            placeholder="Search assignments..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="bg-slate-50/80 border border-slate-100 rounded-2xl py-3.5 pl-12 pr-6 text-sm font-semibold w-full md:w-72 outline-none focus:bg-white focus:ring-2 focus:ring-[#004AAD]/10 transition-all placeholder:text-slate-300"
                        />
                    </div>
                </div>

                {/* Assignment List */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredHomeworks.length === 0 ? (
                        <div className="col-span-full flex flex-col items-center justify-center py-20 text-slate-300">
                            <BookOpen size={60} className="mb-6 opacity-20" />
                            <p className="text-sm font-bold uppercase tracking-widest">No assignments found</p>
                            <p className="text-xs font-semibold mt-2">You're all caught up for now!</p>
                        </div>
                    ) : (
                        filteredHomeworks.map((hw) => {
                            const isSubmitted = !!hw.submission;
                            const isGraded = !!hw.submission?.grade;
                            
                            return (
                                <div key={hw.id} className="group relative bg-white border border-slate-100 rounded-[32px] p-8 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                                    <div className="flex items-start justify-between mb-6">
                                        <div className="bg-blue-50/50 px-4 py-1.5 rounded-full border border-blue-50">
                                            <span className="text-[10px] font-black text-[#004AAD] uppercase tracking-widest">{hw.subject}</span>
                                        </div>
                                        {isSubmitted ? (
                                            <div className={`px-4 py-1.5 rounded-full flex items-center gap-1.5 border ${isGraded ? 'bg-emerald-50 text-emerald-500 border-emerald-100' : 'bg-slate-50 text-slate-400 border-slate-100'}`}>
                                                <div className={`w-1.5 h-1.5 rounded-full ${isGraded ? 'bg-emerald-500' : 'bg-slate-300'}`}></div>
                                                <span className="text-[9px] font-black uppercase tracking-widest">{isGraded ? 'Graded' : 'Submitted'}</span>
                                            </div>
                                        ) : (
                                            <div className="bg-amber-50 text-amber-500 px-4 py-1.5 rounded-full flex items-center gap-1.5 border border-amber-100 animate-pulse">
                                                <div className="w-1.5 h-1.5 rounded-full bg-amber-500"></div>
                                                <span className="text-[9px] font-black uppercase tracking-widest">Pending</span>
                                            </div>
                                        )}
                                    </div>

                                    <h4 className="text-lg font-black text-[#1C2B4E] line-clamp-1 mb-2 group-hover:text-[#004AAD] transition-colors">{hw.title}</h4>
                                    <p className="text-xs font-semibold text-slate-400 line-clamp-2 leading-relaxed mb-8">{hw.description || 'No description provided.'}</p>

                                    {/* Submissions Attachments Info */}
                                    <div className="flex items-center gap-4 py-4 border-t border-slate-50 mb-8 overflow-x-auto no-scrollbar">
                                        <div className="flex items-center gap-2 text-slate-400 shrink-0">
                                            <Clock size={12} className="text-[#004AAD]" />
                                            <span className="text-[10px] font-bold uppercase tracking-tighter">Due: {new Date(hw.due_date).toLocaleDateString()}</span>
                                        </div>
                                        {hw.attachments && (
                                            <div className="flex flex-wrap items-center gap-3 w-full">
                                                {hw.attachments.split(',').map((url, idx) => (
                                                    <a 
                                                        key={idx}
                                                        href={url}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-100 hover:bg-white hover:border-[#004AAD]/30 hover:shadow-sm transition-all group/att"
                                                    >
                                                        <Paperclip size={10} className="text-[#004AAD]" />
                                                        <span className="text-[9px] font-black text-slate-500 uppercase tracking-tight group-hover/att:text-[#004AAD]">Doc {idx + 1}</span>
                                                        <ExternalLink size={10} className="text-slate-300 group-hover/att:text-[#004AAD]" />
                                                    </a>
                                                ))}
                                            </div>
                                        )}
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="flex items-center gap-3">
                                        {!isSubmitted ? (
                                            <button 
                                                onClick={() => {
                                                    setSelectedHomework(hw);
                                                    setIsSubmitModalOpen(true);
                                                }}
                                                className="flex-1 bg-[#004AAD] text-white h-11 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-[#003882] hover:shadow-lg transition-all active:scale-95"
                                            >
                                                Submit Homework
                                                <ArrowUpRight size={14} />
                                            </button>
                                        ) : (
                                            <>
                                                <a 
                                                    href={hw.submission.submission_url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="flex-1 bg-slate-50 text-[#1C2B4E] h-11 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 border border-slate-100 hover:bg-white hover:shadow-md transition-all"
                                                >
                                                    View Submission
                                                </a>
                                                {isGraded && (
                                                    <div className="bg-[#004AAD] text-white w-20 h-11 rounded-xl flex flex-col items-center justify-center shadow-lg shadow-blue-200">
                                                        <span className="text-[14px] font-black leading-none">{hw.submission.grade}</span>
                                                        <span className="text-[8px] font-black uppercase opacity-60">Score</span>
                                                    </div>
                                                )}
                                            </>
                                        )}
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
            </div>

            {/* Submission Modal */}
            {isSubmitModalOpen && (
                <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-transparent animate-in fade-in duration-300" onClick={() => !submitting && setIsSubmitModalOpen(false)}></div>
                    
                    <div className="bg-white w-full max-w-lg rounded-[40px] shadow-2xl relative z-10 p-10 animate-in zoom-in-95 duration-300">
                        <div className="mb-8">
                            <h3 className="text-2xl font-black text-[#1C2B4E]">Submit Homework</h3>
                            <p className="text-xs font-bold text-slate-300 uppercase tracking-widest mt-1">Assignment: {selectedHomework?.title}</p>
                        </div>

                        <form onSubmit={handleSubmitSubmission} className="space-y-8">
                            <div className="space-y-4">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Upload PDF File</label>
                                <div className={`relative h-48 rounded-[32px] border-2 border-dashed transition-all flex flex-col items-center justify-center p-6 ${file ? 'bg-emerald-50 border-emerald-200 text-emerald-600' : 'bg-slate-50 border-slate-100 text-slate-400 hover:bg-slate-100 hover:border-slate-200'}`}>
                                    <input 
                                        type="file" 
                                        accept=".pdf"
                                        onChange={handleFileChange}
                                        className="absolute inset-0 opacity-0 cursor-pointer"
                                        required
                                    />
                                    {file ? (
                                        <>
                                            <div className="w-16 h-16 bg-emerald-100 rounded-2xl flex items-center justify-center mb-4">
                                                <FileText size={28} />
                                            </div>
                                            <p className="text-sm font-bold text-emerald-600 line-clamp-1">{file.name}</p>
                                            <p className="text-[10px] uppercase font-black opacity-60 mt-1">Click to replace</p>
                                        </>
                                    ) : (
                                        <>
                                            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-sm mb-4">
                                                <Upload size={28} className="text-[#004AAD]" />
                                            </div>
                                            <p className="text-sm font-bold opacity-80">Tap to upload your PDF</p>
                                            <p className="text-[10px] uppercase font-black opacity-40 mt-1">Only PDF files supported</p>
                                        </>
                                    )}
                                </div>
                            </div>

                            <div className="pt-4 flex gap-4">
                                <button 
                                    type="button"
                                    disabled={submitting}
                                    onClick={() => setIsSubmitModalOpen(false)}
                                    className="flex-1 h-16 rounded-2xl border-2 border-slate-100 text-slate-400 font-black text-[10px] uppercase tracking-widest hover:bg-slate-50 transition-all"
                                >
                                    Cancel
                                </button>
                                <button 
                                    type="submit"
                                    disabled={submitting || !file}
                                    className="flex-1 h-16 rounded-2xl bg-[#004AAD] text-white font-black text-[10px] uppercase tracking-widest hover:bg-[#003882] shadow-xl shadow-blue-100 transition-all disabled:opacity-50 flex items-center justify-center gap-3"
                                >
                                    {submitting ? (
                                        <Loader2 className="animate-spin" size={20} />
                                    ) : (
                                        <>
                                            Send Submission
                                            <ChevronRight size={18} />
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default HomeworkTab;
