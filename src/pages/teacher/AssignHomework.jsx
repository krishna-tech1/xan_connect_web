import React, { useState, useEffect } from 'react';
import { 
    Plus, Calendar, Clock, Paperclip, Send, 
    CheckCircle, AlertCircle, Loader, Trash2, X,
    ChevronDown, BookOpen, Users, FileText, ImageIcon,
    ArrowRight, ArrowUpRight, Loader2
} from 'lucide-react';
import axios from 'axios';
import { toast } from 'react-toastify';

/**
 * AssignHomework Component
 * 
 * Functional homework management dashboard for Teachers.
 * Supports creating new assignments and managing student submissions.
 */
const AssignHomework = ({ user }) => {
    const [homeworks, setHomeworks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [creating, setCreating] = useState(false);
    const [isFormOpen, setIsFormOpen] = useState(false);
    
    // Form State
    const [classOptions, setClassOptions] = useState([]);
    const [selectedClass, setSelectedClass] = useState('');
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [dueDate, setDueDate] = useState('');
    const [files, setFiles] = useState([]);

    // Submissions State
    const [isSubmissionsModalOpen, setIsSubmissionsModalOpen] = useState(false);
    const [submissions, setSubmissions] = useState([]);
    const [loadingSubmissions, setLoadingSubmissions] = useState(false);
    const [manageHomeworkId, setManageHomeworkId] = useState(null);
    const [manageHomeworkTitle, setManageHomeworkTitle] = useState('');
    const [gradingId, setGradingId] = useState(null);
    const [gradeInput, setGradeInput] = useState('');
    
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5056';

    useEffect(() => {
        if (user) {
            const subjectsData = user.subjects || user.subjects_list;
            const subjects = Array.isArray(subjectsData) 
                ? subjectsData 
                : (typeof subjectsData === 'string' ? JSON.parse(subjectsData || '[]') : []);

            const options = subjects.map(sub => {
                const className = sub.class || sub.className || '';
                return {
                    label: `${className} — ${sub.subject}`,
                    value: `${className}|${sub.subject}`,
                    className: className,
                    subject: sub.subject
                };
            }).filter(opt => opt.className);

            setClassOptions(options);
            if (options.length > 0) setSelectedClass(options[0].value);
            
            fetchHomeworks();
        } else {
            setLoading(false);
        }
    }, [user]);

    const fetchHomeworks = async () => {
        try {
            setLoading(true);
            const teacherId = user?.staffId || user?.id;
            const response = await axios.get(`${API_URL}/api/portal/homework`, {
                params: { teacherId }
            });
            setHomeworks(response.data);
        } catch (err) {
            console.error('Fetch Homework Error:', err);
            toast.error('Failed to load assignments');
        } finally {
            setLoading(false);
        }
    };

    const fetchSubmissions = async (hwId) => {
        try {
            setLoadingSubmissions(true);
            const res = await axios.get(`${API_URL}/api/portal/homework/submissions/${hwId}`);
            setSubmissions(res.data);
        } catch (err) {
            console.error('Fetch Submissions Error:', err);
            toast.error('Could not load student submissions');
        } finally {
            setLoadingSubmissions(false);
        }
    };

    const handleFileChange = (e) => {
        const selectedFiles = Array.from(e.target.files);
        if (selectedFiles.length + files.length > 5) {
            toast.warning('Maximum 5 files allowed');
            return;
        }
        setFiles(prev => [...prev, ...selectedFiles]);
    };

    const removeFile = (index) => {
        setFiles(prev => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!selectedClass || !title || !dueDate) {
            toast.error('Class, Title, and Due Date are required');
            return;
        }

        if (description.trim() === '' && files.length === 0) {
            toast.error('Please provide either a description or at least one attachment');
            return;
        }

        try {
            setCreating(true);
            const [classNameRaw, subject] = selectedClass.split('|');
            const parts = classNameRaw.trim().split(' ');
            let className = classNameRaw;
            let section = '';
            if (parts.length > 1) {
                section = parts.pop();
                className = parts.join(' ');
            }

            const formData = new FormData();
            formData.append('teacherId', user?.staffId || user?.id);
            formData.append('className', className);
            formData.append('section', section);
            formData.append('subject', subject);
            formData.append('title', title);
            formData.append('description', description);
            formData.append('dueDate', dueDate);
            
            files.forEach(file => {
                formData.append('files', file);
            });

            await axios.post(`${API_URL}/api/portal/homework`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            toast.success('Homework assigned successfully!');
            setIsFormOpen(false);
            resetForm();
            fetchHomeworks();
        } catch (err) {
            console.error('Create Homework Error:', err);
            toast.error('Could not create assignment');
        } finally {
            setCreating(false);
        }
    };

    const handleSaveGrade = async (submissionId) => {
        if (!gradeInput) {
            toast.warning('Please enter a grade');
            return;
        }

        try {
            setGradingId(submissionId);
            await axios.patch(`${API_URL}/api/portal/homework/grade/${submissionId}`, {
                grade: gradeInput
            });
            toast.success('Grade saved!');
            fetchSubmissions(manageHomeworkId);
            setGradingId(null);
            setGradeInput('');
        } catch (err) {
            console.error('Grading Error:', err);
            toast.error('Could not save grade');
            setGradingId(null);
        }
    };

    const resetForm = () => {
        setTitle('');
        setDescription('');
        setDueDate('');
        setFiles([]);
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this assignment?')) return;
        try {
            await axios.delete(`${API_URL}/api/portal/homework/${id}`, {
                params: { teacherId: user?.staffId || user?.id }
            });
            toast.success('Deleted');
            fetchHomeworks();
        } catch (err) {
            toast.error('Failed to delete');
        }
    };

    const getStatus = (due_date) => {
        const today = new Date();
        const due = new Date(due_date);
        return due < today ? 'Expired' : 'Active';
    };

    if (loading && homeworks.length === 0) {
        return (
            <div className="p-20 flex flex-col items-center justify-center animate-pulse">
                <Loader className="text-blue-200 animate-spin mb-4" size={40} />
                <p className="text-slate-300 font-black uppercase tracking-widest text-xs">Syncing Assignments...</p>
            </div>
        );
    }

    return (
        <div className="animate-in fade-in duration-700 w-full font-inter space-y-8 pb-12">
            {/* Header Actions */}
            <div className="flex justify-between items-end">
                <div>
                    <h2 className="text-3xl font-black text-[#1C2B4E] tracking-tight">Homework Management</h2>
                    <p className="text-slate-400 font-bold text-xs uppercase tracking-widest mt-2 flex items-center gap-2">
                        <Users size={14} className="text-[#004AAD]" />
                        {homeworks.length} Assignments Given
                    </p>
                </div>
                <button 
                    onClick={() => setIsFormOpen(true)}
                    className="bg-[#004AAD] text-white px-8 py-4 rounded-[20px] font-black text-xs uppercase tracking-[0.1em] shadow-xl shadow-blue-100 flex items-center gap-3 transition-all hover:scale-105 active:scale-95 group"
                >
                    <Plus size={18} className="group-hover:rotate-90 transition-transform duration-300" />
                    Assign New Task
                </button>
            </div>

            {/* Assignments Grid */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                {homeworks.length === 0 ? (
                    <div className="col-span-full py-20 bg-white rounded-[40px] border-2 border-dashed border-slate-100 flex flex-col items-center justify-center opacity-70">
                        <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center text-slate-200 mb-4">
                            <BookOpen size={30} />
                        </div>
                        <p className="text-slate-300 font-black uppercase tracking-widest text-xs">No assignments given yet</p>
                    </div>
                ) : (
                    homeworks.map((hw) => {
                        const status = getStatus(hw.due_date);
                        const attachmentsCount = hw.attachments ? hw.attachments.split(',').length : 0;
                        
                        return (
                            <div key={hw.id} className="bg-white rounded-[32px] border border-slate-100 shadow-sm p-8 hover:shadow-xl hover:shadow-slate-200/40 transition-all duration-500 relative group overflow-hidden">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-slate-50 rounded-full -mr-16 -mt-16 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                                
                                <div className="flex justify-between items-start mb-6 relative z-10">
                                    <div className="space-y-1">
                                        <h3 className="text-lg font-black text-[#1C2B4E] leading-tight group-hover:text-[#004AAD] transition-colors">{hw.title}</h3>
                                        <div className="flex items-center gap-4 text-slate-300">
                                            <span className="bg-slate-50 px-3 py-1 rounded-lg text-[10px] font-black uppercase text-slate-400 border border-slate-100">{hw.class_name} {hw.section}</span>
                                            <span className="text-[11px] font-bold italic">{hw.subject}</span>
                                        </div>
                                    </div>
                                    <button 
                                        onClick={() => handleDelete(hw.id)}
                                        className="p-2 text-slate-200 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>

                                <p className="text-sm text-slate-500 font-medium line-clamp-2 mb-8 pr-4 leading-relaxed">
                                    {hw.description || 'No description provided.'}
                                </p>

                                <div className="flex flex-wrap items-center gap-6 relative z-10 pt-6 border-t border-slate-50">
                                    <div className="flex items-center gap-2 text-slate-400">
                                        <Calendar size={14} className="text-[#004AAD]" />
                                        <span className="text-[11px] font-black uppercase tracking-tighter tabular-nums">
                                            Due: {new Date(hw.due_date).toLocaleDateString()}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2 text-slate-400">
                                        <Paperclip size={14} className="text-[#004AAD]" />
                                        <span className="text-[11px] font-black uppercase tracking-tighter">{attachmentsCount} File{attachmentsCount !== 1 ? 's' : ''}</span>
                                    </div>
                                    <div className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-[0.15em] border ${
                                        status === 'Active' ? 'bg-emerald-50 text-emerald-500 border-emerald-100' : 'bg-rose-50 text-rose-500 border-rose-100'
                                    }`}>
                                        {status}
                                    </div>
                                </div>

                                {/* Manage Submissions Action */}
                                <div className="mt-8 pt-6 border-t border-slate-50 flex items-center justify-between relative z-10">
                                    <button 
                                        onClick={() => {
                                            setManageHomeworkId(hw.id);
                                            setManageHomeworkTitle(hw.title);
                                            fetchSubmissions(hw.id);
                                            setIsSubmissionsModalOpen(true);
                                        }}
                                        className="text-[#004AAD] text-[10px] font-black uppercase tracking-widest flex items-center gap-2 hover:gap-3 transition-all"
                                    >
                                        Manage Submissions
                                        <ArrowRight size={14} />
                                    </button>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>

            {/* Creation Form Overlay */}
            {isFormOpen && (
                <div className="fixed inset-0 z-[9999] flex items-start justify-center p-4 overflow-y-auto py-12">
                    <div className="fixed inset-0 bg-transparent animate-in fade-in duration-500" onClick={() => !creating && setIsFormOpen(false)}></div>
                    <div className="bg-white w-full max-w-2xl rounded-[40px] shadow-2xl relative z-10 flex flex-col overflow-hidden animate-in zoom-in-95 slide-in-from-top-8 duration-500">
                        <div className="bg-white p-8 border-b border-slate-50 flex justify-between items-center shrink-0">
                            <div>
                                <h3 className="text-2xl font-black text-[#1C2B4E]">Assign Homework</h3>
                                <p className="text-xs font-bold text-slate-300 uppercase tracking-widest mt-1">Create a new task for your students</p>
                            </div>
                            <button onClick={() => setIsFormOpen(false)} className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 hover:bg-slate-100 transition-all"><X size={20} /></button>
                        </div>
                        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-8 pt-6 space-y-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Class & Subject</label>
                                    <div className="relative group">
                                        <select value={selectedClass} onChange={(e) => setSelectedClass(e.target.value)} className="w-full h-14 pl-6 pr-12 bg-slate-50 border-2 border-slate-50 rounded-2xl text-sm font-bold text-[#1C2B4E] outline-none focus:border-[#004AAD]/20 focus:bg-white transition-all appearance-none cursor-pointer" required>
                                            {classOptions.map(opt => (<option key={opt.value} value={opt.value}>{opt.label}</option>))}
                                        </select>
                                        <ChevronDown className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none group-hover:text-[#004AAD]" size={18} />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Due Date</label>
                                    <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} className="w-full h-14 px-6 bg-slate-50 border-2 border-slate-50 rounded-2xl text-sm font-bold text-[#1C2B4E] outline-none focus:border-[#004AAD]/20 focus:bg-white transition-all cursor-pointer" required />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Homework Subject (Title)</label>
                                <input type="text" placeholder="Title..." value={title} onChange={(e) => setTitle(e.target.value)} className="w-full h-14 px-6 bg-slate-50 border-2 border-slate-50 rounded-2xl text-sm font-bold text-[#1C2B4E] outline-none focus:border-[#004AAD]/20 focus:bg-white transition-all" maxLength={30} required />
                                <div className="flex justify-end pr-2"><span className={`text-[10px] font-bold ${title.length >= 30 ? 'text-rose-500' : 'text-slate-300'}`}>{title.length}/30</span></div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Description</label>
                                <textarea placeholder="Details..." value={description} onChange={(e) => setDescription(e.target.value)} className="w-full h-32 p-6 bg-slate-50 border-2 border-slate-50 rounded-2xl text-sm font-semibold text-[#1C2B4E] outline-none focus:border-[#004AAD]/20 focus:bg-white transition-all resize-none" maxLength={75}></textarea>
                                <div className="flex justify-end pr-2"><span className={`text-[10px] font-bold ${description.length >= 75 ? 'text-rose-500' : 'text-slate-300'}`}>{description.length}/75</span></div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Attachments (Max 5)</label>
                                <div className="flex flex-wrap gap-3">
                                    <label className="w-16 h-16 rounded-2xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-slate-300 hover:border-[#004AAD]/30 hover:bg-blue-50/30 hover:text-[#004AAD] transition-all cursor-pointer">
                                        <Plus size={20} /><input type="file" multiple className="hidden" onChange={handleFileChange} />
                                    </label>
                                    {files.map((file, idx) => (
                                        <div key={idx} className="w-16 h-16 rounded-2xl bg-blue-50 border border-blue-100 relative group overflow-hidden flex items-center justify-center">
                                            {file.type.startsWith('image/') ? <ImageIcon size={20} className="text-[#004AAD]" /> : <FileText size={20} className="text-[#004AAD]" />}
                                            <button type="button" onClick={() => removeFile(idx)} className="absolute inset-0 bg-[#004AAD]/80 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"><Trash2 size={16} /></button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="pt-6 flex gap-4">
                                <button type="button" disabled={creating} onClick={() => setIsFormOpen(false)} className="flex-1 h-14 rounded-2xl border-2 border-slate-100 text-slate-400 font-black text-xs uppercase tracking-widest hover:bg-slate-50 transition-all">Cancel</button>
                                <button type="submit" disabled={creating} className="flex-[2] h-14 bg-[#004AAD] text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-blue-100 flex items-center justify-center gap-3 transition-all hover:scale-[1.02] active:scale-95">
                                    {creating ? <Loader className="animate-spin" size={18} /> : <Send size={18} />}
                                    {creating ? 'Assigning...' : 'Confirm Assignment'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Submissions Management Modal */}
            {isSubmissionsModalOpen && (
                <div className="fixed inset-0 z-[9999] flex items-start justify-center p-4 overflow-y-auto py-8">
                    <div className="absolute inset-0 bg-transparent animate-in fade-in duration-300" onClick={() => setIsSubmissionsModalOpen(false)}></div>
                    <div className="bg-white w-full max-w-4xl rounded-[40px] shadow-2xl relative z-10 flex flex-col overflow-hidden animate-in zoom-in-95 duration-300">
                        <div className="p-8 border-b border-slate-50 flex justify-between items-center shrink-0">
                            <div>
                                <h3 className="text-2xl font-black text-[#1C2B4E]">Submissions List</h3>
                                <p className="text-xs font-bold text-slate-300 uppercase tracking-widest mt-1">Task: {manageHomeworkTitle}</p>
                            </div>
                            <button onClick={() => setIsSubmissionsModalOpen(false)} className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 hover:bg-slate-100 transition-all"><X size={20} /></button>
                        </div>
                        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
                            {loadingSubmissions ? (
                                <div className="flex flex-col items-center justify-center py-20 text-slate-300 animate-pulse">
                                    <Loader2 className="animate-spin mb-4" size={32} />
                                    <p className="text-[10px] font-black uppercase tracking-widest">Fetching student work...</p>
                                </div>
                            ) : submissions.length === 0 ? (
                                <div className="flex flex-col items-center justify-center py-20 text-slate-200">
                                    <FileText size={60} className="mb-4 opacity-50" />
                                    <p className="text-sm font-bold uppercase tracking-widest">No submissions yet</p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {submissions.map((sub) => (
                                        <div key={sub.id} className="bg-slate-50/50 rounded-3xl p-6 border border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:bg-white transition-all">
                                            <div className="flex items-center gap-5">
                                                <div className="w-12 h-12 bg-white rounded-xl shadow-sm border border-slate-100 flex items-center justify-center text-[#004AAD]"><FileText size={20} /></div>
                                                <div>
                                                    <h5 className="text-sm font-black text-[#1C2B4E]">{sub.student_name}</h5>
                                                    <p className="text-[10px] font-bold text-slate-400">{sub.studentId}</p>
                                                    <div className="flex items-center gap-2 mt-1"><Clock size={10} className="text-[#004AAD]" /><span className="text-[9px] font-bold text-slate-400">{new Date(sub.submitted_at).toLocaleDateString()}</span></div>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-4">
                                                <a href={sub.submission_url} target="_blank" rel="noopener noreferrer" className="px-6 h-11 bg-white border border-slate-200 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-600 flex items-center gap-2 hover:border-[#004AAD] hover:text-[#004AAD] transition-all">Preview PDF<ArrowUpRight size={14} /></a>
                                                <div className="flex items-center gap-2">
                                                    <input type="text" placeholder="Grade" defaultValue={sub.grade} onChange={(e) => setGradeInput(e.target.value)} className="w-32 h-11 bg-white border border-slate-200 rounded-xl px-4 text-xs font-bold text-[#1C2B4E] outline-none" />
                                                    <button onClick={() => handleSaveGrade(sub.id)} disabled={gradingId === sub.id} className="px-6 h-11 bg-[#004AAD] text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-[#003882] transition-all disabled:opacity-50">{gradingId === sub.id ? '...' : 'Save'}</button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AssignHomework;
