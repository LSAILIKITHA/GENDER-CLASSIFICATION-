import React, { useState, useEffect } from 'react';
import { 
  X, User, Mail, Globe, Briefcase, FileText, Lock, 
  KeyRound, Send, CheckCircle2, AlertCircle, Save, LogOut, ShieldCheck, Camera, Upload
} from 'lucide-react';
import { sendOtpPasscode } from '../firebase';

export default function ProfileModal({ isOpen, onClose, user, onLogout, onUpdateUser }) {
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    country: 'India',
    role: 'ML Researcher',
    bio: '',
    avatar: ''
  });

  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState('');
  const [saveError, setSaveError] = useState('');

  // Password Change with OTP State
  const [showPasswordChange, setShowPasswordChange] = useState(false);
  const [sendingOtp, setSendingOtp] = useState(false);
  const [otpSentNotice, setOtpSentNotice] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passLoading, setPassLoading] = useState(false);
  const [passSuccess, setPassSuccess] = useState('');
  const [passError, setPassError] = useState('');

  useEffect(() => {
    if (user) {
      setProfileData({
        name: user.name || '',
        email: user.email || '',
        country: user.country || 'India',
        role: user.role || 'ML Researcher',
        bio: user.bio || '',
        avatar: user.avatar || ''
      });
    }
  }, [user, isOpen]);

  if (!isOpen || !user) return null;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({ ...prev, [name]: value }));
  };

  // Handle Photo File Upload
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 3 * 1024 * 1024) {
        setSaveError('Image file size must be less than 3MB.');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileData(prev => ({ ...prev, avatar: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Save Profile Changes to SQLite Database & local session
  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setSaveError('');
    setSaveSuccess('');

    if (!profileData.name.trim()) {
      setSaveError('Full Name is required.');
      return;
    }

    setSaving(true);
    try {
      const res = await fetch('/api/v1/auth/update-profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: user.id || user.email,
          name: profileData.name.trim(),
          email: user.email.trim(),
          country: profileData.country,
          role: profileData.role,
          bio: profileData.bio,
          avatar: profileData.avatar
        })
      });

      const data = await res.json();
      setSaving(false);

      if (data.success) {
        const updatedUser = {
          ...user,
          name: profileData.name.trim(),
          country: profileData.country,
          role: profileData.role,
          bio: profileData.bio,
          avatar: profileData.avatar
        };
        localStorage.setItem('namelens_user', JSON.stringify(updatedUser));
        if (onUpdateUser) onUpdateUser(updatedUser);
        setSaveSuccess('Profile picture and details saved successfully to database!');
        setTimeout(() => setSaveSuccess(''), 4000);
      } else {
        setSaveError(data.error || 'Failed to save profile changes.');
      }
    } catch (err) {
      setSaving(false);
      setSaveError(err.message || 'Error updating profile.');
    }
  };

  // Dispatch OTP for Password Change
  const handleSendPasswordOtp = async () => {
    setPassError('');
    setPassSuccess('');
    setOtpSentNotice('');
    setSendingOtp(true);

    const res = await sendOtpPasscode(user.email.trim());
    setSendingOtp(false);

    if (res.success) {
      setOtpSentNotice(`Verification OTP sent to ${user.email}! Please check your email inbox.`);
    } else {
      setPassError(res.error || 'Failed to send OTP code.');
    }
  };

  // Submit Password Change with OTP Verification
  const handleChangePasswordWithOtp = async (e) => {
    e.preventDefault();
    setPassError('');
    setPassSuccess('');

    if (!otpCode || otpCode.trim().length !== 6) {
      setPassError('Please enter the 6-digit OTP passcode.');
      return;
    }

    if (!newPassword || newPassword.length < 6) {
      setPassError('New password must be at least 6 characters.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setPassError('Passwords do not match.');
      return;
    }

    setPassLoading(true);

    try {
      const res = await fetch('/api/v1/auth/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: user.email.trim(),
          otp_code: otpCode.trim(),
          new_password: newPassword.trim()
        })
      });

      const data = await res.json();
      setPassLoading(false);

      if (data.success) {
        setPassSuccess('Password changed successfully! Stored securely in database.');
        setOtpCode('');
        setNewPassword('');
        setConfirmPassword('');
        setOtpSentNotice('');
        setTimeout(() => setPassSuccess(''), 5000);
      } else {
        setPassError(data.error || 'Failed to update password.');
      }
    } catch (err) {
      setPassLoading(false);
      setPassError(err.message || 'Error changing password.');
    }
  };

  const countries = [
    'India', 'United States', 'United Kingdom', 'Germany', 'Canada', 
    'Australia', 'Japan', 'France', 'Singapore', 'Global / Other'
  ];

  const hasPhoto = profileData.avatar && (profileData.avatar.startsWith('data:image/') || profileData.avatar.startsWith('http'));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div 
        className="relative w-full max-w-2xl glass-panel rounded-3xl p-6 sm:p-8 border border-indigo-500/30 shadow-2xl shadow-indigo-950/50 max-h-[92vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Background Decorative Glows */}
        <div className="absolute -top-24 -left-24 w-48 h-48 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-purple-500/20 rounded-full blur-3xl pointer-events-none"></div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-white hover:bg-slate-800/80 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Profile Header */}
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-800">
          <div className="flex items-center space-x-4">
            
            {/* Profile Picture Upload Circle */}
            <div className="relative group">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 p-[2px] shadow-lg shadow-indigo-500/20 shrink-0 overflow-hidden">
                <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center font-extrabold text-2xl text-indigo-300 font-['Outfit'] overflow-hidden">
                  {hasPhoto ? (
                    <img src={profileData.avatar} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    profileData.name ? profileData.name[0].toUpperCase() : 'U'
                  )}
                </div>
              </div>
              <label className="absolute inset-0 bg-slate-950/80 rounded-2xl flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 cursor-pointer transition">
                <Camera className="w-5 h-5 text-white mb-0.5" />
                <span className="text-[9px] font-bold text-slate-300">Upload</span>
                <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
              </label>
            </div>

            <div>
              <h2 className="text-xl font-extrabold text-white font-['Outfit']">User Profile & Settings</h2>
              <p className="text-xs text-slate-400">Upload profile picture & manage account stored in database</p>
            </div>
          </div>

          <button
            onClick={() => { onLogout(); onClose(); }}
            className="px-3.5 py-1.5 rounded-xl glass-card border border-rose-500/30 text-rose-300 hover:bg-rose-500/20 transition text-xs font-semibold flex items-center space-x-1.5"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>

        {/* Save Profile Success / Error Notices */}
        {saveSuccess && (
          <div className="mb-4 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{saveSuccess}</span>
          </div>
        )}

        {saveError && (
          <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>{saveError}</span>
          </div>
        )}

        {/* ── Section 1: Edit Profile Details Form ── */}
        <form onSubmit={handleSaveProfile} className="space-y-4 mb-8">
          
          {/* Profile Picture Upload Banner */}
          <div className="p-4 rounded-2xl glass-card border border-indigo-500/30 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2.5 rounded-xl bg-indigo-500/20 text-indigo-400">
                <Camera className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs font-bold text-white">Profile Photo</div>
                <div className="text-[11px] text-slate-400">Upload a profile image (JPG, PNG, WebP)</div>
              </div>
            </div>

            <label className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition cursor-pointer flex items-center space-x-1.5 shadow-md shadow-indigo-500/20">
              <Upload className="w-3.5 h-3.5" />
              <span>{hasPhoto ? 'Change Photo' : 'Upload Photo'}</span>
              <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
            </label>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Full Name */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Full Name</label>
              <div className="relative">
                <User className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
                <input
                  type="text"
                  name="name"
                  value={profileData.name}
                  onChange={handleInputChange}
                  placeholder="Your Full Name"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl glass-input text-sm text-white focus:outline-none"
                />
              </div>
            </div>

            {/* Email Address (Registered / Read-only) */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Registered Email (Read-Only)</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
                <input
                  type="email"
                  value={profileData.email}
                  readOnly
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl glass-input text-sm text-slate-400 bg-slate-900/60 border border-slate-800 cursor-not-allowed"
                />
              </div>
            </div>

            {/* Country / Region */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Country / Region</label>
              <div className="relative">
                <Globe className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
                <select
                  name="country"
                  value={profileData.country}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl glass-input text-sm text-slate-200 bg-slate-900 focus:outline-none border border-slate-700"
                >
                  {countries.map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Role / Occupation */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Occupation / Role</label>
              <div className="relative">
                <Briefcase className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
                <input
                  type="text"
                  name="role"
                  value={profileData.role}
                  onChange={handleInputChange}
                  placeholder="ML Researcher / Data Analyst"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl glass-input text-sm text-white focus:outline-none"
                />
              </div>
            </div>

          </div>

          {/* Bio / Personal Notes */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Bio & Notes</label>
            <div className="relative">
              <FileText className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
              <textarea
                name="bio"
                rows={2}
                value={profileData.bio}
                onChange={handleInputChange}
                placeholder="Tell us about your research or background..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl glass-input text-sm text-white focus:outline-none resize-none"
              />
            </div>
          </div>

          {/* Save Profile Button */}
          <button
            type="submit"
            disabled={saving}
            className="w-full py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-xs shadow-lg shadow-indigo-500/20 transition flex items-center justify-center space-x-2"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Saving Profile to Database...' : 'Save Profile Picture & Changes'}</span>
          </button>
        </form>

        {/* ── Section 2: Security & Password Change with OTP Verification ── */}
        <div className="pt-6 border-t border-slate-800">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <ShieldCheck className="w-5 h-5 text-indigo-400" />
              <h3 className="text-sm font-bold text-white font-['Outfit']">Change Password (OTP Verification Required)</h3>
            </div>
            
            <button
              type="button"
              onClick={() => setShowPasswordChange(!showPasswordChange)}
              className="text-xs text-indigo-400 hover:text-indigo-300 transition font-semibold"
            >
              {showPasswordChange ? 'Hide Password Form' : 'Change Password'}
            </button>
          </div>

          {showPasswordChange && (
            <div className="p-5 rounded-2xl glass-card border border-indigo-500/30 space-y-4 animate-fadeIn">
              
              {/* Passcode Success / Error alerts */}
              {passSuccess && (
                <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>{passSuccess}</span>
                </div>
              )}

              {passError && (
                <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center space-x-2">
                  <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                  <span>{passError}</span>
                </div>
              )}

              {otpSentNotice && (
                <div className="p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs flex items-center space-x-2">
                  <Send className="w-4 h-4 text-indigo-400 shrink-0" />
                  <span>{otpSentNotice}</span>
                </div>
              )}

              {/* Step A: Request OTP Code Button */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900 border border-slate-800">
                <span className="text-xs text-slate-300 font-medium">Send OTP passcode to {user.email} to verify password update:</span>
                <button
                  type="button"
                  onClick={handleSendPasswordOtp}
                  disabled={sendingOtp}
                  className="px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition flex items-center space-x-1.5 shrink-0"
                >
                  <KeyRound className="w-3.5 h-3.5" />
                  <span>{sendingOtp ? 'Sending OTP...' : 'Send OTP Code'}</span>
                </button>
              </div>

              {/* Step B: OTP & New Password Form */}
              <form onSubmit={handleChangePasswordWithOtp} className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">6-Digit OTP Code Received in Email</label>
                  <input
                    type="text"
                    maxLength={6}
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value)}
                    placeholder="Enter 6-digit OTP code"
                    className="w-full px-3.5 py-2 rounded-xl glass-input text-center text-lg font-bold tracking-widest text-indigo-300 focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">New Password</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
                      <input
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="••••••••••••"
                        className="w-full pl-9 pr-3 py-2 rounded-xl glass-input text-xs text-white focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Confirm New Password</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
                      <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="••••••••••••"
                        className="w-full pl-9 pr-3 py-2 rounded-xl glass-input text-xs text-white focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={passLoading}
                  className="w-full py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold text-xs shadow-lg shadow-purple-500/20 transition flex items-center justify-center space-x-2"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>{passLoading ? 'Verifying OTP & Updating...' : 'Verify OTP & Update Password'}</span>
                </button>
              </form>

            </div>
          )}
        </div>

      </div>
    </div>
  );
}
