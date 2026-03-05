import React from 'react';

const LeaveRequests = () => {
    const requests = [
        { id: 1, name: 'Aaryan Rao', class: '10-A', reason: 'Family medical emergency', date: 'Feb 26 - Feb 28', status: 'Pending' },
        { id: 2, name: 'Ishita Sharma', class: '10-A', reason: 'Fever and viral infection', date: 'Feb 25 - Feb 26', status: 'Approved' },
        { id: 3, name: 'Karan Mehra', class: '10-A', reason: 'Sister\'s marriage ceremony', date: 'Mar 05 - Mar 10', status: 'Received' },
    ];

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex justify-between items-end mb-8">
                <div>
                    <h2 className="text-3xl font-black text-secondary">Leave Requests</h2>
                    <p className="text-accent font-medium">Review and approve student absence applications</p>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-6">
                {requests.map((req) => (
                    <div key={req.id} className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm hover:shadow-xl hover:border-transparent transition-all group overflow-hidden relative">
                        <div className="flex justify-between items-center relative z-10">
                            <div className="flex items-center gap-8">
                                <div className="w-16 h-16 rounded-[24px] bg-slate-50 flex items-center justify-center font-black text-primary text-xl border border-slate-100 group-hover:bg-primary group-hover:text-white transition-all">
                                    {req.name[0]}
                                </div>
                                <div className="flex flex-col gap-1">
                                    <div className="flex items-center gap-3">
                                        <h4 className="text-xl font-black text-secondary">{req.name}</h4>
                                        <span className="bg-primary/5 text-primary text-[10px] font-black uppercase px-2.5 py-1 rounded-lg">{req.class}</span>
                                    </div>
                                    <p className="text-sm font-bold text-accent italic">"{req.reason}"</p>
                                    <p className="text-[10px] font-black text-accent uppercase tracking-widest mt-1">Requested for: {req.date}</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-4">
                                {req.status === 'Approved' ? (
                                    <span className="bg-green-100 text-green-600 px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest">APPROVED ✅</span>
                                ) : (
                                    <>
                                        <button className="px-6 py-3 rounded-2xl bg-slate-50 text-red-500 text-[10px] font-black uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all">Reject</button>
                                        <button className="px-6 py-3 rounded-2xl bg-secondary text-white text-[10px] font-black uppercase tracking-widest hover:bg-black transition-all shadow-lg shadow-blue-50">Approve Leave</button>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default LeaveRequests;
