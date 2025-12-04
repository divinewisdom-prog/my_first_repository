import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Patients from './pages/Patients';
import Appointments from './pages/Appointments';
import MedicalRecords from './pages/MedicalRecords';
import DailyWellness from './pages/DailyWellness';
import CareFinder from './pages/CareFinder';
import EmergencyReady from './pages/EmergencyReady';
import HealthInsights from './pages/HealthInsights';
import SettingsPage from './pages/Settings';

import { ToastProvider } from './context/ToastContext';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';

const Layout = () => {
    const [sidebarOpen, setSidebarOpen] = React.useState(false);

    return (
        <div className="min-h-screen bg-background dark:bg-slate-900">
            <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
            <Navbar onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
            <main className="pl-0 md:pl-64 pt-16 p-6 dark:bg-slate-900">
                <Outlet />
            </main>
        </div>
    );
};

const PrivateRoute = () => {
    const { token, loading } = useAuth();

    if (loading) return <div>Loading...</div>;

    return token ? <Layout /> : <Navigate to="/login" />;
};

function App() {
    return (
        <ToastProvider>
            <Router>
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />

                    <Route element={<PrivateRoute />}>
                        <Route path="/settings" element={<SettingsPage />} />
                        <Route path="/" element={<Dashboard />} />
                        <Route path="/patients" element={<Patients />} />
                        <Route path="/wellness" element={<DailyWellness />} />
                        <Route path="/care-finder" element={<CareFinder />} />
                        <Route path="/emergency" element={<EmergencyReady />} />
                        <Route path="/insights" element={<HealthInsights />} />
                        <Route path="/appointments" element={<Appointments />} />
                        <Route path="/records" element={<MedicalRecords />} />

                    </Route>

                    <Route path="*" element={<Navigate to="/" />} />
                </Routes>
            </Router>
        </ToastProvider>
    );
}

export default App;
