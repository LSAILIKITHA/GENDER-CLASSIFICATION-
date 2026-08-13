import React, { useState } from 'react';
import { 
  X, Sparkles, User, Mail, Lock, LogIn, UserPlus, ShieldCheck, 
  ArrowRight, Chrome, KeyRound, CheckCircle2, RefreshCw, PhoneCall
} from 'lucide-react';
import { 
  signInWithGoogle, 
  sendOtpPasscode, 
  sendRealPhoneSmsOtp,
  verifyOtpPasscode, 
  registerWithEmail, 
  loginWithEmail, 
  loginAsGuest 
} from '../firebase';

export default function AuthModal({ isOpen, onClose, onLoginSuccess }) {
  const [isLogin, setIsLogin] = useState(true); // true = Sign In, false = Register
  
  // Registration & Login Form State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'ML Researcher'
  });

  // OTP Verification Step within Registration
  const [regStep, setRegStep] = useState(1); // 1 = Details Input, 2 = OTP Passcode Verification
  const [otpCode, setOtpCode] = useState('');
  const [otpNotice, setOtpNotice] = useState('');

  // Google Account Chooser State
  const [showGoogleChooser, setShowGoogleChooser] = useState(false);
  const [customGoogleInput, setCustomGoogleInput] = useState({ name: '', email: '' });
  const [isCustomGoogleAccount, setIsCustomGoogleAccount] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError('');
  };

  // Preset Google Accounts for quick selection
  const googleAccountPresets = [
    { name: 'Adithya Ram', email: 'adithya.ram@gmail.com', avatar: 'A', bg: 'from-indigo-600 to-purple-600' },
    { name: 'Sai Likitha', email: 'sai.likitha@gmail.com', avatar: 'S', bg: 'from-pink-600 to-rose-600' },
    { name: 'ML Researcher', email: 'researcher@gmail.com', avatar: 'M', bg: 'from-emerald-600 to-teal-600' }
  ];

  // ── 1. Sign In Handler (Requires Prior Registration) ──
  const handleSignIn = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.email || !formData.password) {
      setError('Please enter your email and password');
      return;
    }

    const emailInput = formData.email.trim();

    setLoading(true);

    // Check if account exists in database before allowing Sign In
    try {
      const checkRes = await fetch('/api/v1/auth/check-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: emailInput })
      });
      const checkData = await checkRes.json();

      if (!checkData.exists) {
        setLoading(false);
        setError('No registered account found with this email. Please Register first.');
        setIsLogin(false); // Auto-switch to Register tab!
        return;
      }
    } catch (err) {
      console.warn("Email check error during login:", err);
    }

    try {
      const result = await loginWithEmail(emailInput, formData.password);
      setLoading(false);

      if (result.success && result.profile) {
        localStorage.setItem('namelens_user', JSON.stringify(result.profile));
        onLoginSuccess(result.profile);
        onClose();
      } else {
        setError(result.error || 'Authentication failed. Please check credentials.');
      }
    } catch (err) {
      setLoading(false);
      setError(err.message || 'An error occurred during sign in.');
    }
  };

  // ── 2. Registration Step 1: Check Duplicate Email & Send OTP ──
  const handleSendRegistrationOtp = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.name || !formData.email || !formData.password) {
      setError('Please fill in all required registration fields');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    const contact = formData.email.trim();

    setLoading(true);

    // 1. Check if email already exists in database
    if (contact.includes('@')) {
      try {
        const checkRes = await fetch('/api/v1/auth/check-email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: contact })
        });
        const checkData = await checkRes.json();

        if (checkData.exists) {
          setLoading(false);
          setError('An account with this email address already exists. Please Sign In instead.');
          return;
        }
      } catch (err) {
        console.warn("Email check error:", err);
      }
    }

    // 2. Dispatch OTP code
    let res;
    if (contact.startsWith('+') || /^\d+$/.test(contact)) {
      res = await sendRealPhoneSmsOtp(contact, 'recaptcha-container');
    } else {
      res = await sendOtpPasscode(contact);
    }
    setLoading(false);

    if (res.success) {
      setRegStep(2);
      setOtpNotice(res.message);
    } else {
      setError(res.error || 'Failed to send OTP code.');
    }
  };

  // ── 3. Registration Step 2: Verify OTP & Complete Account ──
  const handleVerifyOtpAndRegister = async (e) => {
    e.preventDefault();
    setError('');

    if (!otpCode || otpCode.trim().length !== 6) {
      setError('Please enter the 6-digit verification OTP code.');
      return;
    }

    setLoading(true);

    try {
      // 1. Verify 6-digit OTP code against backend
      const otpRes = await verifyOtpPasscode(otpCode.trim(), formData.email.trim());
      
      if (!otpRes.success) {
        setLoading(false);
        setError(otpRes.error || 'Invalid verification OTP code. Please check and try again.');
        return;
      }

      // 2. Construct verified user profile
      const userProfile = {
        id: otpRes.profile?.id || 'usr-' + Date.now(),
        name: formData.name ? formData.name.trim() : (formData.email.split('@')[0] || 'User'),
        email: formData.email.trim(),
        role: formData.role || 'ML Researcher',
        avatar: (formData.name ? formData.name[0] : (formData.email[0] || 'U')).toUpperCase(),
        token: otpRes.profile?.token || 'verified-otp-token-' + Date.now()
      };

      // 3. Save session, stop spinner, close modal & navigate to home page!
      setLoading(false);
      localStorage.setItem('namelens_user', JSON.stringify(userProfile));
      onLoginSuccess(userProfile);
      onClose();
    } catch (err) {
      setLoading(false);
      setError(err.message || 'Error verifying OTP passcode.');
    }
  };

  // ── 4. Google OAuth Sign-In & Account Chooser ──
  const handleGoogleAuth = async () => {
    setLoading(true);
    setError('');
    try {
      const result = await signInWithGoogle();
      setLoading(false);
      if (result.success && result.profile) {
        localStorage.setItem('namelens_user', JSON.stringify(result.profile));
        onLoginSuccess(result.profile);
        onClose();
      } else {
        setShowGoogleChooser(true);
      }
    } catch (err) {
      setLoading(false);
      setShowGoogleChooser(true);
    }
  };

  const handleSelectGoogleAccount = async (accountProfile) => {
    setLoading(true);
    setError('');
    try {
      const result = await signInWithGoogle(accountProfile);
      setLoading(false);
      if (result.success && result.profile) {
        localStorage.setItem('namelens_user', JSON.stringify(result.profile));
        onLoginSuccess(result.profile);
        onClose();
      } else {
        setError('Failed to sign in with selected Google account.');
      }
    } catch (err) {
      setLoading(false);
      setError('Google Sign-In error: ' + err.message);
    }
  };

  // ── 5. Guest Pass Login ──
  const handleGuestPass = async () => {
    setLoading(true);
    const res = await loginAsGuest();
    setLoading(false);
    if (res.success && res.profile) {
      localStorage.setItem('namelens_user', JSON.stringify(res.profile));
      onLoginSuccess(res.profile);
      onClose();
    }
  };

  const handleFillDemo = () => {
    setIsLogin(true);
    setFormData({
      name: 'Adithya Ram',
      email: 'adithya@namelens.ai',
      password: 'password123',
      role: 'Lead ML Engineer'
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div 
        className="relative w-full max-w-md glass-panel rounded-3xl p-6 sm:p-8 border border-indigo-500/30 shadow-2xl shadow-indigo-950/50 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Hidden reCAPTCHA container for Firebase Phone SMS OTP */}
        <div id="recaptcha-container"></div>

        {/* Decorative Background Glows */}
        <div className="absolute -top-24 -left-24 w-48 h-48 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-pink-500/20 rounded-full blur-3xl pointer-events-none"></div>

        {/* Close Button */}
        <button
          onClick={() => {
            if (showGoogleChooser) setShowGoogleChooser(false);
            else onClose();
          }}
          className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-white hover:bg-slate-800/80 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {showGoogleChooser ? (
          /* ── GOOGLE ACCOUNT CHOOSER SCREEN ── */
          <div className="animate-fadeIn">
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-slate-900 border border-slate-800 p-2.5 mb-3 shadow-lg shadow-indigo-500/10">
                <Chrome className="w-7 h-7 text-indigo-400" />
              </div>
              <h2 className="text-2xl font-extrabold text-white font-['Outfit']">
                Choose a Google Account
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Select an account to sign in to NameLens Spatial AI
              </p>
            </div>

            {/* Error Alert inside Google Chooser */}
            {error && (
              <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center space-x-2">
                <span className="font-bold">•</span>
                <span>{error}</span>
              </div>
            )}

            {/* List of Available Google Accounts */}
            <div className="space-y-3 mb-6">
              {googleAccountPresets.map((acc, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSelectGoogleAccount({ name: acc.name, email: acc.email, avatar: acc.avatar })}
                  disabled={loading}
                  className="w-full flex items-center justify-between p-3.5 rounded-2xl glass-card border border-slate-800 hover:border-indigo-500/50 hover:bg-slate-900/80 transition group text-left"
                >
                  <div className="flex items-center space-x-3">
                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-tr ${acc.bg} flex items-center justify-center text-white text-sm font-bold shadow-md`}>
                      {acc.avatar}
                    </div>
                    <div>
                      <div className="text-sm font-bold text-slate-100 group-hover:text-white transition">{acc.name}</div>
                      <div className="text-xs text-slate-400">{acc.email}</div>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-indigo-400 transition transform group-hover:translate-x-1" />
                </button>
              ))}

              {/* Custom Google Account Entry Option */}
              {!isCustomGoogleAccount ? (
                <button
                  type="button"
                  onClick={() => setIsCustomGoogleAccount(true)}
                  className="w-full py-3 px-4 rounded-2xl border border-dashed border-slate-700 hover:border-indigo-500/60 text-xs font-semibold text-indigo-400 hover:text-indigo-300 transition flex items-center justify-center space-x-2"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>Use another Google account</span>
                </button>
              ) : (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (!customGoogleInput.email || !customGoogleInput.email.includes('@')) {
                      setError('Please enter a valid Google email address.');
                      return;
                    }
                    handleSelectGoogleAccount({
                      name: customGoogleInput.name || customGoogleInput.email.split('@')[0],
                      email: customGoogleInput.email,
                      avatar: (customGoogleInput.name ? customGoogleInput.name[0] : customGoogleInput.email[0]).toUpperCase()
                    });
                  }}
                  className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3"
                >
                  <div className="text-xs font-bold text-slate-300">Enter Google Account Details</div>
                  <div>
                    <input
                      type="text"
                      placeholder="Your Name (e.g. Alex Smith)"
                      value={customGoogleInput.name}
                      onChange={(e) => setCustomGoogleInput({ ...customGoogleInput, name: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-xl glass-input text-xs text-white placeholder-slate-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <input
                      type="email"
                      required
                      placeholder="alex@gmail.com"
                      value={customGoogleInput.email}
                      onChange={(e) => setCustomGoogleInput({ ...customGoogleInput, email: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-xl glass-input text-xs text-white placeholder-slate-500 focus:outline-none"
                    />
                  </div>
                  <div className="flex space-x-2 pt-1">
                    <button
                      type="button"
                      onClick={() => setIsCustomGoogleAccount(false)}
                      className="flex-1 py-2 rounded-xl bg-slate-800 text-xs font-semibold text-slate-300 hover:text-white"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className="flex-1 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-xs font-semibold text-white shadow-md"
                    >
                      {loading ? 'Signing in...' : 'Sign In with Google'}
                    </button>
                  </div>
                </form>
              )}
            </div>

            <button
              type="button"
              onClick={() => setShowGoogleChooser(false)}
              className="w-full py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-semibold text-slate-400 hover:text-slate-200 transition"
            >
              ← Back to standard Sign In
            </button>
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 p-[2px] mb-3 shadow-lg shadow-indigo-500/30">
                <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-indigo-400 animate-pulse" />
                </div>
              </div>
              <h2 className="text-2xl font-extrabold text-white font-['Outfit']">
                {isLogin ? 'Welcome Back to NameLens' : 'Register with OTP Verification'}
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                {isLogin 
                  ? 'Access spatial name analytics, custom datasets & batch AI' 
                  : 'Create an account with OTP passcode validation'}
              </p>
            </div>

        {/* Tab Selector: Sign In vs Register */}
        <div className="flex bg-slate-900/90 p-1 rounded-xl border border-slate-800 mb-6">
          <button
            type="button"
            onClick={() => { setIsLogin(true); setError(''); setRegStep(1); }}
            className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all flex items-center justify-center space-x-2 ${
              isLogin ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <LogIn className="w-3.5 h-3.5" />
            <span>Sign In</span>
          </button>
          <button
            type="button"
            onClick={() => { setIsLogin(false); setError(''); setRegStep(1); }}
            className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all flex items-center justify-center space-x-2 ${
              !isLogin ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>Register</span>
          </button>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center space-x-2">
            <span className="font-bold">•</span>
            <span>{error}</span>
          </div>
        )}

        {/* OTP Success Notice */}
        {otpNotice && !isLogin && regStep === 2 && (
          <div className="mb-4 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{otpNotice}</span>
          </div>
        )}

        {/* ── OPTION A: SIGN IN FORM ── */}
        {isLogin && (
          <form onSubmit={handleSignIn} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="researcher@namelens.ai"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl glass-input text-sm text-white placeholder-slate-500 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="text-xs font-semibold text-slate-300">Password</label>
                <button type="button" onClick={handleFillDemo} className="text-[11px] text-indigo-400 hover:text-indigo-300 transition font-medium">
                  Auto-fill Demo Credentials
                </button>
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="••••••••••••"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl glass-input text-sm text-white placeholder-slate-500 focus:outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white font-semibold text-sm shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:opacity-95 transition flex items-center justify-center space-x-2"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <>
                  <span>Sign In to Dashboard</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        )}

        {/* ── OPTION B: REGISTER WITH OTP VERIFICATION ── */}
        {!isLogin && (
          <>
            {regStep === 1 ? (
              /* Step 1: User fills registration details */
              <form onSubmit={handleSendRegistrationOtp} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Alex Rivers"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl glass-input text-sm text-white placeholder-slate-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">Email Address / Phone</label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="researcher@namelens.ai"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl glass-input text-sm text-white placeholder-slate-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">Create Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
                    <input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      placeholder="••••••••••••"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl glass-input text-sm text-white placeholder-slate-500 focus:outline-none"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-600 via-indigo-600 to-purple-600 text-white font-semibold text-sm shadow-lg hover:opacity-95 transition flex items-center justify-center space-x-2"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  ) : (
                    <>
                      <span>Send OTP Passcode to Register</span>
                      <PhoneCall className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            ) : (
              /* Step 2: Enter 6-digit OTP verification code right inside registration */
              <form onSubmit={handleVerifyOtpAndRegister} className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <label className="text-xs font-semibold text-slate-300">
                      OTP Sent to <span className="text-indigo-400">{formData.email}</span>
                    </label>
                    <button 
                      type="button" 
                      onClick={() => setRegStep(1)} 
                      className="text-[11px] text-indigo-400 hover:text-indigo-300 transition flex items-center space-x-1"
                    >
                      <RefreshCw className="w-3 h-3" />
                      <span>Edit Info</span>
                    </button>
                  </div>
                  <div className="relative">
                    <KeyRound className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
                    <input
                      type="text"
                      maxLength={6}
                      value={otpCode}
                      onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
                      placeholder="123456"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl glass-input text-lg font-bold tracking-widest text-indigo-300 placeholder-slate-600 focus:outline-none text-center"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-600 via-indigo-600 to-purple-600 text-white font-semibold text-sm shadow-lg hover:opacity-95 transition flex items-center justify-center space-x-2"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  ) : (
                    <>
                      <span>Verify OTP & Create Account</span>
                      <ShieldCheck className="w-4 h-4 text-emerald-300" />
                    </>
                  )}
                </button>
              </form>
            )}
          </>
        )}

        {/* Divider */}
        <div className="relative my-5 flex items-center justify-center">
          <div className="border-t border-slate-800 w-full"></div>
          <span className="bg-slate-950 px-3 text-[11px] text-slate-500 font-medium tracking-wider uppercase">Or Continue With</span>
        </div>

        {/* Quick Social & Guest Buttons */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <button
            type="button"
            onClick={handleGoogleAuth}
            disabled={loading}
            className="flex items-center justify-center space-x-2 py-2.5 rounded-xl glass-card text-xs font-semibold text-slate-300 hover:text-white transition border border-slate-800 hover:border-indigo-500/50"
          >
            <Chrome className="w-4 h-4 text-indigo-400" />
            <span>Google Sign-In</span>
          </button>

          <button
            type="button"
            onClick={handleGuestPass}
            disabled={loading}
            className="flex items-center justify-center space-x-2 py-2.5 rounded-xl glass-card text-xs font-semibold text-slate-300 hover:text-white transition border border-slate-800 hover:border-emerald-500/50"
          >
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Guest Pass</span>
          </button>
        </div>

        {/* Footnote */}
        <p className="text-[11px] text-center text-slate-500">
          Registrations require 6-digit OTP verification and save to Firebase & SQLite.
        </p>
          </>
        )}
      </div>
    </div>
  );
}
