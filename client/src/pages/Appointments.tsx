import { useState, useEffect } from 'react';
import { Plus, Search, Calendar as CalendarIcon, Clock, User, CheckCircle, XCircle } from 'lucide-react';
import { appointmentService } from '../services/api';
import AppointmentForm from '../components/AppointmentForm';

const Appointments = () => {
    const [appointments, setAppointments] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    const fetchAppointments = async () => {
        try {
            const data = await appointmentService.getAll();
            setAppointments(data);
        } catch (error) {
            console.error('Error fetching appointments:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAppointments();
    }, []);

    const handleCreateAppointment = async (data: any) => {
        await appointmentService.create(data);
        fetchAppointments();
    };

    const handleStatusUpdate = async (id: string, status: string) => {
        try {
            await appointmentService.update(id, { status });
            fetchAppointments();
        } catch (error) {
            console.error('Error updating status:', error);
        }
    };

    const filteredAppointments = appointments.filter(apt =>
        apt.patient?.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        apt.patient?.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        apt.doctor?.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Completed': return 'bg-emerald-100 text-emerald-700';
            case 'Cancelled': return 'bg-red-100 text-red-700';
            default: return 'bg-blue-100 text-blue-700';
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-slate-900">Appointments</h2>
                    <p className="text-slate-500 text-sm">Manage scheduled appointments</p>
                </div>
                <button
                    onClick={() => setShowForm(true)}
                    className="btn-primary flex items-center gap-2"
                >
                    <Plus className="w-4 h-4" />
                    New Appointment
                </button>
            </div>

            <div className="card p-4">
                <div className="flex items-center gap-4 mb-6">
                    <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search by patient or doctor..."
                            className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                <div className="space-y-4">
                    {loading ? (
                        <div className="text-center py-8 text-slate-500">Loading appointments...</div>
                    ) : filteredAppointments.length === 0 ? (
                        <div className="text-center py-8 text-slate-500">No appointments found.</div>
                    ) : (
                        filteredAppointments.map((apt) => (
                            <div key={apt._id} className="flex flex-col md:flex-row items-start md:items-center justify-between p-4 border border-slate-100 rounded-lg hover:bg-slate-50 transition-colors gap-4">
                                <div className="flex items-start gap-4">
                                    <div className="p-3 bg-blue-50 text-blue-600 rounded-lg">
                                        <CalendarIcon className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-slate-900">
                                            {apt.patient ? `${apt.patient.firstName} ${apt.patient.lastName}` : 'Unknown Patient'}
                                        </h4>
                                        <div className="flex items-center gap-4 mt-1 text-sm text-slate-500">
                                            <span className="flex items-center gap-1">
                                                <User className="w-3 h-3" />
                                                Dr. {apt.doctor?.name || 'Unknown'}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <Clock className="w-3 h-3" />
                                                {new Date(apt.date).toLocaleString()}
                                            </span>
                                        </div>
                                        <p className="text-sm text-slate-600 mt-2">{apt.reason}</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3 w-full md:w-auto justify-end">
                                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(apt.status)}`}>
                                        {apt.status}
                                    </span>
                                    {apt.status === 'Scheduled' && (
                                        <div className="flex gap-1">
                                            <button
                                                onClick={() => handleStatusUpdate(apt._id, 'Completed')}
                                                className="p-1 text-emerald-600 hover:bg-emerald-50 rounded"
                                                title="Mark Completed"
                                            >
                                                <CheckCircle className="w-5 h-5" />
                                            </button>
                                            <button
                                                onClick={() => handleStatusUpdate(apt._id, 'Cancelled')}
                                                className="p-1 text-red-600 hover:bg-red-50 rounded"
                                                title="Cancel"
                                            >
                                                <XCircle className="w-5 h-5" />
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {showForm && (
                <AppointmentForm
                    onClose={() => setShowForm(false)}
                    onSubmit={handleCreateAppointment}
                />
            )}
        </div>
    );
};

export default Appointments;
