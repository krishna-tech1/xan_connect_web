import React, { useState } from 'react';

/**
 * DocumentsTab Component
 * 
 * Rebuilt to match the teacher portal's digital repository design.
 * Features category filters, document grid, and global upload actions.
 */
const DocumentsTab = () => {
    const [activeFilter, setActiveFilter] = useState('All');

    const filters = ['All', 'Admin', 'Exam', 'School Document', 'Study Material'];

    const documents = [
        {
            id: 1,
            title: 'Report Card — Term 1 (2025-26)',
            category: 'Study Material',
            format: 'PDF',
            size: '1.2 MB',
            date: 'Dec 20, 2025',
            tagColor: 'bg-blue-50 text-[#004AAD]'
        },
        {
            id: 2,
            title: 'Statistics Formula Sheet',
            category: 'Study Material',
            format: 'PDF',
            size: '0.5 MB',
            date: 'Aug 15, 2024',
            tagColor: 'bg-blue-50 text-[#004AAD]'
        },
        {
            id: 3,
            title: '10-A Mid-Term Question Paper',
            category: 'Exam',
            format: 'DOCX',
            size: '1.2 MB',
            date: 'Dec 20, 2025',
            tagColor: 'bg-blue-50 text-[#004AAD]'
        },
        {
            id: 4,
            title: 'Class 10-A Student List',
            category: 'Admin',
            format: 'XLSX',
            size: '0.5 MB',
            date: 'Aug 15, 2024',
            tagColor: 'bg-blue-50 text-[#004AAD]'
        },
        {
            id: 5,
            title: 'Annual Academic Calendar 2025-26',
            category: 'School Document',
            format: 'JPG',
            size: '0.5 MB',
            date: 'Aug 20, 2024',
            tagColor: 'bg-blue-50 text-[#004AAD]'
        }
    ];

    const filteredDocs = activeFilter === 'All'
        ? documents
        : documents.filter(doc => doc.category === activeFilter);

    return (
        <div className="animate-in fade-in duration-700 w-full font-inter space-y-8 pb-12">
            {/* Filter Bar & Upload Button Container */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div className="flex items-center gap-2 overflow-x-auto pb-2 lg:pb-0">
                    {filters.map((filter) => (
                        <button
                            key={filter}
                            onClick={() => setActiveFilter(filter)}
                            className={`px-8 py-3.5 rounded-xl text-[14px] font-black transition-all whitespace-nowrap ${activeFilter === filter
                                    ? 'bg-[#004AAD] text-white shadow-lg shadow-blue-100'
                                    : 'bg-slate-50 text-slate-400 hover:bg-slate-100'
                                }`}
                        >
                            {filter}
                        </button>
                    ))}
                </div>

                <button className="bg-[#004AAD] text-white px-10 py-3.5 rounded-xl font-bold text-sm shadow-lg shadow-blue-100 flex items-center gap-3 transition-all active:scale-95 leading-none shrink-0">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                    </svg>
                    Upload Document
                </button>
            </div>

            {/* Documents Grid */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                {filteredDocs.map((doc) => (
                    <div key={doc.id} className="bg-white rounded-[16px] border border-slate-100 shadow-sm p-8 hover:shadow-md transition-all group flex flex-col justify-between h-full">
                        <div className="flex justify-between items-start mb-6">
                            <span className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-tight ${doc.tagColor}`}>
                                {doc.category}
                            </span>
                            <button className="text-[#004AAD] hover:scale-110 active:scale-90 transition-all p-1">
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                </svg>
                            </button>
                        </div>

                        <div className="space-y-3">
                            <h3 className="text-[16px] font-black text-[#1C2B4E] leading-tight group-hover:text-[#004AAD] transition-colors">
                                {doc.title}
                            </h3>

                            <div className="flex items-center gap-2 text-xs font-bold text-slate-300">
                                <span>{doc.format}</span>
                                <span className="opacity-50">•</span>
                                <span>{doc.size}</span>
                                <span className="opacity-50">•</span>
                                <span>{doc.date}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default DocumentsTab;
