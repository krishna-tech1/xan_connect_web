import React, { useState, useEffect } from 'react';
import axios from 'axios';

const FeesTab = ({ user }) => {
    const [feeData, setFeeData] = useState(null);
    const [loading, setLoading] = useState(true);
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5056';
    const studentId = user?.studentId || user?.id;

    useEffect(() => {
        if (!studentId) {
            setLoading(false);
            return;
        }
        const fetchFees = async () => {
            try {
                const res = await axios.get(`${API_URL}/api/portal/student-fees/${studentId}`);
                setFeeData(res.data);
            } catch (err) {
                console.error('Fees fetch error:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchFees();
    }, [studentId]);

    const statsConfig = [
        { label: 'Annual Fee', value: feeData?.stats?.annual || '₹0', icon: null },
        { label: 'Total Paid', value: feeData?.stats?.paid || '₹0', icon: 'M5 13l4 4L19 7', iconColor: 'text-green-600', bgColor: 'bg-green-50' },
        { label: 'Pending', value: feeData?.stats?.pending || '₹0', icon: 'M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z', iconColor: 'text-red-500', bgColor: 'bg-red-50' },
    ];

    if (loading) return <p className="text-slate-300 font-bold p-10 text-center animate-pulse tracking-widest uppercase text-xs">Fetching Fee Records...</p>;

    return (
        <div className="animate-in fade-in duration-500 w-full font-inter space-y-8 pb-12">
            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {statsConfig.map((stat, i) => (
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
                            {(!feeData?.breakdown || feeData.breakdown.length === 0) ? (
                                <tr>
                                    <td colSpan="3" className="py-8 text-center text-slate-300 font-bold text-xs uppercase tracking-widest border-2 border-dashed border-slate-50 rounded-xl">
                                        No Fee Breakdown defined for this class
                                    </td>
                                </tr>
                            ) : (
                                feeData.breakdown.map((row, i) => (
                                    <tr key={i} className="text-sm font-bold text-[#2D3748]">
                                        <td className="py-4 font-inter">{row.name}</td>
                                        <td className="py-4 text-slate-400 font-medium font-inter">{row.period}</td>
                                        <td className="py-4 text-right font-black font-inter">{row.amount}</td>
                                    </tr>
                                ))
                            )}
                            <tr className="text-sm font-black text-[#1C2B4E] border-t-2 border-slate-100">
                                <td className="py-6 font-inter underline decoration-slate-100 underline-offset-8">Total Annual</td>
                                <td></td>
                                <td className="py-6 text-right font-inter">{feeData?.totalAnnualStr || '₹0'}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

        </div>
    );
};

export default FeesTab;
