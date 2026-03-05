import React from 'react';

/**
 * TransportTab Component
 * 
 * Renders the school bus route, stops, driver details, and fee information.
 * Rebuilt to match the premium high-fidelity reference design.
 */
const TransportTab = () => {
    const stops = [
        { name: 'Green Park (Start)', time: '7:50 am', distance: '9 km from school', current: false },
        { name: 'Lajpat Nagar', time: '8:00 am', distance: '7 km from school', current: false },
        { name: "MG Road (Aryan's Stop)", time: '8:15 am', distance: '3 km from school', current: true },
        { name: 'Lajpat Nagar', time: '8:20 am', distance: '2 km from school', current: false },
        { name: 'School (End)', time: '8:25 am', distance: '0 km from school', current: false }
    ];

    return (
        <div className="animate-in fade-in duration-500 w-full font-inter pb-12">
            {/* Top Stats Cards & Action */}
            <div className="flex flex-wrap lg:flex-nowrap items-center gap-6 mb-10 text-center">
                <div className="flex-1 min-w-[180px] bg-white p-6 rounded-[24px] border border-slate-100 shadow-sm flex flex-col items-center">
                    <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-[#004AAD] mb-3">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M8 7h12m0 0l-4-4m4 4l-4 4" />
                        </svg>
                    </div>
                    <h4 className="text-[17px] font-black text-[#1C2B4E]">Bus #5</h4>
                    <p className="text-[11px] font-bold text-slate-300 uppercase tracking-widest mt-1">DL-01-AB-1234</p>
                </div>

                <div className="flex-1 min-w-[180px] bg-white p-6 rounded-[24px] border border-slate-100 shadow-sm flex flex-col items-center">
                    <div className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center text-purple-500 mb-3">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        </svg>
                    </div>
                    <h4 className="text-[17px] font-black text-[#1C2B4E]">MG Road</h4>
                    <p className="text-[11px] font-bold text-slate-300 uppercase tracking-widest mt-1">Pickup Stop</p>
                </div>

                <div className="flex-1 min-w-[180px] bg-white p-6 rounded-[24px] border border-slate-100 shadow-sm flex flex-col items-center">
                    <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center text-green-500 mb-3">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <h4 className="text-[17px] font-black text-[#1C2B4E]">7:30 AM</h4>
                    <p className="text-[11px] font-bold text-slate-300 uppercase tracking-widest mt-1">Transport Time</p>
                </div>

                <div className="flex-1 min-w-[180px] bg-white p-6 rounded-[24px] border border-slate-100 shadow-sm flex flex-col items-center">
                    <div className="w-10 h-10 bg-orange-50 rounded-xl flex items-center justify-center text-orange-500 mb-3">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                        </svg>
                    </div>
                    <h4 className="text-[17px] font-black text-[#1C2B4E]">₹3,000/mo</h4>
                    <p className="text-[11px] font-bold text-slate-300 uppercase tracking-widest mt-1">Transport Fee</p>
                </div>

                <button className="bg-[#004AAD] hover:bg-[#003991] text-white px-8 py-4 rounded-xl font-bold text-sm shadow-lg shadow-blue-100 flex items-center gap-2.5 transition-all active:scale-95 leading-none">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    Change Stop
                </button>
            </div>

            {/* Main Content Area */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Route Stops Timeline */}
                <div className="lg:col-span-2 bg-white rounded-[28px] border border-slate-100 shadow-sm p-10">
                    <h3 className="text-lg font-black text-[#1C2B4E] mb-12">Route Stops</h3>

                    <div className="relative pl-12">
                        {/* Vertical Connector Line */}
                        <div className="absolute left-[20px] top-2 bottom-6 w-0.5 bg-slate-100"></div>

                        <div className="space-y-12">
                            {stops.map((stop, i) => (
                                <div key={i} className="relative flex items-center justify-between">
                                    {/* Stop Bullet */}
                                    <div className={`absolute -left-[44px] w-6 h-6 rounded-full border-4 border-white shadow-sm z-10 ${stop.current ? 'bg-[#004AAD] ring-4 ring-blue-50 opacity-100' : 'bg-slate-200 opacity-60'
                                        }`}></div>

                                    <div>
                                        <div className="flex items-center gap-3">
                                            <h4 className={`text-[16px] font-black ${stop.current ? 'text-[#004AAD]' : 'text-[#1C2B4E]'}`}>
                                                {stop.name}
                                            </h4>
                                            <span className="bg-blue-50 text-[#004AAD] px-3 py-1 rounded-lg text-[10px] font-black shadow-sm">
                                                {stop.time}
                                            </span>
                                        </div>
                                        <p className="text-xs font-bold text-slate-300 mt-1 uppercase tracking-tight">
                                            {stop.distance}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right Column: Driver & Fee */}
                <div className="space-y-8">
                    {/* Driver Details */}
                    <div className="bg-white rounded-[28px] border border-slate-100 shadow-sm p-8">
                        <h3 className="text-lg font-black text-[#1C2B4E] mb-8">Driver Details</h3>
                        <div className="space-y-6">
                            {[
                                { name: 'Mr. Ramesh Kumar', role: 'Driver' },
                                { name: 'Mr. Suresh', role: 'Conductor' }
                            ].map((person, i) => (
                                <div key={i} className="flex items-center justify-between p-4 rounded-2xl bg-[#F8FAFC] border border-slate-50">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-full bg-blue-100/50 flex items-center justify-center text-[#004AAD] font-black text-sm">
                                            {person.name[0]}
                                        </div>
                                        <div>
                                            <h5 className="text-sm font-black text-[#1C2B4E]">{person.name}</h5>
                                            <p className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">{person.role}</p>
                                        </div>
                                    </div>
                                    <button className="w-10 h-10 bg-[#004AAD] text-white rounded-full flex items-center justify-center shadow-lg shadow-blue-100 hover:scale-105 active:scale-95 transition-all">
                                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                            <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 005.457 5.457l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                                        </svg>
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Transport Fee card */}
                    <div className="bg-white rounded-[28px] border border-slate-100 shadow-sm p-8">
                        <h3 className="text-lg font-black text-[#1C2B4E] mb-8">Transport Fee</h3>
                        <div className="space-y-5">
                            <div className="flex justify-between items-center pb-4 border-b border-slate-50">
                                <span className="text-sm font-bold text-slate-400">Monthly Fee</span>
                                <span className="text-sm font-black text-[#1C2B4E]">₹3,000</span>
                            </div>
                            <div className="flex justify-between items-center pb-4 border-b border-slate-50">
                                <span className="text-sm font-bold text-slate-400">Status (Feb 2026)</span>
                                <span className="text-m font-black text-[#1C2B4E]">₹3,000</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-sm font-bold text-slate-400">Next Due</span>
                                <span className="text-sm font-black text-[#1C2B4E]">Mar 5, 2026</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TransportTab;
