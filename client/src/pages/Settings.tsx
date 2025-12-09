import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import {
    Moon,
    Sun,
    Bell,
    Shield,
    Key,
    Mail,

    LogOut,
    ChevronRight,
    User,
    Lock,
    Eye,
    Brain,
    Palette,
    HelpCircle,
    ArrowLeft,
    Camera,
    Phone,

    Trash2,
    FileText,


    Clock,
    Target,
    Type,

    Image,
    Upload,
    X
} from 'lucide-react';

type SettingsSection = 'menu' | 'account' | 'privacy' | 'notifications' | 'ai' | 'appearance' | 'security' | 'support';

interface UserSettings {
    // Account
    name: string;
    email: string;
    phone: string;
    dateOfBirth: string;
    emergencyContacts: Array<{
        id: string;
        name: string;
        countryCode: string;
        phone: string;
        relationship: string;
    }>;
    profileImage?: string;

    // Privacy
    allowAIAnalysis: boolean;

    // Notifications
    dailyCheckInTime: string;
    moodReminders: boolean;
    aiInsights: boolean;

    // AI Personalization
    aiTone: 'friendly' | 'professional';
    insightDepth: 'short' | 'detailed';
    wellnessGoal: 'mental' | 'fitness' | 'sleep' | 'stress';

    // Appearance
    theme: 'light' | 'dark';
    fontSize: 'small' | 'normal' | 'large';

    // Security
    pinEnabled: boolean;
    biometricEnabled: boolean;
}

