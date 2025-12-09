import { useState, useEffect } from 'react';
import { Phone, X, MapPin, AlertCircle, Check } from 'lucide-react';
import { useToast } from '../context/ToastContext';

interface EmergencyContact {
    id: string;
    name: string;
    countryCode?: string;
    phone: string;
    relationship: string;
}

interface EmergencySOSButtonProps {
    emergencyContacts: EmergencyContact[];
}

const EmergencySOSButton: React.FC<EmergencySOSButtonProps> = ({ emergencyContacts }) => {
    const [showModal, setShowModal] = useState(false);
    const [countdown, setCountdown] = useState(3);
    const [isActivated, setIsActivated] = useState(false);
    const [currentLocation, setCurrentLocation] = useState<{ lat: number; lng: number } | null>(null);
    const [calledContacts, setCalledContacts] = useState<Set<string>>(new Set());
    const { showToast } = useToast();

    useEffect(() => {
        let timer: ReturnType<typeof setTimeout>;
        if (showModal && countdown > 0 && !isActivated) {
            timer = setTimeout(() => setCountdown(countdown - 1), 1000);
        } else if (showModal && countdown === 0 && !isActivated) {
            activateEmergency();
        }
        return () => clearTimeout(timer);
    }, [showModal, countdown, isActivated]);

    const handleSOSClick = () => {
        if (emergencyContacts.length === 0) {
            showToast('Please add emergency contacts in Settings first', 'error');
            return;
        }
        setShowModal(true);
        setCountdown(3);
        setIsActivated(false);
        setCalledContacts(new Set());
        setCurrentLocation(null);
    };

    const cancelSOS = () => {
        setShowModal(false);
        setCountdown(3);
        setIsActivated(false);
    };

    const getLocation = (): Promise<{ lat: number; lng: number }> => {
        return new Promise((resolve, reject) => {
            if (!navigator.geolocation) {
                reject(new Error('Geolocation not supported'));
                return;
            }

            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const location = {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
                    };
                    setCurrentLocation(location);
                    resolve(location);
                },
                (error) => {
                    console.error('Location error:', error);
                    reject(error);
                },
                { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
            );
        });
    };

    const activateEmergency = async () => {
        setIsActivated(true);
        showToast('🚨 Emergency SOS Activated', 'error');

        // Start fetching location immediately but don't block
        getLocation()
            .then(() => showToast('📍 Location secured', 'success'))
            .catch(() => showToast('⚠️ Could not get accurate location', 'warning'));

        // Proceed to alert contacts after a short delay to allow location fetch
        setTimeout(() => {
            performEmergencyActions();
        }, 1000);
    };

    const performEmergencyActions = () => {
        if (emergencyContacts.length > 0) {
            const contact = emergencyContacts[0];
            const emergencyMessage = "🚨 EMERGENCY ALERT! I need help!";
            const fullPhone = contact.countryCode ? `${contact.countryCode}${contact.phone}` : contact.phone;

            // Construct link (note: location might still be null if fetch is slow, user can click MSG button later)
            // We use window.open for WhatsApp as it's more reliable than href for "app intents" on some platforms
            const whatsappLink = `https://wa.me/${fullPhone.replace(/[^0-9+]/g, '')}?text=${encodeURIComponent(emergencyMessage)}`;

            try {
                window.open(whatsappLink, '_blank');
            } catch (e) {
                console.error("Popup blocked", e);
            }

            // Auto-call
            setTimeout(() => {
                callContact(contact);
            }, 500);
        }
    };

    const callContact = (contact: EmergencyContact) => {
        const fullPhone = contact.countryCode ? `${contact.countryCode}${contact.phone}` : contact.phone;
        const telLink = `tel:${fullPhone}`;
        window.location.href = telLink;
        setCalledContacts(prev => new Set(prev).add(contact.id));
        showToast(`Calling ${contact.name}...`, 'info');
    };

    if (!showModal) {
        return (
            <button
                onClick={handleSOSClick}
                className="fixed bottom-6 right-6 z-50 w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-full shadow-2xl flex items-center justify-center transition-all duration-300 hover:scale-110 animate-pulse group"
                aria-label="Emergency SOS"
            >
                <div className="absolute inset-0 bg-red-400 rounded-full animate-ping opacity-75"></div>
                <Phone className="w-8 h-8 md:w-10 md:h-10 relative z-10 transform group-hover:rotate-12 transition-transform" />
            </button>
        );
    }

    return (
        <>
            <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4" onClick={!isActivated ? cancelSOS : undefined}>
                <div className="bg-white dark:bg-slate-800 rounded-3xl p-8 max-w-md w-full shadow-2xl" onClick={(e) => e.stopPropagation()}>
                    {!isActivated ? (
                        <div className="text-center">
                            <div className="w-24 h-24 mx-auto mb-6 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center relative">
                                <div className="absolute inset-0 bg-red-400 rounded-full animate-ping opacity-75"></div>
                                <AlertCircle className="w-12 h-12 text-red-600 dark:text-red-400 relative z-10" />
                            </div>

                            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-3">Emergency SOS</h2>
                            <p className="text-slate-600 dark:text-slate-300 mb-6">
                                Activating in <span className="text-4xl font-bold text-red-600">{countdown}</span> seconds
                            </p>

                            <div className="space-y-3 mb-6 text-left bg-slate-50 dark:bg-slate-700/50 p-4 rounded-xl">
                                <p className="text-sm text-slate-700 dark:text-slate-300 flex items-start gap-2">
                                    <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                                    <span>Location will be shared with emergency contacts</span>
                                </p>
                                <p className="text-sm text-slate-700 dark:text-slate-300 flex items-start gap-2">
                                    <Phone className="w-4 h-4 mt-0.5 flex-shrink-0" />
                                    <span>First contact will be called automatically</span>
                                </p>
                            </div>

                            <button
                                onClick={cancelSOS}
                                className="w-full py-4 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-900 dark:text-white rounded-xl font-semibold transition-colors"
                            >
                                <X className="w-5 h-5 inline mr-2" />
                                Cancel
                            </button>
                        </div>
                    ) : (
                        <div>
                            <div className="text-center mb-6">
                                <div className="w-20 h-20 mx-auto mb-4 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                                    <Check className="w-10 h-10 text-green-600 dark:text-green-400" />
                                </div>
                                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">SOS Activated</h2>
                                {currentLocation ? (
                                    <div className="text-sm text-green-600 dark:text-green-400 font-medium">
                                        <p>📍 Location Found</p>
                                        <p className="text-xs opacity-75">{currentLocation.lat.toFixed(4)}, {currentLocation.lng.toFixed(4)}</p>
                                    </div>
                                ) : (
                                    <p className="text-sm text-amber-600 dark:text-amber-400 font-medium animate-pulse">
                                        📡 Fetching Location...
                                    </p>
                                )}
                            </div>

                            <div className="space-y-3 mb-6">
                                <h3 className="font-semibold text-slate-900 dark:text-white mb-3">Emergency Contacts:</h3>
                                {emergencyContacts.map((contact, index) => (
                                    <div key={contact.id} className="space-y-2">
                                        <div className={`w-full p-4 rounded-xl border-2 transition-all flex items-center justify-between ${calledContacts.has(contact.id)
                                            ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                                            : index === 0
                                                ? 'border-red-500 bg-red-50 dark:bg-red-900/20'
                                                : 'border-slate-200 dark:border-slate-700'
                                            }`}>
                                            <div className="text-left">
                                                <p className="font-semibold text-slate-900 dark:text-white">{contact.name}</p>
                                                <p className="text-sm text-slate-600 dark:text-slate-400">
                                                    {contact.relationship}
                                                </p>
                                            </div>

                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => {
                                                        const fullPhone = contact.countryCode ? `${contact.countryCode}${contact.phone}` : contact.phone;
                                                        const googleMapsLink = currentLocation
                                                            ? `https://www.google.com/maps?q=${currentLocation.lat},${currentLocation.lng}`
                                                            : 'Location unavailable';
                                                        const emergencyMessage = `🚨 EMERGENCY ALERT! I need immediate help. My current location: ${googleMapsLink}`;
                                                        const whatsappLink = `https://wa.me/${fullPhone.replace(/[^0-9+]/g, '')}?text=${encodeURIComponent(emergencyMessage)}`;
                                                        window.open(whatsappLink, '_blank');
                                                    }}
                                                    className="p-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200"
                                                    title="WhatsApp Message with Location"
                                                >
                                                    <span className="text-xs font-bold">MSG</span>
                                                </button>
                                                <button
                                                    onClick={() => callContact(contact)}
                                                    className={`p-2 rounded-lg text-white ${calledContacts.has(contact.id) ? 'bg-slate-400' : 'bg-red-600 hover:bg-red-700'}`}
                                                    title="Call"
                                                >
                                                    <Phone className="w-5 h-5" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <button
                                onClick={() => setShowModal(false)}
                                className="w-full py-3 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-900 dark:text-white rounded-xl font-semibold transition-colors"
                            >
                                Close
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default EmergencySOSButton;
