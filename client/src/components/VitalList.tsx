import { Activity, Trash2 } from 'lucide-react';

interface VitalListProps {
    vitals: any[];
    onDelete: (id: string) => void;
}

const VitalList = ({ vitals, onDelete }: VitalListProps) => {
    if (vitals.length === 0) {
        return (
            <div className="text-center py-8 text-slate-500 bg-slate-50 rounded-lg border border-dashed border-slate-300">
                <Activity className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p>No vital records found.</p>
            </div>
        );
    }

    return (
        <div className="space-y-3">
            {vitals.map((vital) => (
                <div key={vital._id} className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start mb-2">
                        <div className="text-sm text-slate-500">
                            {new Date(vital.date).toLocaleDateString()} at {new Date(vital.date).toLocaleTimeString()}
                        </div>
                        <button
                            onClick={() => onDelete(vital._id)}
                            className="text-red-400 hover:text-red-600 p-1"
                        >
                            <Trash2 className="w-4 h-4" />
                        </button>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm">
                        {vital.bloodPressure && (
                            <div>
                                <span className="text-slate-500 block text-xs">BP</span>
                                <span className="font-medium text-slate-900">{vital.bloodPressure}</span>
                            </div>
                        )}
                        {vital.heartRate && (
                            <div>
                                <span className="text-slate-500 block text-xs">Heart Rate</span>
                                <span className="font-medium text-slate-900">{vital.heartRate} bpm</span>
                            </div>
                        )}
                        {vital.temperature && (
                            <div>
                                <span className="text-slate-500 block text-xs">Temp</span>
                                <span className="font-medium text-slate-900">{vital.temperature}°C</span>
                            </div>
                        )}
                        {vital.oxygenSaturation && (
                            <div>
                                <span className="text-slate-500 block text-xs">SpO2</span>
                                <span className="font-medium text-slate-900">{vital.oxygenSaturation}%</span>
                            </div>
                        )}
                        {vital.weight && (
                            <div>
                                <span className="text-slate-500 block text-xs">Weight</span>
                                <span className="font-medium text-slate-900">{vital.weight} kg</span>
                            </div>
                        )}
                    </div>

                    {vital.notes && (
                        <div className="mt-3 pt-3 border-t border-slate-100 text-sm text-slate-600">
                            {vital.notes}
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
};

export default VitalList;
