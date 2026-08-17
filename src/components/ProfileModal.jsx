import React, { useState, useEffect } from 'react';
import { 
  X, User, Mail, Globe, Briefcase, FileText, Lock, 
  KeyRound, Send, CheckCircle2, AlertCircle, Save, LogOut, ShieldCheck, Camera, Upload, RefreshCw
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
        setSaveSuccess('Profile details saved successfully!');
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
      if (res.code) {
        setOtpCode(res.code);
      }
      setOtpSentNotice(`Verification 6-Digit OTP code: ${res.code || 'sent'}! Code auto-filled.`);
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
        setPassSuccess('Password changed successfully!');
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0D1117]/85 backdrop-blur-md animate-fadeIn">
      <div 
        className="relative w-full max-w-2xl bg-[#161B22] rounded-2xl p-6 sm:p-8 border border-[#30363D] shadow-2xl max-h-[92vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Background Decorative Glows */}
        <div className="absolute -top-24 -left-24 w-48 h-48 bg-[#C7ED3D]/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-[#3FB950]/10 rounded-full blur-3xl pointer-events-none"></div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-[#8B949E] hover:text-[#F0F6FC] hover:bg-[#21262D] transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Profile Header */}
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-[#30363D]">
          <div className="flex items-center space-x-4">
            
            {/* Profile Picture Upload Circle */}
            <div className="relative group">
              <div className="w-16 h-16 rounded-xl bg-[#21262D] border border-[#30363D] group-hover:border-[#C7ED3D] shrink-0 overflow-hidden flex items-center justify-center">
                {hasPhoto ? (
                  <img src={profileData.avatar} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <span className="font-extrabold text-2xl text-[#C7ED3D] font-['Outfit']">
                    {profileData.name ? profileData.name[0].toUpperCase() : 'U'}
                  </span>
                )}
              </div>
              <label className="absolute inset-0 bg-[#0D1117]/80 rounded-xl flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 cursor-pointer transition">
                <Camera className="w-5 h-5 text-[#C7ED3D] mb-0.5" />
                <span className="text-[9px] font-bold text-[#F0F6FC]">Upload</span>
                <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
              </label>
            </div>

            <div>
              <h2 className="text-xl font-extrabold text-[#F0F6FC] font-['Outfit']">User Profile & Settings</h2>
              <p className="text-xs text-[#8B949E]">Manage account credentials and research profile</p>
            </div>
          </div>

          <button
            onClick={() => { onLogout(); onClose(); }}
            className="px-3.5 py-1.5 rounded-xl bg-[#0D1117] border border-[#F85149]/30 text-[#F85149] hover:bg-[#F85149]/10 transition text-xs font-semibold flex items-center space-x-1.5"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>

        {/* Save Profile Success / Error Notices */}
        {saveSuccess && (
          <div className="mb-4 p-3 rounded-xl bg-[#3FB950]/10 border border-[#3FB950]/30 text-[#3FB950] text-xs flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-[#3FB950] shrink-0" />
            <span>{saveSuccess}</span>
          </div>
        )}

        {saveError && (
          <div className="mb-4 p-3 rounded-xl bg-[#F85149]/10 border border-[#F85149]/30 text-[#F85149] text-xs flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 text-[#F85149] shrink-0" />
            <span>{saveError}</span>
          </div>
        )}

        {/* ── Section 1: Edit Profile Details Form ── */}
        <form onSubmit={handleSaveProfile} className="space-y-4 mb-8">
          
          {/* Profile Picture Upload Banner */}
          <div className="p-4 rounded-xl bg-[#0D1117] border border-[#30363D] flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2.5 rounded-xl bg-[#21262D] text-[#C7ED3D]">
                <Camera className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs font-bold text-[#F0F6FC]">Profile Photo</div>
                <div className="text-[11px] text-[#8B949E]">Upload a profile image (JPG, PNG, WebP)</div>
              </div>
            </div>

            <label className="px-4 py-2 rounded-xl bg-[#21262D] hover:bg-[#30363D] border border-[#C7ED3D]/50 text-[#C7ED3D] text-xs font-bold transition cursor-pointer flex items-center space-x-1.5 shadow-md">
              <Upload className="w-3.5 h-3.5 text-[#C7ED3D]" />
              <span>{hasPhoto ? 'Change Photo' : 'Upload Photo'}</span>
              <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
            </label>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Full Name */}
            <div>
              <label className="block text-xs font-semibold text-[#8B949E] mb-1.5 uppercase tracking-wider">Full Name</label>
              <div className="relative">
                <User className="absolute left-3.5 top-3 w-4 h-4 text-[#8B949E]" />
                <input
                  type="text"
                  name="name"
                  value={profileData.name}
                  onChange={handleInputChange}
                  placeholder="Your Full Name"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#0D1117] border border-[#30363D] text-sm text-[#F0F6FC] focus:outline-none focus:border-[#C7ED3D]"
                />
              </div>
            </div>

            {/* Email Address (Registered / Read-only) */}
            <div>
              <label className="block text-xs font-semibold text-[#8B949E] mb-1.5 uppercase tracking-wider">Registered Email (Read-Only)</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-3 w-4 h-4 text-[#8B949E]" />
                <input
                  type="email"
                  value={profileData.email}
                  readOnly
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#0D1117] border border-[#30363D] text-sm text-[#8B949E] cursor-not-allowed"
                />
              </div>
            </div>

            {/* Country / Region */}
            <div>
              <label className="block text-xs font-semibold text-[#8B949E] mb-1.5 uppercase tracking-wider">Country / Region</label>
              <div className="relative">
                <Globe className="absolute left-3.5 top-3 w-4 h-4 text-[#8B949E]" />
                <select
                  name="country"
                  value={profileData.country}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#0D1117] border border-[#30363D] text-sm text-[#F0F6FC] focus:outline-none focus:border-[#C7ED3D]"
                >
                  {countries.map(c => (
                    <option key={c} value={c} className="bg-[#0D1117] text-[#F0F6FC]">{c}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Role / Occupation */}
            <div>
              <label className="block text-xs font-semibold text-[#8B949E] mb-1.5 uppercase tracking-wider">Occupation / Role</label>
              <div className="relative">
                <Briefcase className="absolute left-3.5 top-3 w-4 h-4 text-[#8B949E]" />
                <input
                  type="text"
                  name="role"
                  value={profileData.role}
                  onChange={handleInputChange}
                  placeholder="ML Researcher / Data Analyst"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#0D1117] border border-[#30363D] text-sm text-[#F0F6FC] focus:outline-none focus:border-[#C7ED3D]"
                />
              </div>
            </div>

          </div>

          {/* Bio / Personal Notes */}
          <div>
            <label className="block text-xs font-semibold text-[#8B949E] mb-1.5 uppercase tracking-wider">Bio & Notes</label>
            <div className="relative">
              <FileText className="absolute left-3.5 top-3 w-4 h-4 text-[#8B949E]" />
              <textarea
                name="bio"
                rows={2}
                value={profileData.bio}
                onChange={handleInputChange}
                placeholder="Tell us about your research or background..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#0D1117] border border-[#30363D] text-sm text-[#F0F6FC] focus:outline-none focus:border-[#C7ED3D] resize-none"
              />
            </div>
          </div>

          {/* Save Profile Button */}
          <button
            type="submit"
            disabled={saving}
            className="w-full py-3 rounded-xl bg-[#C7ED3D] hover:bg-[#D4F455] text-[#0D1117] font-extrabold text-xs shadow-lg shadow-[#C7ED3D]/25 transition flex items-center justify-center space-x-2"
          >
            {saving ? (
              <RefreshCw className="w-4 h-4 animate-spin text-[#0D1117]" />
            ) : (
              <>
                <Save className="w-4 h-4 text-[#0D1117]" />
                <span>Save Profile Changes</span>
              </>
            )}
          </button>
        </form>

        {/* ── Section 2: Security & Password Change with OTP Verification ── */}
        <div className="pt-6 border-t border-[#30363D]">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <ShieldCheck className="w-5 h-5 text-[#C7ED3D]" />
              <h3 className="text-sm font-bold text-[#F0F6FC] font-['Outfit']">Change Password (OTP Verification Required)</h3>
            </div>
            
            <button
              type="button"
              onClick={() => setShowPasswordChange(!showPasswordChange)}
              className="text-xs text-[#C7ED3D] hover:text-[#D4F455] transition font-semibold font-mono"
            >
              {showPasswordChange ? 'Hide Password Form' : 'Change Password'}
            </button>
          </div>

          {showPasswordChange && (
            <div className="p-5 rounded-xl bg-[#0D1117] border border-[#30363D] space-y-4 animate-fadeIn">
              
              {/* Passcode Success / Error alerts */}
              {passSuccess && (
                <div className="p-3 rounded-xl bg-[#3FB950]/10 border border-[#3FB950]/30 text-[#3FB950] text-xs flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-[#3FB950] shrink-0" />
                  <span>{passSuccess}</span>
                </div>
              )}

              {passError && (
                <div className="p-3 rounded-xl bg-[#F85149]/10 border border-[#F85149]/30 text-[#F85149] text-xs flex items-center space-x-2">
                  <AlertCircle className="w-4 h-4 text-[#F85149] shrink-0" />
                  <span>{passError}</span>
                </div>
              )}

              {otpSentNotice && (
                <div className="p-3 rounded-xl bg-[#21262D] border border-[#C7ED3D]/40 text-[#C7ED3D] text-xs flex items-center space-x-2">
                  <Send className="w-4 h-4 text-[#C7ED3D] shrink-0" />
                  <span>{otpSentNotice}</span>
                </div>
              )}

              {/* Step A: Request OTP Code Button */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-[#161B22] border border-[#30363D]">
                <span className="text-xs text-[#8B949E] font-medium">Send OTP passcode to {user.email} to verify password update:</span>
                <button
                  type="button"
                  onClick={handleSendPasswordOtp}
                  disabled={sendingOtp}
                  className="px-3.5 py-1.5 rounded-lg bg-[#21262D] hover:bg-[#30363D] border border-[#C7ED3D]/50 text-[#C7ED3D] text-xs font-bold transition flex items-center space-x-1.5 shrink-0"
                >
                  <KeyRound className="w-3.5 h-3.5 text-[#C7ED3D]" />
                  <span>{sendingOtp ? 'Sending OTP...' : 'Send OTP Code'}</span>
                </button>
              </div>

              {/* Step B: OTP & New Password Form */}
              <form onSubmit={handleChangePasswordWithOtp} className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-[#8B949E] mb-1 uppercase tracking-wider">6-Digit OTP Code</label>
                  <input
                    type="text"
                    maxLength={6}
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value)}
                    placeholder="Enter 6-digit OTP code"
                    className="w-full px-3.5 py-2 rounded-xl bg-[#161B22] border border-[#30363D] text-center text-lg font-bold tracking-widest text-[#C7ED3D] focus:outline-none focus:border-[#C7ED3D]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-[#8B949E] mb-1 uppercase tracking-wider">New Password</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-2.5 w-4 h-4 text-[#8B949E]" />
                      <input
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="••••••••••••"
                        className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#161B22] border border-[#30363D] text-xs text-[#F0F6FC] focus:outline-none focus:border-[#C7ED3D]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#8B949E] mb-1 uppercase tracking-wider">Confirm New Password</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-2.5 w-4 h-4 text-[#8B949E]" />
                      <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="••••••••••••"
                        className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#161B22] border border-[#30363D] text-xs text-[#F0F6FC] focus:outline-none focus:border-[#C7ED3D]"
                      />
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={passLoading}
                  className="w-full py-2.5 rounded-xl bg-[#C7ED3D] hover:bg-[#D4F455] text-[#0D1117] font-extrabold text-xs shadow-md transition flex items-center justify-center space-x-2"
                >
                  <ShieldCheck className="w-4 h-4 text-[#0D1117]" />
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
