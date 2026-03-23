import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

/**
 * DocumentsTab Component
 * 
 * Digital repository for storing documents in Cloudinary.
 * Features: Upload, View, Download, and Delete.
 */
const DocumentsTab = ({ user }) => {
    const [documents, setDocuments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const fileInputRef = useRef(null);
    
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5056';

    useEffect(() => {
        if (user) {
            fetchDocuments();
        }
    }, [user]);

    const fetchDocuments = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`${API_URL}/api/portal/documents/${user.role}/${user.id}`);
            setDocuments(response.data);
        } catch (err) {
            console.error('Fetch Documents Error:', err);
            toast.error('Failed to load documents.');
        } finally {
            setLoading(false);
        }
    };

    const handleUploadClick = () => {
        fileInputRef.current.click();
    };

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('file', file);
        formData.append('userId', user.id);
        formData.append('role', user.role);
        formData.append('filename', file.name);

        try {
            setUploading(true);
            toast.info('Uploading document...');
            await axios.post(`${API_URL}/api/portal/documents/upload`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            toast.success('Document uploaded successfully!');
            fetchDocuments(); // Refresh list
        } catch (err) {
            console.error('Upload Error:', err);
            toast.error('Failed to upload document.');
        } finally {
            setUploading(false);
            e.target.value = null; // Reset input
        }
    };

    const handleDelete = async (docId) => {
        if (!window.confirm('Are you sure you want to delete this document?')) return;

        try {
            await axios.delete(`${API_URL}/api/portal/documents/${docId}`, {
                params: { userId: user.id, role: user.role }
            });
            toast.success('Document deleted.');
            setDocuments(documents.filter(doc => doc.id !== docId));
        } catch (err) {
            console.error('Delete Error:', err);
            toast.error('Failed to delete document.');
        }
    };

    const handleDownload = (url) => {
        window.open(url, '_blank');
    };

    const formatSize = (bytes) => {
        if (!bytes) return '0 KB';
        const kb = bytes / 1024;
        if (kb < 1024) return kb.toFixed(1) + ' KB';
        return (kb / 1024).toFixed(1) + ' MB';
    };

    const formatDate = (dateStr) => {
        return new Date(dateStr).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    return (
        <div className="animate-in fade-in duration-700 w-full font-inter space-y-8 pb-12">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-black text-[#1C2B4E]">My Cloud Storage</h2>
                    <p className="text-slate-400 font-bold text-sm tracking-tight mt-1">Manage your personal documents securely</p>
                </div>
                
                <input 
                    type="file" 
                    ref={fileInputRef} 
                    onChange={handleFileChange} 
                    className="hidden" 
                    accept=".pdf,.docx,.xlsx,.jpg,.png,.txt"
                />
                
                <button 
                    onClick={handleUploadClick}
                    disabled={uploading}
                    className="bg-[#004AAD] text-white px-8 py-4 rounded-2xl font-black text-sm shadow-xl shadow-blue-100 flex items-center gap-3 transition-all active:scale-95 disabled:opacity-50"
                >
                    {uploading ? (
                        <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                    ) : (
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                        </svg>
                    )}
                    Upload New
                </button>
            </div>

            {loading ? (
                <div className="flex flex-col items-center justify-center py-20">
                    <div className="w-12 h-12 border-4 border-slate-100 border-t-[#004AAD] rounded-full animate-spin mb-4"></div>
                    <p className="text-slate-400 font-bold">Accessing your cloud storage...</p>
                </div>
            ) : documents.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-32 bg-white rounded-[32px] border-2 border-dashed border-slate-100">
                    <div className="w-20 h-20 bg-blue-50 rounded-3xl flex items-center justify-center text-[#004AAD] mb-6">
                        <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
                        </svg>
                    </div>
                    <h3 className="text-xl font-black text-[#1C2B4E] mb-2">No documents yet</h3>
                    <p className="text-slate-400 font-bold max-w-xs text-center">Start uploading your important documents to keep them safe and accessible.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {documents.map((doc) => (
                        <div key={doc.id} className="bg-white rounded-[24px] border border-slate-100 shadow-sm p-8 hover:shadow-xl hover:-translate-y-1 transition-all group relative overflow-hidden">
                            <div className="flex justify-between items-start mb-6">
                                <div className="p-3 bg-slate-50 rounded-2xl text-[#004AAD] group-hover:bg-[#004AAD] group-hover:text-white transition-colors">
                                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h10M9 8h6m2 2V4a2 2 0 00-2-2H9a2 2 0 00-2 2v16a2 2 0 002 2h8a2 2 0 002-2v-3" />
                                    </svg>
                                </div>
                                <div className="flex gap-2">
                                    <button 
                                        onClick={() => handleDownload(doc.file_url)}
                                        className="p-2 text-slate-400 hover:text-[#004AAD] hover:bg-blue-50 rounded-lg transition-all"
                                        title="Download/View"
                                    >
                                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                        </svg>
                                    </button>
                                    <button 
                                        onClick={() => handleDelete(doc.id)}
                                        className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-all"
                                        title="Delete"
                                    >
                                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                        </svg>
                                    </button>
                                </div>
                            </div>

                            <h4 className="text-[17px] font-black text-[#1C2B4E] leading-tight mb-4 break-words">
                                {doc.filename}
                            </h4>

                            <div className="flex items-center gap-4 text-[11px] font-black text-slate-300 uppercase tracking-widest border-t border-slate-50 pt-4">
                                <span className="flex items-center gap-1.5">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                                    {formatSize(doc.size)}
                                </span>
                                <span className="flex items-center gap-1.5">
                                    <span className="w-1.5 h-1.5 rounded-full bg-[#004AAD]"></span>
                                    {formatDate(doc.uploaded_at)}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default DocumentsTab;
