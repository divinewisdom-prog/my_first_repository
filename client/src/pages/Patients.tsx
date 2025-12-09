import { useState, useEffect } from 'react';
import { Plus, Search, Filter, MoreVertical, Activity } from 'lucide-react';
import { patientService } from '../services/api';
import { vitalService } from '../services/vitalService';
import { useToast } from '../context/ToastContext';
import PatientForm from '../components/PatientForm';
import VitalForm from '../components/VitalForm';
import VitalList from '../components/VitalList';

const Patients = () => {
    const { showToast } = useToast();
    const [patients, setPatients] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    // Vitals State
    const [selectedPatient, setSelectedPatient] = useState<any>(null);
    const [showVitalForm, setShowVitalForm] = useState(false);
    const [vitals, setVitals] = useState<any[]>([]);
    const [showVitalsModal, setShowVitalsModal] = useState(false);

    const fetchPatients = async () => {
        try {
            const data = await patientService.getAll();
            console.log('Fetched patients:', data);
            setPatients(data);
        } catch (error) {
            console.error('Error fetching patients:', error);
            showToast('Failed to load patients', 'error');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPatients();
    }, []);

    const handleCreatePatient = async (data: any) => {
        try {
            await patientService.create(data);
            showToast('Patient created successfully', 'success');
            fetchPatients();
            setShowForm(false);
        } catch (error) {
            showToast('Failed to create patient', 'error');
        }
    };

    const handleViewVitals = async (patient: any) => {
        setSelectedPatient(patient);
        try {
            const data = await vitalService.getByPatient(patient._id);
            setVitals(data);
            setShowVitalsModal(true);
        } catch (error) {
            console.error('Error fetching vitals:', error);
            showToast('Failed to load vitals', 'error');
        }
    };

    const handleAddVital = async (data: any) => {
        try {
            await vitalService.create(data);
            const updatedVitals = await vitalService.getByPatient(selectedPatient._id);
            setVitals(updatedVitals);
            setShowVitalForm(false);
            showToast('Vital record added', 'success');
        } catch (error) {
            console.error('Error creating vital:', error);
            showToast('Failed to add vital record', 'error');
        }
    };

    const handleDeleteVital = async (id: string) => {
        if (window.confirm('Are you sure you want to delete this vital record?')) {
            try {
                await vitalService.delete(id);
                const updatedVitals = await vitalService.getByPatient(selectedPatient._id);
                setVitals(updatedVitals);
                showToast('Vital record deleted', 'success');
            } catch (error) {
                console.error('Error deleting vital:', error);
                showToast('Failed to delete vital record', 'error');
            }
        }
    };

    const filteredPatients = patients.filter(patient =>
        patient.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        patient.lastName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-slate-900">Patients</h2>
                    <p className="text-slate-500 text-sm">Manage your patient records</p>
                </div>
                <button
                    onClick={() => setShowForm(true)}
                    className="btn-primary flex items-center gap-2"
                >
                    <Plus className="w-4 h-4" />
                    Add Patient
                </button>
            </div>

            <div className="card p-4">
                <div className="flex flex-col sm:flex-row gap-4 mb-6">
                    <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search patients..."
                            className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <button className="px-4 py-2 border border-slate-300 rounded-lg flex items-center gap-2 hover:bg-slate-50 text-slate-700">
                        <Filter className="w-4 h-4" />
                        Filters
                    </button>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="text-slate-500 text-sm border-b border-slate-100">
                                <th className="p-3 font-medium">Name</th>
                                <th className="p-3 font-medium">ID</th>
                                <th className="p-3 font-medium">Age/Gender</th>
                                <th className="p-3 font-medium">Contact</th>
                                <th className="p-3 font-medium">Last Visit</th>
                                <th className="p-3 font-medium">Action</th>
                            </tr>
                        </thead>
                        <tbody className="text-sm">
                            {loading ? (
                                <tr>
                                    <td colSpan={6} className="p-8 text-center text-slate-500">Loading patients...</td>
                                </tr>
                            ) : filteredPatients.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="p-8 text-center text-slate-500">No patients found.</td>
                                </tr>
                            ) : (
                                filteredPatients.map((patient) => (
                                    <tr key={patient._id} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                                        <td className="p-3">
                                            <div className="font-medium text-slate-900">{patient.firstName} {patient.lastName}</div>
                                            <div className="text-xs text-slate-500">{patient.email}</div>
                                        </td>
                                        <td className="p-3 text-slate-600">#{patient._id.slice(-6)}</td>
                                        <td className="p-3 text-slate-600">
                                            {new Date().getFullYear() - new Date(patient.dateOfBirth).getFullYear()} / {patient.gender.charAt(0)}
                                        </td>
                                        <td className="p-3 text-slate-600">{patient.contactNumber}</td>
                                        <td className="p-3 text-slate-600">-</td>
                                        <td className="p-3 flex gap-2">
                                            <button
                                                onClick={() => handleViewVitals(patient)}
                                                className="p-1 hover:bg-slate-100 rounded text-primary hover:text-primary/80"
                                                title="View Vitals"
                                            >
                                                <Activity className="w-4 h-4" />
                                            </button>
                                            <button className="p-1 hover:bg-slate-100 rounded text-slate-400 hover:text-slate-600">
                                                <MoreVertical className="w-4 h-4" />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {showForm && (
                <PatientForm
                    onClose={() => setShowForm(false)}
                    onSubmit={handleCreatePatient}
                />
            )}

            {/* Vitals Modal */}
            {showVitalsModal && selectedPatient && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-40">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl h-[80vh] flex flex-col">
                        <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50 rounded-t-xl">
                            <div>
                                <h3 className="font-semibold text-slate-900">Patient Vitals</h3>
                                <p className="text-sm text-slate-500">{selectedPatient.firstName} {selectedPatient.lastName}</p>
                            </div>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => setShowVitalForm(true)}
                                    className="btn-primary text-sm py-1.5 px-3 flex items-center gap-1"
                                >
                                    <Plus className="w-3 h-3" />
                                    Add Record
                                </button>
                                <button onClick={() => setShowVitalsModal(false)} className="text-slate-400 hover:text-slate-600 ml-2">
                                    <span className="text-2xl">&times;</span>
                                </button>
                            </div>
                        </div>

                        <div className="p-4 overflow-y-auto flex-1 bg-slate-50/50">
                            <VitalList vitals={vitals} onDelete={handleDeleteVital} />
                        </div>
                    </div>
                </div>
            )}

            {showVitalForm && selectedPatient && (
                <VitalForm
                    patientId={selectedPatient._id}
                    onClose={() => setShowVitalForm(false)}
                    onSubmit={handleAddVital}
                />
            )}
        </div>
    );
};

export default Patients;
