import React, { useState, useEffect } from 'react';
import { FiCalendar, FiFileText, FiClock, FiPlus, FiCheckCircle, FiXCircle, FiLoader } from 'react-icons/fi';
import axios from 'axios';

const LeaveRequests = ({ user }) => {
    const [leaveType, setLeaveType] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [reason, setReason] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [history, setHistory] = useState([]);
    const [fetchingHistory, setFetchingHistory] = useState(true);

    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5056';

    useEffect(() => {
        fetchHistory();
    }, []);

    const fetchHistory = async () => {
        try {
            const response = await axios.get(`${API_URL}/api/portal/leaves/${user.id}`);
            setHistory(response.data);
        } catch (err) {
            console.error('Error fetching leave history:', err);
        } finally {
            setFetchingHistory(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        
        if (!leaveType || !startDate || !endDate || !reason) {
            setError('Please fill all fields.');
            return;
        }

        if (reason.length > 75) {
            setError('Description cannot exceed 75 characters.');
            return;
        }

        setLoading(true);
        try {
            await axios.post(`${API_URL}/api/portal/leaves`, {
                staffId: user.id,
                leaveType,
                startDate,
                endDate,
                reason
            });
            setSuccess('Leave application submitted successfully!');
            setLeaveType('');
            setStartDate('');
            setEndDate('');
            setReason('');
            fetchHistory();
        } catch (err) {
            setError(err.response?.data?.message || 'Error submitting leave application.');
        } finally {
            setLoading(false);
        }
    };

    // Get today's date in YYYY-MM-DD format for min date attribute
    const today = new Date().toISOString().split('T')[0];

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 space-y-10 pb-20">
            {/* Header */}
            <div className="flex justify-between items-end">
                <div>
                    <h2 className="text-3xl font-black text-[#1C2B4E] tracking-tight">Leave Application</h2>
                    <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px] mt-2 italic">Request time off and track your approval status</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                {/* Apply Form */}
                <div className="lg:col-span-1">
                    <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm sticky top-24">
                        <div className="flex items-center gap-3 mb-8">
                            <div className="w-10 h-10 rounded-2xl bg-blue-50 flex items-center justify-center text-[#0047AB]">
                                <FiPlus size={20} strokeWidth={3} />
                            </div>
                            <h3 className="text-lg font-black text-[#1C2B4E]">New Request</h3>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            {error && <div className="p-4 bg-rose-50 text-rose-500 rounded-2xl text-[12px] font-black border border-rose-100">{error}</div>}
                            {success && <div className="p-4 bg-emerald-50 text-emerald-500 rounded-2xl text-[12px] font-black border border-emerald-100">{success}</div>}

                            <div className="space-y-2">
                                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Leave Type</label>
                                <select 
                                    className="w-full bg-slate-50 border-2 border-slate-50 rounded-2xl px-5 py-4 text-sm font-bold text-[#1C2B4E] focus:bg-white focus:border-blue-100 focus:ring-4 focus:ring-blue-50/50 transition-all outline-none appearance-none cursor-pointer"
                                    value={leaveType}
                                    onChange={(e) => setLeaveType(e.target.value)}
                                >
                                    <option value="">Select Type</option>
                                    <option value="Sick Leave">Sick Leave</option>
                                    <option value="Casual Leave">Casual Leave</option>
                                    <option value="Medical Leave">Medical Leave</option>
                                    <option value="Personal Leave">Personal Leave</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Start Date</label>
                                    <input 
                                        type="date" 
                                        min={today}
                                        className="w-full bg-slate-50 border-2 border-slate-50 rounded-2xl px-5 py-3.5 text-sm font-bold text-[#1C2B4E] focus:bg-white focus:border-blue-100 outline-none transition-all"
                                        value={startDate}
                                        onChange={(e) => setStartDate(e.target.value)}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">End Date</label>
                                    <input 
                                        type="date" 
                                        min={startDate || today}
                                        className="w-full bg-slate-50 border-2 border-slate-50 rounded-2xl px-5 py-3.5 text-sm font-bold text-[#1C2B4E] focus:bg-white focus:border-blue-100 outline-none transition-all"
                                        value={endDate}
                                        onChange={(e) => setEndDate(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2 relative">
                                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1 flex justify-between">
                                    Short Description
                                    <span className={reason.length > 70 ? 'text-rose-500' : 'text-slate-300'}>{reason.length}/75</span>
                                </label>
                                <textarea 
                                    maxLength={75}
                                    rows={3}
                                    placeholder="Brief reason for your leave..."
                                    className="w-full bg-slate-50 border-2 border-slate-50 rounded-2xl px-5 py-4 text-sm font-bold text-[#1C2B4E] focus:bg-white focus:border-blue-100 outline-none transition-all resize-none"
                                    value={reason}
                                    onChange={(e) => setReason(e.target.value)}
                                />
                            </div>

                            <button 
                                type="submit"
                                disabled={loading}
                                className="w-full py-4 bg-[#0047AB] text-white rounded-2xl font-black text-sm shadow-xl shadow-blue-100 hover:bg-[#003991] active:scale-95 transition-all flex items-center justify-center gap-2 group disabled:opacity-50"
                            >
                                {loading ? <FiLoader className="animate-spin" /> : 'Apply for Leave'}
                            </button>
                        </form>
                    </div>
                </div>

                {/* History List */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="flex items-center gap-3 mb-2 px-2">
                        <div className="w-10 h-10 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400">
                            <FiClock size={20} strokeWidth={2.5} />
                        </div>
                        <h3 className="text-xl font-black text-[#1C2B4E]">My Leave History</h3>
                    </div>

                    {fetchingHistory ? (
                        <div className="p-20 flex flex-col items-center justify-center bg-white rounded-[40px] border border-slate-50 shadow-sm border-dashed">
                            <FiLoader className="text-slate-200 animate-spin mb-4" size={40} />
                        </div>
                    ) : history.length > 0 ? (
                        <div className="space-y-6">
                            {history.map((leave) => (
                                <div key={leave.id} className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm hover:shadow-md transition-all group overflow-hidden relative border-l-4 border-l-[#0047AB]">
                                    <div className="flex flex-col md:flex-row justify-between md:items-center gap-6">
                                        <div className="flex items-start gap-6">
                                            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center font-black text-lg shadow-sm
                                                ${leave.status === 'Approved' ? 'bg-emerald-50 text-emerald-500' : 
                                                  leave.status === 'Rejected' ? 'bg-rose-50 text-rose-500' : 'bg-orange-50 text-orange-500'}`}>
                                                {leave.leaveType[0]}
                                            </div>
                                            <div className="space-y-1">
                                                <h4 className="text-lg font-black text-[#1C2B4E]">{leave.leaveType}</h4>
                                                <div className="flex items-center gap-4 text-xs font-bold text-slate-400 uppercase tracking-tight">
                                                    <span className="flex items-center gap-1.5"><FiCalendar size={14} /> {new Date(leave.startDate).toLocaleDateString()} - {new Date(leave.endDate).toLocaleDateString()}</span>
                                                </div>
                                                <p className="text-sm font-bold text-slate-500 mt-2">"{leave.reason}"</p>
                                            </div>
                                        </div>
                                        <div className="flex flex-col items-end gap-2">
                                            <span className={`px-5 py-2 rounded-xl text-[11px] font-black uppercase tracking-widest leading-none border
                                                ${leave.status === 'Approved' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 
                                                  leave.status === 'Rejected' ? 'bg-rose-50 text-rose-600 border-rose-100' : 'bg-orange-50 text-orange-600 border-orange-100'}`}>
                                                {leave.status}
                                            </span>
                                            <span className="text-[10px] font-bold text-slate-300">Applied: {new Date(leave.appliedOn).toLocaleDateString()}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="p-20 flex flex-col items-center justify-center bg-white rounded-[40px] border border-slate-100 shadow-sm border-dashed">
                            <div className="w-16 h-16 bg-slate-50 rounded-3xl flex items-center justify-center text-slate-100 mb-6">
                                <FiFileText size={40} />
                            </div>
                            <h4 className="text-xl font-black text-slate-200 uppercase tracking-widest">No Leave Records</h4>
                            <p className="text-slate-300 font-bold mt-2">Your submitted leave requests will appear here.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default LeaveRequests;
