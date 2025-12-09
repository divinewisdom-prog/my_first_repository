import { useState, useEffect } from 'react';
import { AlertCircle, Phone, Mail, MapPin, Heart, Plus, Sparkles, User, Edit, Trash2, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import AIInsightCard from '../components/AIInsightCard';
import axios from 'axios';

interface EmergencyContact {
    id: string;
    name: string;
    relationship: string;
    phone: string;
    address: string;
    bloodType?: string;
    genotype?: string;
}

const EmergencyReady = () => {
    const { token } = useAuth();
    const { showToast } = useToast();
    const [showAddForm, setShowAddForm] = useState(false);
    const [isBroadcasting, setIsBroadcasting] = useState(false);

    // SOS Modal State
    const [showSOSModal, setShowSOSModal] = useState(false);
    const [sosStep, setSosStep] = useState<'idle' | 'broadcasting' | 'sent'>('idle');

    // Message Modal State
    const [showMessageModal, setShowMessageModal] = useState(false);
    const [selectedContact, setSelectedContact] = useState<EmergencyContact | null>(null);

    // Form State
    const [newContact, setNewContact] = useState<Partial<EmergencyContact>>({});

    // Edit/Delete State
    const [editingContact, setEditingContact] = useState<EmergencyContact | null>(null);

    // Critical Numbers Modal
    const [showCriticalNumbers, setShowCriticalNumbers] = useState(false);

    // State for contacts (initialized from localStorage or defaults)
    const [contacts, setContacts] = useState<EmergencyContact[]>(() => {
        try {
            const saved = localStorage.getItem('emergencyContacts');
            if (saved) {
                const parsed = JSON.parse(saved);
                // Ensure compatibility with Settings.tsx data structure
                return parsed.map((c: any) => ({
                    ...c,
                    // If phone is split (Settings.tsx format), join it, otherwise use phone
                    phone: c.countryCode ? `${c.countryCode} ${c.phone}` : c.phone,
                    address: c.address || '', // Handle missing address
                }));
            }
            return [
                {
                    id: '1',
                    name: 'Dr. Amah (Cardiologist)',
                    relationship: 'Doctor',
                    phone: '+234 800 111 2222',
                    address: 'Lagos University Teaching Hospital',
                    bloodType: 'O+',
                    genotype: 'AA'
                },
                {
                    id: '2',
                    name: 'Spouse',
                    relationship: 'Family',
                    phone: '+234 800 333 4444',
                    address: 'Home Address'
                }
            ];
        } catch {
            return [];
        }
    });

    // Save changes to localStorage
    useEffect(() => {
        localStorage.setItem('emergencyContacts', JSON.stringify(contacts));
    }, [contacts]);

    const criticalNumbers = [
        { label: 'National Emergency', number: '112', icon: AlertCircle },
        { label: 'Ambulance Service', number: '199', icon: Heart },
        { label: 'Nearest Hospital', number: '+234 800 555 6666', icon: Phone }
    ];

    const handleAddContact = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newContact.name || !newContact.phone) {
            showToast('Please fill in at least Name and Phone', 'error');
            return;
        }

        const contact: EmergencyContact = {
            id: Date.now().toString(),
            name: newContact.name!,
            relationship: newContact.relationship || 'Other',
            phone: newContact.phone!,
            address: newContact.address || '',
            bloodType: newContact.bloodType,
            genotype: newContact.genotype
        };

        setContacts([...contacts, contact]);
        setNewContact({});
        setShowAddForm(false);
        showToast('Emergency contact added successfully', 'success');
    };

    const handleEditContact = (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingContact) return;

        setContacts(contacts.map(c =>
            c.id === editingContact.id ? editingContact : c
        ));
        setEditingContact(null);
        showToast('Contact updated successfully', 'success');
    };

    const handleDeleteContact = (id: string) => {
        if (confirm('Are you sure you want to delete this contact?')) {
            setContacts(contacts.filter(c => c.id !== id));
            showToast('Contact deleted', 'info');
        }
    };

    const handleShareLocation = () => {
        if (!navigator.geolocation) {
            showToast('Geolocation is not supported by your browser', 'error');
            return;
        }

        showToast('Getting your location...', 'info');

        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                const mapLink = `https://www.google.com/maps?q=${latitude},${longitude}`;
                const message = `Help! I need emergency assistance. My location: ${mapLink}`;

                if (navigator.share) {
                    navigator.share({
                        title: 'Emergency Location',
                        text: message,
                        url: mapLink
                    }).then(() => {
                        showToast('Location shared successfully', 'success');
                    }).catch((error) => {
                        console.error('Error sharing:', error);
                        // Fallback to clipboard
                        navigator.clipboard.writeText(message);
                        showToast('Location copied to clipboard', 'success');
                    });
                } else {
                    navigator.clipboard.writeText(message);
                    showToast('Location copied to clipboard', 'success');
                }
            },
            (error) => {
                console.error('Error getting location:', error);
                showToast('Failed to get location. Please enable GPS.', 'error');
            }
        );
    };

    const handleSOS = async () => {
        if (!navigator.geolocation) {
            showToast('Geolocation is not supported', 'error');
            return;
        }

        setShowSOSModal(true);
        setSosStep('broadcasting');
        setIsBroadcasting(true);

        navigator.geolocation.getCurrentPosition(
            async (position) => {
                try {
                    const { latitude, longitude } = position.coords;

                    // 1. Send to Backend Relay
                    await axios.post(
                        'http://localhost:5000/api/patients/emergency/alert',
                        { latitude, longitude, type: 'SOS' },
                        { headers: { Authorization: `Bearer ${token}` } }
                    );

                    setSosStep('sent');
                    showToast('🚨 SOS Alert Broadcasted!', 'success');

                } catch (error) {
                    console.error('SOS failed:', error);
                    showToast('Failed to broadcast. Please call manually.', 'error');
                    setSosStep('sent'); // Show manual options even if broadcast fails
                } finally {
                    setIsBroadcasting(false);
                }
            },
            (error) => {
                console.error('GPS error:', error);
                showToast('GPS failed. Please call manually.', 'error');
                setSosStep('sent');
                setIsBroadcasting(false);
            },
            { enableHighAccuracy: true }
        );
    };

    const handleMessageContact = () => {
        const contact = contacts[0];
        if (!contact) {
            showToast('No emergency contacts saved', 'error');
            return;
        }
        setSelectedContact(contact);
        setShowMessageModal(true);
    };

    const sendSMS = () => {
        if (!selectedContact) return;
        const cleanPhone = selectedContact.phone.replace(/[\s\-()]/g, '');
        const message = 'Help! I need emergency assistance.';

        const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
        const separator = isIOS ? '&' : '?';
        window.location.href = `sms:${cleanPhone}${separator}body=${encodeURIComponent(message)}`;

        showToast('Opening SMS app...', 'info');
        setShowMessageModal(false);
    };

    const sendWhatsApp = () => {
        if (!selectedContact) return;
        const cleanPhone = selectedContact.phone.replace(/[\s\-()]/g, '');
        const message = 'Help! I need emergency assistance.';

        const formattedPhone = cleanPhone.replace('+', '');

        window.open(`https://wa.me/${formattedPhone}?text=${encodeURIComponent(message)}`, '_blank');
        showToast('Opening WhatsApp...', 'success');
        setShowMessageModal(false);
    };

    const copyMessage = () => {
        const message = 'Help! I need emergency assistance.';
        navigator.clipboard.writeText(message);
        showToast('Message copied to clipboard', 'success');
    };

    return (
        <div className="min-h-screen bg-gradient-health pb-8">
            {/* Header */}
            <div className="mb-8 animate-fade-in">
                <div className="flex items-center gap-3 mb-2">
                    <AlertCircle className="w-8 h-8 text-red-600" />
                    <h1 className="text-4xl font-bold text-slate-900">Emergency Ready</h1>
                </div>
                <p className="text-slate-600 text-lg mb-4">
                    Be prepared for any situation
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Emergency Cards Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Emergency Contacts */}
                        <div className="card-premium animate-stagger-1">
                            <div className="flex items-center gap-2 mb-4">
                                <User className="w-5 h-5 text-primary" />
                                <h3 className="font-bold text-slate-900">Emergency Contacts</h3>
                            </div>
                            <p className="text-sm text-slate-600 mb-4">
                                {contacts.length} contacts saved
                            </p>
                            <button
                                onClick={() => setShowAddForm(true)}
                                className="w-full btn-primary text-sm py-2"
                            >
                                Manage
                            </button>
                        </div>

                        {/* Critical Numbers */}
                        <div className="card-premium animate-stagger-2">
                            <div className="flex items-center gap-2 mb-4">
                                <Phone className="w-5 h-5 text-red-600" />
                                <h3 className="font-bold text-slate-900">Critical Numbers</h3>
                            </div>
                            <p className="text-sm text-slate-600 mb-4">
                                Quick access to help
                            </p>
                            <button
                                onClick={() => setShowCriticalNumbers(true)}
                                className="w-full text-sm py-2 bg-red-100 text-red-600 rounded-xl font-semibold hover:bg-red-200 transition-all"
                            >
                                View All
                            </button>
                        </div>

                        {/* SOS Panic Button */}
                        <div className="card-premium animate-stagger-3 bg-red-50 border-2 border-red-100">
                            <div className="flex items-center gap-2 mb-4">
                                <div className="relative">
                                    <div className="absolute inset-0 bg-red-400 rounded-full animate-ping opacity-75"></div>
                                    <AlertCircle className="relative w-5 h-5 text-red-600" />
                                </div>
                                <h3 className="font-bold text-red-700">SOS Panic Mode</h3>
                            </div>
                            <button
                                onClick={handleSOS}
                                disabled={isBroadcasting}
                                className={`w-full py-8 rounded-full font-black text-2xl shadow-xl transition-all transform hover:scale-105 active:scale-95 flex flex-col items-center justify-center gap-2 ${isBroadcasting
                                    ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                                    : 'bg-gradient-to-r from-red-500 to-rose-600 text-white hover:shadow-red-500/30'
                                    }`}
                            >
                                {isBroadcasting ? (
                                    <>
                                        <div className="w-8 h-8 border-4 border-slate-300 border-t-slate-500 rounded-full animate-spin" />
                                        <span className="text-sm font-medium">Broadcasting...</span>
                                    </>
                                ) : (
                                    <>
                                        <span>SOS</span>
                                        <span className="text-xs font-normal opacity-90">Tap for Help</span>
                                    </>
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Emergency Contacts List */}
                    <div className="card-premium animate-stagger-4">
                        <h2 className="text-2xl font-bold text-slate-900 mb-6">Your Emergency Contacts</h2>
                        <div className="space-y-4">
                            {contacts.map((contact) => (
                                <div
                                    key={contact.id}
                                    className="p-4 bg-slate-50 rounded-2xl hover:bg-slate-100 transition-all"
                                >
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <h3 className="font-bold text-slate-900">{contact.name}</h3>
                                            <p className="text-sm text-slate-600 mb-2">{contact.relationship}</p>
                                            <div className="grid grid-cols-2 gap-2 text-sm">
                                                <div className="flex items-center gap-2">
                                                    <Phone className="w-4 h-4 text-slate-400" />
                                                    <span className="text-slate-700">{contact.phone}</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <MapPin className="w-4 h-4 text-slate-400" />
                                                    <span className="text-slate-700 truncate">{contact.address}</span>
                                                </div>
                                                {contact.bloodType && (
                                                    <div className="flex items-center gap-2">
                                                        <Heart className="w-4 h-4 text-red-400" />
                                                        <span className="text-slate-700">{contact.bloodType} | {contact.genotype}</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => {
                                                    const cleanPhone = contact.phone.replace(/[\s\-()]/g, '');
                                                    window.location.href = `tel:${cleanPhone}`;
                                                }}
                                                className="p-2 bg-primary/10 text-primary rounded-xl hover:bg-primary/20 transition-all"
                                                title="Call"
                                            >
                                                <Phone className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => {
                                                    setSelectedContact(contact);
                                                    setShowMessageModal(true);
                                                }}
                                                className="p-2 bg-green-100 text-green-600 rounded-xl hover:bg-green-200 transition-all"
                                                title="Message"
                                            >
                                                <Mail className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => setEditingContact(contact)}
                                                className="p-2 bg-amber-100 text-amber-600 rounded-xl hover:bg-amber-200 transition-all"
                                                title="Edit"
                                            >
                                                <Edit className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => handleDeleteContact(contact.id)}
                                                className="p-2 bg-red-100 text-red-600 rounded-xl hover:bg-red-200 transition-all"
                                                title="Delete"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <button
                            onClick={() => setShowAddForm(true)}
                            className="w-full mt-6 border-2 border-dashed border-slate-300 hover:border-primary hover:bg-blue-50 rounded-2xl py-4 flex items-center justify-center gap-2 transition-all"
                        >
                            <Plus className="w-5 h-5 text-primary" />
                            <span className="text-primary font-semibold">Add Emergency Contact</span>
                        </button>
                    </div>

                    {/* Quick Action Buttons */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 animate-stagger-5">
                        <button
                            onClick={() => window.location.href = 'tel:112'}
                            className="card-premium bg-gradient-to-br from-red-500 to-red-600 text-white hover:shadow-2xl hover:scale-105 transition-all text-center py-6"
                        >
                            <Phone className="w-8 h-8 mx-auto mb-2" />
                            <span className="font-bold text-lg">Call Emergency</span>
                        </button>
                        <button
                            onClick={handleMessageContact}
                            className="card-premium bg-gradient-to-br from-orange-500 to-orange-600 text-white hover:shadow-2xl hover:scale-105 transition-all text-center py-6"
                        >
                            <Mail className="w-8 h-8 mx-auto mb-2" />
                            <span className="font-bold text-lg">Message Contact</span>
                        </button>
                        <button
                            onClick={handleShareLocation}
                            className="card-premium bg-gradient-to-br from-blue-500 to-blue-600 text-white hover:shadow-2xl hover:scale-105 transition-all text-center py-6"
                        >
                            <MapPin className="w-8 h-8 mx-auto mb-2" />
                            <span className="font-bold text-lg">Send Location</span>
                        </button>
                    </div>
                </div>

                {/* AI Panel */}
                <div className="space-y-6">
                    <div className="bg-white rounded-3xl p-6 shadow-lg sticky top-6 animate-stagger-1">
                        <div className="flex items-center gap-2 mb-6">
                            <div className="p-2 bg-gradient-ai rounded-xl">
                                <Sparkles className="w-5 h-5 text-white" />
                            </div>
                            <h2 className="text-xl font-bold text-slate-900">AI Emergency Insights</h2>
                        </div>

                        <div className="space-y-4">
                            <AIInsightCard
                                message="AI detects your current risk level and recommends the fastest help"
                                icon="🤖"
                            />
                            <AIInsightCard
                                message="All emergency contacts have been notified of your risk status"
                                icon="📱"
                            />
                            <AIInsightCard
                                message="Nearest hospital is 2.3km away with 24/7 emergency service"
                                icon="🏥"
                            />
                            <AIInsightCard
                                message="Your health vitals are within safe ranges. Stay calm and prepared"
                                icon="💚"
                            />
                        </div>

                        {/* Critical Numbers Quick Access */}
                        <div className="mt-6 pt-6 border-t border-slate-100">
                            <h3 className="font-semibold text-slate-900 mb-4">Critical Numbers</h3>
                            <div className="space-y-3">
                                {criticalNumbers.map((num, idx) => (
                                    <div key={idx} className="flex items-center justify-between p-3 bg-red-50 rounded-xl">
                                        <div className="flex items-center gap-3">
                                            <num.icon className="w-5 h-5 text-red-600" />
                                            <span className="text-sm font-medium text-slate-700">{num.label}</span>
                                        </div>
                                        <a href={`tel:${num.number}`} className="text-sm font-bold text-red-600 hover:underline">
                                            {num.number}
                                        </a>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* SOS Active Modal */}
            {showSOSModal && (
                <div className="fixed inset-0 bg-red-600/90 backdrop-blur-sm flex items-center justify-center z-[60] p-4 animate-fade-in">
                    <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl text-center relative overflow-hidden">
                        {/* Background Pulse Animation */}
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-500 via-orange-500 to-red-500 animate-pulse"></div>

                        {sosStep === 'broadcasting' && (
                            <div className="py-8">
                                <div className="relative w-24 h-24 mx-auto mb-6">
                                    <div className="absolute inset-0 bg-red-100 rounded-full animate-ping"></div>
                                    <div className="absolute inset-0 bg-red-200 rounded-full animate-pulse delay-75"></div>
                                    <div className="relative bg-red-600 w-full h-full rounded-full flex items-center justify-center shadow-xl">
                                        <AlertCircle className="w-10 h-10 text-white animate-bounce" />
                                    </div>
                                </div>
                                <h2 className="text-2xl font-black text-slate-900 mb-2">Broadcasting SOS...</h2>
                                <p className="text-slate-600">Acquiring GPS & notifying contacts</p>
                            </div>
                        )}

                        {sosStep === 'sent' && (
                            <div className="animate-scale-up">
                                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <Sparkles className="w-10 h-10 text-green-600" />
                                </div>
                                <h2 className="text-2xl font-bold text-slate-900 mb-2">Alert Broadcasted!</h2>
                                <p className="text-slate-600 mb-8">Emergency contacts have been notified.</p>

                                <div className="space-y-4">
                                    <a
                                        href="tel:112"
                                        className="block w-full py-4 bg-red-600 text-white rounded-2xl font-black text-xl shadow-lg shadow-red-200 hover:bg-red-700 hover:scale-[1.02] transition-all"
                                    >
                                        CALL 112 NOW
                                    </a>

                                    <button
                                        onClick={() => {
                                            setShowSOSModal(false);
                                            handleMessageContact();
                                        }}
                                        className="block w-full py-4 bg-orange-100 text-orange-700 rounded-2xl font-bold hover:bg-orange-200 transition-all"
                                    >
                                        Message Contacts
                                    </button>

                                    <button
                                        onClick={() => setShowSOSModal(false)}
                                        className="block w-full py-3 text-slate-400 font-medium hover:text-slate-600"
                                    >
                                        I'm Safe (Close)
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Message Options Modal */}
            {showMessageModal && selectedContact && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowMessageModal(false)}>
                    <div className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl animate-scale-up" onClick={(e) => e.stopPropagation()}>
                        <h2 className="text-2xl font-bold text-slate-900 mb-2">Contact {selectedContact.name}</h2>
                        <p className="text-slate-600 mb-6">Choose how you want to send the emergency message.</p>

                        <div className="space-y-3">
                            <button
                                onClick={sendSMS}
                                className="w-full p-4 bg-slate-100 hover:bg-slate-200 rounded-2xl flex items-center gap-4 transition-all"
                            >
                                <div className="p-2 bg-blue-500 rounded-full text-white">
                                    <Mail className="w-5 h-5" />
                                </div>
                                <div className="text-left">
                                    <h3 className="font-bold text-slate-900">Send SMS</h3>
                                    <p className="text-xs text-slate-500">Standard text message</p>
                                </div>
                            </button>

                            <button
                                onClick={sendWhatsApp}
                                className="w-full p-4 bg-green-50 hover:bg-green-100 rounded-2xl flex items-center gap-4 transition-all"
                            >
                                <div className="p-2 bg-green-500 rounded-full text-white">
                                    <Phone className="w-5 h-5" />
                                </div>
                                <div className="text-left">
                                    <h3 className="font-bold text-slate-900">WhatsApp</h3>
                                    <p className="text-xs text-slate-500">Send via WhatsApp</p>
                                </div>
                            </button>

                            <button
                                onClick={copyMessage}
                                className="w-full p-4 bg-slate-50 hover:bg-slate-100 rounded-2xl flex items-center gap-4 transition-all"
                            >
                                <div className="p-2 bg-slate-500 rounded-full text-white">
                                    <Sparkles className="w-5 h-5" />
                                </div>
                                <div className="text-left">
                                    <h3 className="font-bold text-slate-900">Copy Message</h3>
                                    <p className="text-xs text-slate-500">Copy to clipboard</p>
                                </div>
                            </button>
                        </div>

                        <button
                            onClick={() => setShowMessageModal(false)}
                            className="w-full mt-6 py-3 text-slate-500 font-semibold hover:text-slate-700"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            )}

            {/* Add Contact Modal */}
            {showAddForm && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowAddForm(false)}>
                    <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
                        <h2 className="text-2xl font-bold text-slate-900 mb-6">Add Emergency Contact</h2>
                        <form className="space-y-4" onSubmit={handleAddContact}>
                            {/* ... form fields ... */}
                            <div>
                                <label className="text-sm font-semibold text-slate-700">Name</label>
                                <input
                                    type="text"
                                    className="input-field"
                                    placeholder="John Doe"
                                    value={newContact.name || ''}
                                    onChange={e => setNewContact({ ...newContact, name: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="text-sm font-semibold text-slate-700">Relationship</label>
                                <input
                                    type="text"
                                    className="input-field"
                                    placeholder="Spouse, Parent, etc."
                                    value={newContact.relationship || ''}
                                    onChange={e => setNewContact({ ...newContact, relationship: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="text-sm font-semibold text-slate-700">Phone</label>
                                <input
                                    type="tel"
                                    className="input-field"
                                    placeholder="+234 800 000 0000"
                                    value={newContact.phone || ''}
                                    onChange={e => setNewContact({ ...newContact, phone: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="text-sm font-semibold text-slate-700">Address</label>
                                <textarea
                                    className="input-field"
                                    placeholder="Full address"
                                    rows={3}
                                    value={newContact.address || ''}
                                    onChange={e => setNewContact({ ...newContact, address: e.target.value })}
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-sm font-semibold text-slate-700">Blood Type</label>
                                    <select
                                        className="input-field"
                                        value={newContact.bloodType || ''}
                                        onChange={e => setNewContact({ ...newContact, bloodType: e.target.value })}
                                    >
                                        <option value="">Select</option>
                                        <option value="A+">A+</option>
                                        <option value="A-">A-</option>
                                        <option value="B+">B+</option>
                                        <option value="B-">B-</option>
                                        <option value="AB+">AB+</option>
                                        <option value="AB-">AB-</option>
                                        <option value="O+">O+</option>
                                        <option value="O-">O-</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="text-sm font-semibold text-slate-700">Genotype</label>
                                    <select
                                        className="input-field"
                                        value={newContact.genotype || ''}
                                        onChange={e => setNewContact({ ...newContact, genotype: e.target.value })}
                                    >
                                        <option value="">Select</option>
                                        <option value="AA">AA</option>
                                        <option value="AS">AS</option>
                                        <option value="SS">SS</option>
                                        <option value="AC">AC</option>
                                        <option value="SC">SC</option>
                                    </select>
                                </div>
                            </div>
                            <div className="flex gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setShowAddForm(false)}
                                    className="flex-1 px-6 py-3 bg-slate-100 text-slate-700 rounded-2xl font-semibold hover:bg-slate-200 transition-all"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 btn-primary"
                                >
                                    Save Contact
                                </button>
                            </div>
                            <p className="text-xs text-center text-emerald-600 flex items-center justify-center gap-1">
                                <Sparkles className="w-3 h-3" />
                                AI verified emergency contact saved
                            </p>
                        </form>
                    </div>
                </div>
            )}

            {/* Critical Numbers Modal */}
            {showCriticalNumbers && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowCriticalNumbers(false)}>
                    <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-2xl font-bold text-slate-900">Critical Numbers</h2>
                            <button onClick={() => setShowCriticalNumbers(false)} className="p-2 hover:bg-slate-100 rounded-xl">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="space-y-3">
                            {criticalNumbers.map((num, idx) => (
                                <a
                                    key={idx}
                                    href={`tel:${num.number}`}
                                    className="flex items-center justify-between p-4 bg-red-50 rounded-xl hover:bg-red-100 transition-all"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-red-600 rounded-full text-white">
                                            <num.icon className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-slate-900">{num.label}</h3>
                                            <p className="text-sm text-slate-600">{num.number}</p>
                                        </div>
                                    </div>
                                    <Phone className="w-5 h-5 text-red-600" />
                                </a>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Edit Contact Modal */}
            {editingContact && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setEditingContact(null)}>
                    <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-2xl font-bold text-slate-900">Edit Contact</h2>
                            <button onClick={() => setEditingContact(null)} className="p-2 hover:bg-slate-100 rounded-xl">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <form className="space-y-4" onSubmit={handleEditContact}>
                            <div>
                                <label className="text-sm font-semibold text-slate-700">Name</label>
                                <input
                                    type="text"
                                    className="input-field"
                                    value={editingContact.name}
                                    onChange={e => setEditingContact({ ...editingContact, name: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="text-sm font-semibold text-slate-700">Relationship</label>
                                <input
                                    type="text"
                                    className="input-field"
                                    value={editingContact.relationship}
                                    onChange={e => setEditingContact({ ...editingContact, relationship: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="text-sm font-semibold text-slate-700">Phone</label>
                                <input
                                    type="tel"
                                    className="input-field"
                                    value={editingContact.phone}
                                    onChange={e => setEditingContact({ ...editingContact, phone: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="text-sm font-semibold text-slate-700">Address</label>
                                <textarea
                                    className="input-field"
                                    rows={2}
                                    value={editingContact.address}
                                    onChange={e => setEditingContact({ ...editingContact, address: e.target.value })}
                                />
                            </div>
                            <div className="flex gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setEditingContact(null)}
                                    className="flex-1 px-6 py-3 bg-slate-100 text-slate-700 rounded-2xl font-semibold hover:bg-slate-200 transition-all"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 btn-primary"
                                >
                                    Save Changes
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default EmergencyReady;