const SettingsPage = () => {
    const { user, logout } = useAuth();
    const [activeSection, setActiveSection] = useState<SettingsSection>('menu');
    const [showProfileMenu, setShowProfileMenu] = useState(false);
    const [showPhotoModal, setShowPhotoModal] = useState(false);
    const [settings, setSettings] = useState<UserSettings>({
        // Account defaults
        name: user?.name || '',
        email: user?.email || '',
        phone: '',
        dateOfBirth: '',
        profileImage: localStorage.getItem('profileImage') || undefined,
        emergencyContacts: (() => {
            try {
                const saved = localStorage.getItem('emergencyContacts');
                return saved ? JSON.parse(saved) : [];
            } catch {
                return [];
            }
        })(),

        // Privacy defaults
        allowAIAnalysis: true,

        // Notifications defaults
        dailyCheckInTime: '09:00',
        moodReminders: true,
        aiInsights: true,

        // AI defaults
        aiTone: 'friendly',
        insightDepth: 'detailed',
        wellnessGoal: 'mental',

        // Appearance defaults
        theme: (localStorage.theme || 'light') as 'light' | 'dark',
        fontSize: 'normal',

        // Security defaults
        pinEnabled: false,
        biometricEnabled: false
    });

    useEffect(() => {
        // Apply theme on mount
        if (settings.theme === 'dark') {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, [settings.theme]);

    // Save emergency contacts to localStorage whenever they change
    useEffect(() => {
        localStorage.setItem('emergencyContacts', JSON.stringify(settings.emergencyContacts));
    }, [settings.emergencyContacts]);

    // Save profile image
    useEffect(() => {
        if (settings.profileImage) {
            localStorage.setItem('profileImage', settings.profileImage);
        }
    }, [settings.profileImage]);

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64String = reader.result as string;
                updateSetting('profileImage', base64String);
            };
            reader.readAsDataURL(file);
        }
        setShowProfileMenu(false);
    };

    const handleRemovePhoto = () => {
        updateSetting('profileImage', undefined);
        localStorage.removeItem('profileImage');
        setShowProfileMenu(false);
    };

    const updateSetting = <K extends keyof UserSettings>(key: K, value: UserSettings[K]) => {
        setSettings(prev => ({ ...prev, [key]: value }));

        // Handle theme change
        if (key === 'theme') {
            if (value === 'dark') {
                document.documentElement.classList.add('dark');
                localStorage.theme = 'dark';
            } else {
                document.documentElement.classList.remove('dark');
                localStorage.theme = 'light';
            }
        }
    };

    const menuItems = [
        { id: 'account', icon: User, label: 'Account & Profile', color: 'text-blue-600 dark:text-blue-400', bgColor: 'bg-blue-100 dark:bg-blue-900/30' },
        { id: 'privacy', icon: Eye, label: 'Privacy & Data', color: 'text-purple-600 dark:text-purple-400', bgColor: 'bg-purple-100 dark:bg-purple-900/30' },
        { id: 'notifications', icon: Bell, label: 'Notifications', color: 'text-orange-600 dark:text-orange-400', bgColor: 'bg-orange-100 dark:bg-orange-900/30' },
        { id: 'ai', icon: Brain, label: 'AI Personalization', color: 'text-green-600 dark:text-green-400', bgColor: 'bg-green-100 dark:bg-green-900/30' },
        { id: 'appearance', icon: Palette, label: 'Appearance', color: 'text-pink-600 dark:text-pink-400', bgColor: 'bg-pink-100 dark:bg-pink-900/30' },
        { id: 'security', icon: Shield, label: 'Security', color: 'text-red-600 dark:text-red-400', bgColor: 'bg-red-100 dark:bg-red-900/30' },
        { id: 'support', icon: HelpCircle, label: 'Support', color: 'text-teal-600 dark:text-teal-400', bgColor: 'bg-teal-100 dark:bg-teal-900/30' }
    ];

    const renderMainMenu = () => (
        <div className="space-y-6 animate-fade-in">
            {/* Profile Header */}
            <div className="card-premium text-center">
                <div className="flex flex-col items-center">
                    <div className="flex flex-col items-center gap-2">
                        <div className="relative mb-2">
                            <div className="w-24 h-24 bg-gradient-primary rounded-full flex items-center justify-center text-white text-3xl font-bold shadow-lg overflow-hidden relative group">
                                {settings.profileImage ? (
                                    <img src={settings.profileImage} alt="Profile" className="w-full h-full object-cover" />
                                ) : (
                                    user?.name?.charAt(0).toUpperCase() || 'U'
                                )}
                                {/* Overlay for quick view on hover */}
                                {settings.profileImage && (
                                    <div
                                        className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer"
                                        onClick={() => setShowPhotoModal(true)}
                                    >
                                        <Eye className="w-6 h-6 text-white" />
                                    </div>
                                )}
                            </div>

                            {/* Edit Button with Menu */}
                            <div className="absolute bottom-0 right-0 relative">
                                <button
                                    onClick={() => setShowProfileMenu(!showProfileMenu)}
                                    className="w-8 h-8 bg-white dark:bg-slate-700 rounded-full shadow-lg flex items-center justify-center hover:scale-110 transition-transform"
                                >
                                    <Camera className="w-4 h-4 text-primary" />
                                </button>

                                {/* Dropdown Menu */}
                                {showProfileMenu && (
                                    <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-48 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-100 dark:border-slate-700 z-50 overflow-hidden animate-fade-in">
                                        {settings.profileImage && (
                                            <button
                                                onClick={() => {
                                                    setShowPhotoModal(true);
                                                    setShowProfileMenu(false);
                                                }}
                                                className="w-full px-4 py-3 text-left text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 flex items-center gap-2"
                                            >
                                                <Image className="w-4 h-4" />
                                                View Photo
                                            </button>
                                        )}
                                        <button
                                            onClick={() => document.getElementById('profile-upload')?.click()}
                                            className="w-full px-4 py-3 text-left text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 flex items-center gap-2"
                                        >
                                            <Upload className="w-4 h-4" />
                                            {settings.profileImage ? 'Change Photo' : 'Upload Photo'}
                                        </button>
                                        {settings.profileImage && (
                                            <button
                                                onClick={handleRemovePhoto}
                                                className="w-full px-4 py-3 text-left text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-2"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                                Remove Photo
                                            </button>
                                        )}
                                        <button
                                            onClick={() => setShowProfileMenu(false)}
                                            className="w-full px-4 py-2 text-center text-xs text-slate-400 hover:text-slate-600 border-t border-slate-100 dark:border-slate-700"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                )}
                            </div>

                            <input
                                type="file"
                                id="profile-upload"
                                className="hidden"
                                accept="image/*"
                                onChange={handleImageUpload}
                            />
                        </div>
                        <button
                            onClick={() => document.getElementById('profile-upload')?.click()}
                            className="text-sm font-medium text-primary hover:text-primary/80 transition-colors"
                        >
                            Change Photo
                        </button>
                    </div>
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-1">{user?.name}</h2>
                    <p className="text-slate-500 dark:text-slate-400 text-sm mb-3">{user?.email}</p>
                    <div className="px-4 py-1.5 bg-primary/10 text-primary rounded-full text-xs font-semibold uppercase tracking-wider">
                        {user?.role || 'Patient'}
                    </div>
                </div>
            </div>

            {/* Settings Menu */}
            <div className="card space-y-2">
                {menuItems.map((item) => (
                    <button
                        key={item.id}
                        onClick={() => setActiveSection(item.id as SettingsSection)}
                        className="w-full flex items-center justify-between p-4 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-all group"
                    >
                        <div className="flex items-center gap-4">
                            <div className={`p-3 ${item.bgColor} rounded-xl transition-transform group-hover:scale-110`}>
                                <item.icon className={`w-5 h-5 ${item.color}`} />
                            </div>
                            <span className="font-medium text-slate-900 dark:text-white">{item.label}</span>
                        </div>
                        <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-primary transition-colors" />
                    </button>
                ))}
            </div>

            {/* Logout Button */}
            <button
                onClick={logout}
                className="w-full card flex items-center justify-center gap-3 p-4 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors group"
            >
                <LogOut className="w-5 h-5 group-hover:scale-110 transition-transform" />
                <span className="font-semibold">Sign Out</span>
            </button>
        </div>
    );

    const renderAccountSection = () => (
        <div className="space-y-6 animate-fade-in">
            <div className="card space-y-6">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <User className="w-6 h-6 text-primary" />
                    Profile Information
                </h3>

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Full Name</label>
                        <input
                            type="text"
                            value={settings.name}
                            onChange={(e) => updateSetting('name', e.target.value)}
                            className="input-field"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Email Address</label>
                        <input
                            type="email"
                            value={settings.email}
                            onChange={(e) => updateSetting('email', e.target.value)}
                            className="input-field"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Phone Number</label>
                        <input
                            type="tel"
                            value={settings.phone}
                            onChange={(e) => updateSetting('phone', e.target.value)}
                            placeholder="+1 (555) 000-0000"
                            className="input-field"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Date of Birth</label>
                        <input
                            type="date"
                            value={settings.dateOfBirth}
                            onChange={(e) => updateSetting('dateOfBirth', e.target.value)}
                            className="input-field"
                        />
                    </div>
                </div>
            </div>

            <div className="card space-y-6">
                <div className="flex items-center justify-between">
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                        <Phone className="w-6 h-6 text-primary" />
                        Emergency Contacts
                    </h3>
                    <button
                        onClick={() => {
                            const newContact = {
                                id: Date.now().toString(),
                                name: '',
                                countryCode: '+1',
                                phone: '',
                                relationship: ''
                            };
                            updateSetting('emergencyContacts', [...settings.emergencyContacts, newContact]);
                        }}
                        className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors text-sm font-medium"
                    >
                        + Add Contact
                    </button>
                </div>

                {settings.emergencyContacts.length === 0 ? (
                    <div className="text-center py-8 bg-slate-50 dark:bg-slate-700/30 rounded-xl">
                        <Phone className="w-12 h-12 text-slate-400 mx-auto mb-3" />
                        <p className="text-slate-600 dark:text-slate-400 mb-4">No emergency contacts added yet</p>
                        <p className="text-xs text-slate-500 dark:text-slate-500">Contacts will be called in order during emergencies</p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {settings.emergencyContacts.map((contact, index) => (
                            <div key={contact.id} className="p-4 bg-slate-50 dark:bg-slate-700/30 rounded-xl">
                                <div className="flex items-start gap-3">
                                    {/* Priority Badge */}
                                    <div className="flex flex-col gap-1 pt-2">
                                        <span className={`text-xs font-bold px-2 py-1 rounded ${index === 0
                                            ? 'bg-red-100 dark:bg-red-900/30 text-red-600'
                                            : 'bg-slate-200 dark:bg-slate-600 text-slate-600 dark:text-slate-300'
                                            }`}>
                                            {index === 0 ? '1st' : index === 1 ? '2nd' : index === 2 ? '3rd' : `${index + 1}th`}
                                        </span>
                                        <div className="flex flex-col gap-1">
                                            <button
                                                onClick={() => {
                                                    if (index > 0) {
                                                        const newContacts = [...settings.emergencyContacts];
                                                        [newContacts[index - 1], newContacts[index]] = [newContacts[index], newContacts[index - 1]];
                                                        updateSetting('emergencyContacts', newContacts);
                                                    }
                                                }}
                                                disabled={index === 0}
                                                className="p-1 hover:bg-slate-200 dark:hover:bg-slate-600 rounded disabled:opacity-30 disabled:cursor-not-allowed"
                                            >
                                                <ChevronRight className="w-3 h-3 transform -rotate-90" />
                                            </button>
                                            <button
                                                onClick={() => {
                                                    if (index < settings.emergencyContacts.length - 1) {
                                                        const newContacts = [...settings.emergencyContacts];
                                                        [newContacts[index], newContacts[index + 1]] = [newContacts[index + 1], newContacts[index]];
                                                        updateSetting('emergencyContacts', newContacts);
                                                    }
                                                }}
                                                disabled={index === settings.emergencyContacts.length - 1}
                                                className="p-1 hover:bg-slate-200 dark:hover:bg-slate-600 rounded disabled:opacity-30 disabled:cursor-not-allowed"
                                            >
                                                <ChevronRight className="w-3 h-3 transform rotate-90" />
                                            </button>
                                        </div>
                                    </div>

                                    {/* Contact Fields */}
                                    <div className="flex-1 space-y-3">
                                        <input
                                            type="text"
                                            value={contact.name}
                                            onChange={(e) => {
                                                const newContacts = settings.emergencyContacts.map(c =>
                                                    c.id === contact.id ? { ...c, name: e.target.value } : c
                                                );
                                                updateSetting('emergencyContacts', newContacts);
                                            }}
                                            placeholder="Contact Name"
                                            className="input-field text-sm"
                                        />
                                        <div className="flex gap-2">
                                            <select
                                                value={contact.countryCode}
                                                onChange={(e) => {
                                                    const newContacts = settings.emergencyContacts.map(c =>
                                                        c.id === contact.id ? { ...c, countryCode: e.target.value } : c
                                                    );
                                                    updateSetting('emergencyContacts', newContacts);
                                                }}
                                                className="input-field text-sm w-24"
                                            >
                                                <option value="+1">🇺🇸 +1</option>
                                                <option value="+44">🇬🇧 +44</option>
                                                <option value="+234">🇳🇬 +234</option>
                                                <option value="+254">🇰🇪 +254</option>
                                                <option value="+27">🇿🇦 +27</option>
                                                <option value="+91">🇮🇳 +91</option>
                                                <option value="+86">🇨🇳 +86</option>
                                                <option value="+81">🇯🇵 +81</option>
                                                <option value="+49">🇩🇪 +49</option>
                                                <option value="+33">🇫🇷 +33</option>
                                            </select>
                                            <input
                                                type="tel"
                                                value={contact.phone}
                                                onChange={(e) => {
                                                    const newContacts = settings.emergencyContacts.map(c =>
                                                        c.id === contact.id ? { ...c, phone: e.target.value } : c
                                                    );
                                                    updateSetting('emergencyContacts', newContacts);
                                                }}
                                                placeholder="(555) 000-0000"
                                                className="input-field text-sm flex-1"
                                            />
                                        </div>
                                        <input
                                            type="text"
                                            value={contact.relationship}
                                            onChange={(e) => {
                                                const newContacts = settings.emergencyContacts.map(c =>
                                                    c.id === contact.id ? { ...c, relationship: e.target.value } : c
                                                );
                                                updateSetting('emergencyContacts', newContacts);
                                            }}
                                            placeholder="Relationship (e.g., Mother, Friend)"
                                            className="input-field text-sm"
                                        />
                                    </div>

                                    {/* Delete Button */}
                                    <button
                                        onClick={() => {
                                            const newContacts = settings.emergencyContacts.filter(c => c.id !== contact.id);
                                            updateSetting('emergencyContacts', newContacts);
                                        }}
                                        className="p-2 hover:bg-red-100 dark:hover:bg-red-900/30 text-red-600 rounded-lg transition-colors mt-2"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        ))}
                        <p className="text-xs text-slate-500 dark:text-slate-400 text-center pt-2">
                            ⚠️ First contact will be auto-called during emergencies. Use arrows to reorder.
                        </p>
                    </div>
                )}
            </div>

            <div className="card">
                <button className="w-full flex items-center justify-between p-4 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors group">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
                            <Key className="w-5 h-5 text-orange-600" />
                        </div>
                        <span className="font-medium text-slate-900 dark:text-white">Change Password</span>
                    </div>
                    <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-primary transition-colors" />
                </button>
            </div>
        </div>
    );

    const renderPrivacySection = () => (
        <div className="space-y-6 animate-fade-in">
            <div className="card space-y-6">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <Eye className="w-6 h-6 text-primary" />
                    Data Controls
                </h3>

                <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-700/30 rounded-xl">
                        <div>
                            <p className="font-medium text-slate-900 dark:text-white">AI Analysis</p>
                            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Allow AI to analyze your wellness entries</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                className="sr-only peer"
                                checked={settings.allowAIAnalysis}
                                onChange={(e) => updateSetting('allowAIAnalysis', e.target.checked)}
                            />
                            <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 dark:peer-focus:ring-primary/40 rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary"></div>
                        </label>
                    </div>
                </div>
            </div>

            <div className="card space-y-4">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <Trash2 className="w-6 h-6 text-primary" />
                    Data Management
                </h3>

                <button className="w-full flex items-center justify-between p-4 rounded-xl bg-orange-50 dark:bg-orange-900/20 hover:bg-orange-100 dark:hover:bg-orange-900/30 transition-colors group">
                    <div className="flex items-center gap-3">
                        <Trash2 className="w-5 h-5 text-orange-600" />
                        <div className="text-left">
                            <p className="font-medium text-slate-900 dark:text-white">Clear Wellness Data</p>
                            <p className="text-sm text-slate-500 dark:text-slate-400">Remove all wellness entries</p>
                        </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-orange-600 transition-colors" />
                </button>

                <button className="w-full flex items-center justify-between p-4 rounded-xl bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors group">
                    <div className="flex items-center gap-3">
                        <Trash2 className="w-5 h-5 text-red-600" />
                        <div className="text-left">
                            <p className="font-medium text-red-600 dark:text-red-400">Delete Account</p>
                            <p className="text-sm text-slate-500 dark:text-slate-400">Permanently delete your account</p>
                        </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-red-600 transition-colors" />
                </button>
            </div>

            <div className="card space-y-3">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <FileText className="w-6 h-6 text-primary" />
                    Legal
                </h3>

                <button className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors">
                    <span className="font-medium text-slate-900 dark:text-white">Privacy Policy</span>
                    <ChevronRight className="w-5 h-5 text-slate-400" />
                </button>

                <button className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors">
                    <span className="font-medium text-slate-900 dark:text-white">Terms of Service</span>
                    <ChevronRight className="w-5 h-5 text-slate-400" />
                </button>
            </div>
        </div>
    );

    const renderNotificationsSection = () => (
        <div className="space-y-6 animate-fade-in">
            <div className="card space-y-6">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <Clock className="w-6 h-6 text-primary" />
                    Daily Check-In
                </h3>

                <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Reminder Time</label>
                    <input
                        type="time"
                        value={settings.dailyCheckInTime}
                        onChange={(e) => updateSetting('dailyCheckInTime', e.target.value)}
                        className="input-field"
                    />
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Set when you'd like to receive your daily wellness check-in reminder</p>
                </div>
            </div>

            <div className="card space-y-4">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <Bell className="w-6 h-6 text-primary" />
                    Notification Types
                </h3>

                <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-700/30 rounded-xl">
                    <div>
                        <p className="font-medium text-slate-900 dark:text-white">Mood Check Reminders</p>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Get prompted to log your mood</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                        <input
                            type="checkbox"
                            className="sr-only peer"
                            checked={settings.moodReminders}
                            onChange={(e) => updateSetting('moodReminders', e.target.checked)}
                        />
                        <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 dark:peer-focus:ring-primary/40 rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary"></div>
                    </label>
                </div>

                <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-700/30 rounded-xl">
                    <div>
                        <p className="font-medium text-slate-900 dark:text-white">AI Insights</p>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Receive personalized AI wellness insights</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                        <input
                            type="checkbox"
                            className="sr-only peer"
                            checked={settings.aiInsights}
                            onChange={(e) => updateSetting('aiInsights', e.target.checked)}
                        />
                        <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 dark:peer-focus:ring-primary/40 rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary"></div>
                    </label>
                </div>
            </div>
        </div>
    );

    const renderAISection = () => (
        <div className="space-y-6 animate-fade-in">
            <div className="card space-y-6">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <Brain className="w-6 h-6 text-primary" />
                    AI Personality
                </h3>

                <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">Communication Tone</label>
                    <div className="grid grid-cols-2 gap-3">
                        <button
                            onClick={() => updateSetting('aiTone', 'friendly')}
                            className={`p-4 rounded-xl border-2 transition-all ${settings.aiTone === 'friendly'
                                ? 'border-primary bg-primary/10 text-primary'
                                : 'border-slate-200 dark:border-slate-700 hover:border-primary/50'
                                }`}
                        >
                            <div className="font-semibold text-slate-900 dark:text-white">Friendly</div>
                            <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">Casual & warm</div>
                        </button>

                        <button
                            onClick={() => updateSetting('aiTone', 'professional')}
                            className={`p-4 rounded-xl border-2 transition-all ${settings.aiTone === 'professional'
                                ? 'border-primary bg-primary/10 text-primary'
                                : 'border-slate-200 dark:border-slate-700 hover:border-primary/50'
                                }`}
                        >
                            <div className="font-semibold text-slate-900 dark:text-white">Professional</div>
                            <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">Formal & clinical</div>
                        </button>
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">Insight Detail Level</label>
                    <div className="grid grid-cols-2 gap-3">
                        <button
                            onClick={() => updateSetting('insightDepth', 'short')}
                            className={`p-4 rounded-xl border-2 transition-all ${settings.insightDepth === 'short'
                                ? 'border-primary bg-primary/10 text-primary'
                                : 'border-slate-200 dark:border-slate-700 hover:border-primary/50'
                                }`}
                        >
                            <div className="font-semibold text-slate-900 dark:text-white">Short</div>
                            <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">Quick summaries</div>
                        </button>

                        <button
                            onClick={() => updateSetting('insightDepth', 'detailed')}
                            className={`p-4 rounded-xl border-2 transition-all ${settings.insightDepth === 'detailed'
                                ? 'border-primary bg-primary/10 text-primary'
                                : 'border-slate-200 dark:border-slate-700 hover:border-primary/50'
                                }`}
                        >
                            <div className="font-semibold text-slate-900 dark:text-white">Detailed</div>
                            <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">In-depth analysis</div>
                        </button>
                    </div>
                </div>
            </div>

            <div className="card space-y-6">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <Target className="w-6 h-6 text-primary" />
                    Wellness Focus
                </h3>

                <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">Primary Goal</label>
                    <div className="grid grid-cols-2 gap-3">
                        {[
                            { value: 'mental', label: 'Mental Wellness', icon: '🧠' },
                            { value: 'fitness', label: 'Fitness', icon: '💪' },
                            { value: 'sleep', label: 'Sleep Quality', icon: '😴' },
                            { value: 'stress', label: 'Stress Reduction', icon: '🧘' }
                        ].map((goal) => (
                            <button
                                key={goal.value}
                                onClick={() => updateSetting('wellnessGoal', goal.value as any)}
                                className={`p-4 rounded-xl border-2 transition-all ${settings.wellnessGoal === goal.value
                                    ? 'border-primary bg-primary/10'
                                    : 'border-slate-200 dark:border-slate-700 hover:border-primary/50'
                                    }`}
                            >
                                <div className="text-2xl mb-2">{goal.icon}</div>
                                <div className="font-semibold text-sm text-slate-900 dark:text-white">{goal.label}</div>
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );

    const renderAppearanceSection = () => (
        <div className="space-y-6 animate-fade-in">
            <div className="card space-y-6">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <Palette className="w-6 h-6 text-primary" />
                    Theme
                </h3>

                <div className="grid grid-cols-2 gap-4">
                    <button
                        onClick={() => updateSetting('theme', 'light')}
                        className={`p-6 rounded-xl border-2 transition-all ${settings.theme === 'light'
                            ? 'border-primary bg-primary/10'
                            : 'border-slate-200 dark:border-slate-700 hover:border-primary/50'
                            }`}
                    >
                        <Sun className="w-8 h-8 text-yellow-500 mx-auto mb-3" />
                        <div className="font-semibold text-slate-900 dark:text-white">Light Mode</div>
                    </button>

                    <button
                        onClick={() => updateSetting('theme', 'dark')}
                        className={`p-6 rounded-xl border-2 transition-all ${settings.theme === 'dark'
                            ? 'border-primary bg-primary/10'
                            : 'border-slate-200 dark:border-slate-700 hover:border-primary/50'
                            }`}
                    >
                        <Moon className="w-8 h-8 text-slate-400 mx-auto mb-3" />
                        <div className="font-semibold text-slate-900 dark:text-white">Dark Mode</div>
                    </button>
                </div>
            </div>

            <div className="card space-y-6">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <Type className="w-6 h-6 text-primary" />
                    Text Size
                </h3>

                <div className="space-y-3">
                    {[
                        { value: 'small', label: 'Small', size: 'text-sm' },
                        { value: 'normal', label: 'Normal', size: 'text-base' },
                        { value: 'large', label: 'Large', size: 'text-lg' }
                    ].map((size) => (
                        <button
                            key={size.value}
                            onClick={() => updateSetting('fontSize', size.value as any)}
                            className={`w-full p-4 rounded-xl border-2 transition-all text-left ${settings.fontSize === size.value
                                ? 'border-primary bg-primary/10'
                                : 'border-slate-200 dark:border-slate-700 hover:border-primary/50'
                                }`}
                        >
                            <div className={`font-semibold text-slate-900 dark:text-white ${size.size}`}>
                                {size.label} Text Size
                            </div>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );

    const renderSecuritySection = () => (
        <div className="space-y-6 animate-fade-in">
            <div className="card space-y-6">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <Lock className="w-6 h-6 text-primary" />
                    App Security
                </h3>

                <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-700/30 rounded-xl">
                    <div>
                        <p className="font-medium text-slate-900 dark:text-white">PIN Lock</p>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Require PIN to access app</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                        <input
                            type="checkbox"
                            className="sr-only peer"
                            checked={settings.pinEnabled}
                            onChange={(e) => updateSetting('pinEnabled', e.target.checked)}
                        />
                        <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 dark:peer-focus:ring-primary/40 rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary"></div>
                    </label>
                </div>

                {settings.pinEnabled && (
                    <button className="w-full flex items-center justify-between p-4 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors group">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                                <Key className="w-5 h-5 text-blue-600" />
                            </div>
                            <span className="font-medium text-slate-900 dark:text-white">Change PIN</span>
                        </div>
                        <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-primary transition-colors" />
                    </button>
                )}

                <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-700/30 rounded-xl">
                    <div>
                        <p className="font-medium text-slate-900 dark:text-white">Biometric Unlock</p>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Use fingerprint or Face ID</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                        <input
                            type="checkbox"
                            className="sr-only peer"
                            checked={settings.biometricEnabled}
                            onChange={(e) => updateSetting('biometricEnabled', e.target.checked)}
                            disabled={!settings.pinEnabled}
                        />
                        <div className={`w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 dark:peer-focus:ring-primary/40 rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary ${!settings.pinEnabled ? 'opacity-50 cursor-not-allowed' : ''}`}></div>
                    </label>
                </div>
            </div>
        </div>
    );

    const renderSupportSection = () => (
        <div className="space-y-6 animate-fade-in">
            <div className="card space-y-3">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-4">
                    <HelpCircle className="w-6 h-6 text-primary" />
                    Get Help
                </h3>

                <button className="w-full flex items-center justify-between p-4 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors group">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                            <HelpCircle className="w-5 h-5 text-blue-600" />
                        </div>
                        <span className="font-medium text-slate-900 dark:text-white">Help Center</span>
                    </div>
                    <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-primary transition-colors" />
                </button>

                <button className="w-full flex items-center justify-between p-4 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors group">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                            <Mail className="w-5 h-5 text-green-600" />
                        </div>
                        <span className="font-medium text-slate-900 dark:text-white">Contact Support</span>
                    </div>
                    <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-primary transition-colors" />
                </button>
            </div>

            <div className="card">
                <div className="flex items-center justify-between p-4">
                    <div>
                        <p className="font-medium text-slate-900 dark:text-white">App Version</p>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Well-Link v1.0.0</p>
                    </div>
                    <div className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 text-xs font-semibold rounded-full">
                        Up to date
                    </div>
                </div>
            </div>
        </div>
    );

    const renderSection = () => {
        switch (activeSection) {
            case 'account':
                return renderAccountSection();
            case 'privacy':
                return renderPrivacySection();
            case 'notifications':
                return renderNotificationsSection();
            case 'ai':
                return renderAISection();
            case 'appearance':
                return renderAppearanceSection();
            case 'security':
                return renderSecuritySection();
            case 'support':
                return renderSupportSection();
            default:
                return renderMainMenu();
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center gap-4">
                {activeSection !== 'menu' && (
                    <button
                        onClick={() => setActiveSection('menu')}
                        className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-xl transition-colors"
                    >
                        <ArrowLeft className="w-6 h-6 text-slate-900 dark:text-white" />
                    </button>
                )}
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
                        {activeSection === 'menu' ? 'Settings' : menuItems.find(i => i.id === activeSection)?.label}
                    </h1>
                    {activeSection === 'menu' && (
                        <p className="text-slate-500 dark:text-slate-400 mt-1">Manage your account and preferences</p>
                    )}
                </div>
            </div>

            {/* Content */}
            {renderSection()}

            {/* Photo View Modal */}
            {showPhotoModal && settings.profileImage && (
                <div
                    className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4 animate-fade-in"
                    onClick={() => setShowPhotoModal(false)}
                >
                    <button
                        className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors"
                        onClick={() => setShowPhotoModal(false)}
                    >
                        <X className="w-6 h-6" />
                    </button>
                    <img
                        src={settings.profileImage}
                        alt="Profile Full Size"
                        className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl"
                        onClick={(e) => e.stopPropagation()}
                    />
                </div>
            )}
        </div>
    );
};

export default SettingsPage;
