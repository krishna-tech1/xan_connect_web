import React from 'react';

const FeesTab = () => {
    const stats = [
        { label: 'Annual Fee', value: '₹35,500', icon: null },
        { label: 'Total Paid', value: '₹1,10,500', icon: 'M5 13l4 4L19 7', iconColor: 'text-green-600', bgColor: 'bg-green-50' },
        { label: 'Pending', value: '₹25,000', icon: 'M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z', iconColor: 'text-red-500', bgColor: 'bg-red-50' },
    ];

    const feeBreakdown = [
        { name: 'Tuition Fee', period: 'Quarterly ( 1/4 year )', amount: '₹25,000' },
        { name: 'Lab Fee', period: 'Annual ( 1 year )', amount: '₹3,000' },
        { name: 'Library Fee', period: 'Annual ( 1 year )', amount: '₹1,500' },
        { name: 'Sports Fee', period: 'Annual ( 1 year )', amount: '₹2,000' },
        { name: 'Computer Lab Fee', period: 'Annual ( 1 year )', amount: '₹2,500' },
        { name: 'Activity Fee', period: 'Annual ( 1 year )', amount: '₹1,500' },
    ];

    const installmentStatus = [
        { name: 'Q1 (Apr–Jun 2025)', details: 'Due: Apr 15, 2025  •  Paid: Apr 10, 2025', amount: '₹25,500', status: 'Paid' },
        { name: 'Q2 (Jul–Sep 2025)', details: 'Due: Jul 15, 2025  •  Paid: Jul 12, 2025', amount: '₹25,000', status: 'Paid' },
        { name: 'Q3 (Oct–Dec 2025)', details: 'Due: Oct 15, 2025  •  Paid: Oct 14, 2025', amount: '₹25,000', status: 'Paid' },
        { name: 'Q4 (Jan–Mar 2026)', details: 'Due: Jan 15, 2026', amount: '₹25,000', status: 'Overdue' },
        { name: 'Annual Fees', details: 'Due: Apr 15, 2025  •  Paid: Apr 10, 2025', amount: '₹10,500', status: 'Paid' },
    ];

    const paymentHistory = [
        { date: 'Oct 14, 2025', amount: '₹25,000', method: 'Online (UPI)', ref: 'RCP-2025-003' },
        { date: 'Jul 12, 2025', amount: '₹25,000', method: 'Cash', ref: 'RCP-2025-003' },
        { date: 'Apr 10, 2025', amount: '₹10,000', method: 'Online (Net Banking)', ref: 'RCP-2025-003' },
        { date: 'Apr 10, 2025', amount: '₹25,000', method: 'Cash', ref: 'RCP-2025-003' },
        { date: 'Apr 10, 2025', amount: '₹35,500', method: 'Cash', ref: 'RCP-2025-003' },
        { date: 'Apr 10, 2025', amount: '₹25,000', method: 'Cash', ref: 'RCP-2025-003' },
    ];

    return (
        <div className="animate-in fade-in duration-500 w-full font-inter space-y-8 pb-12">
            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {stats.map((stat, i) => (
                    <div key={i} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col items-center justify-center">
                        <div className="flex items-center gap-3">
                            {stat.icon && (
                                <div className={`w-5 h-5 flex items-center justify-center rounded-full ${stat.bgColor} ${stat.iconColor}`}>
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="w-3.5 h-3.5">
                                        <path strokeLinecap="round" strokeLinejoin="round" d={stat.icon} />
                                    </svg>
                                </div>
                            )}
                            <h4 className="text-2xl font-black text-[#1A202C] leading-none">{stat.value}</h4>
                        </div>
                        <p className="text-[11px] font-bold text-slate-300 uppercase mt-2 tracking-tight">{stat.label}</p>
                    </div>
                ))}
            </div>

            {/* Fee Breakdown */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-slate-50">
                    <h3 className="text-base font-black text-[#1C2B4E]">Fee Breakdown</h3>
                </div>
                <div className="p-6">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="text-[11px] font-bold text-slate-300 uppercase tracking-wider pb-4">
                                <th className="pb-4 font-inter">Fee</th>
                                <th className="pb-4 font-inter">Period</th>
                                <th className="pb-4 text-right font-inter">Amount</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {feeBreakdown.map((row, i) => (
                                <tr key={i} className="text-sm font-bold text-[#2D3748]">
                                    <td className="py-4 font-inter">{row.name}</td>
                                    <td className="py-4 text-slate-400 font-medium font-inter">{row.period}</td>
                                    <td className="py-4 text-right font-black font-inter">{row.amount}</td>
                                </tr>
                            ))}
                            <tr className="text-sm font-black text-[#1C2B4E] border-t-2 border-slate-100">
                                <td className="py-6 font-inter underline decoration-slate-100 underline-offset-8">Total</td>
                                <td></td>
                                <td className="py-6 text-right font-inter">₹35,500</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Installment Status */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-slate-50">
                    <h3 className="text-base font-black text-[#1C2B4E]">Installment Status</h3>
                </div>
                <div className="p-6 space-y-4">
                    {installmentStatus.map((row, i) => (
                        <div key={i} className="flex items-center justify-between p-4 rounded-xl border border-slate-50 hover:bg-slate-50/50 transition-colors">
                            <div className="flex items-center gap-4">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${row.status === 'Paid' ? 'bg-green-50 text-green-500' : 'bg-red-50 text-red-400'}`}>
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="w-4 h-4">
                                        {row.status === 'Paid' ? (
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                        ) : (
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        )}
                                    </svg>
                                </div>
                                <div>
                                    <h5 className="text-[14px] font-black text-[#2D3748]">{row.name}</h5>
                                    <p className="text-[11px] font-bold text-slate-300 mt-0.5">{row.details}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-8">
                                <span className="text-[14px] font-black text-[#2D3748]">{row.amount}</span>
                                <span className={`px-5 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-tight border ${row.status === 'Paid' ? 'bg-green-50 text-green-500 border-green-100' : 'bg-orange-50 text-orange-400 border-orange-100'}`}>
                                    {row.status}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Payment History */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-slate-50">
                    <h3 className="text-base font-black text-[#1C2B4E]">Payment History</h3>
                </div>
                <div className="p-6 overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="text-[11px] font-bold text-slate-300 uppercase tracking-wider">
                                <th className="pb-4 font-inter">Date</th>
                                <th className="pb-4 font-inter">Amount</th>
                                <th className="pb-4 font-inter">Method</th>
                                <th className="pb-4 font-inter">Method</th>
                                <th className="pb-4 text-right font-inter">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {paymentHistory.map((row, i) => (
                                <tr key={i} className="text-sm font-bold text-[#2D3748] group hover:bg-slate-50/50 transition-colors">
                                    <td className="py-5 font-inter font-semibold">{row.date}</td>
                                    <td className="py-5 font-inter font-black">{row.amount}</td>
                                    <td className="py-5 text-slate-400 font-medium font-inter">{row.method}</td>
                                    <td className="py-5 text-slate-400 font-medium font-inter">{row.ref}</td>
                                    <td className="py-5 text-right">
                                        <button className="text-[#004AAD] font-black text-xs inline-flex items-center gap-1.5 hover:underline decoration-2 underline-offset-4">
                                            Receipt
                                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                            </svg>
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default FeesTab;
