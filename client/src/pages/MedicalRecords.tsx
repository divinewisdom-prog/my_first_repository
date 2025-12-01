import { useState, useEffect } from 'react';
import { Plus, Search, FileText, User, Calendar } from 'lucide-react';
import { medicalRecordService } from '../services/api';
import MedicalRecordForm from '../components/MedicalRecordForm';

const MedicalRecords = () => {
    const [records, setRecords] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    const fetchRecords = async () => {
        try {
            const data = await medicalRecordService.getAll();
            setRecords(data);
        } catch (error) {
            console.error('Error fetching records:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRecords();
    }, []);

    const handleCreateRecord = async (data: any) => {
        await medicalRecordService.create(data);
        fetchRecords();
    };

    const filteredRecords = records.filter(record =>
        record.patient?.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.patient?.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.diagnosis.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-slate-900">Medical Records</h2>
                    <p className="text-slate-500 text-sm">Patient history and prescriptions</p>
                </div>
                <button
                    onClick={() => setShowForm(true)}
                    className="btn-primary flex items-center gap-2"
                >
                    <Plus className="w-4 h-4" />
                    Add Record
                </button>
            </div>

            <div className="card p-4">
                <div className="flex items-center gap-4 mb-6">
                    <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search by patient or diagnosis..."
                            className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                <div className="space-y-4">
                    {loading ? (
                        <div className="text-center py-8 text-slate-500">Loading records...</div>
                    ) : filteredRecords.length === 0 ? (
                        <div className="text-center py-8 text-slate-500">No records found.</div>
                    ) : (
                        filteredRecords.map((record) => (
                            <div key={record._id} className="card p-6 border border-slate-100 hover:shadow-md transition-shadow">
                                <div className="flex flex-col md:flex-row justify-between gap-4 mb-4">
                                    <div className="flex items-start gap-4">
                                        <div className="p-3 bg-indigo-50 text-indigo-600 rounded-lg">
                                            <FileText className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-lg text-slate-900">{record.diagnosis}</h4>
                                            <div className="flex items-center gap-4 mt-1 text-sm text-slate-500">
                                                <span className="flex items-center gap-1">
                                                    <User className="w-3 h-3" />
                                                    {record.patient ? `${record.patient.firstName} ${record.patient.lastName}` : 'Unknown Patient'}
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <Calendar className="w-3 h-3" />
                                                    {new Date(record.date).toLocaleDateString()}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="text-sm text-slate-500">
                                        Dr. {record.doctor?.name || 'Unknown'}
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-50">
                                    <div>
                                        <h5 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Prescription</h5>
                                        <p className="text-slate-700 text-sm whitespace-pre-line">{record.prescription}</p>
                                    </div>
                                    {record.notes && (
                                        <div>
                                            <h5 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Notes</h5>
                                            <p className="text-slate-600 text-sm">{record.notes}</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {showForm && (
                <MedicalRecordForm
                    onClose={() => setShowForm(false)}
                    onSubmit={handleCreateRecord}
                />
            )}
        </div>
    );
};

export default MedicalRecords;
