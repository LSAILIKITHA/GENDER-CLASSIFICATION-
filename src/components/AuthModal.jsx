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
  const [receivedOtp, setReceivedOtp] = useState('');
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
    { name: 'Adithya Ram', email: 'adithya.ram@gmail.com', avatar: 'A', bg: 'bg-[#21262D] text-[#C7ED3D]' },
    { name: 'Sai Likitha', email: 'sai.likitha@gmail.com', avatar: 'S', bg: 'bg-[#21262D] text-[#F778BA]' },
    { name: 'ML Researcher', email: 'researcher@gmail.com', avatar: 'M', bg: 'bg-[#21262D] text-[#58A6FF]' }
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
      if (res.code) {
        setReceivedOtp(res.code);
        setOtpCode(res.code);
      }
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0D1117]/85 backdrop-blur-md animate-fadeIn">
      <div 
        className="relative w-full max-w-md bg-[#161B22] rounded-2xl p-6 sm:p-8 border border-[#30363D] shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Hidden reCAPTCHA container for Firebase Phone SMS OTP */}
        <div id="recaptcha-container"></div>

        {/* Decorative Background Glows */}
        <div className="absolute -top-24 -left-24 w-48 h-48 bg-[#C7ED3D]/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-[#3FB950]/10 rounded-full blur-3xl pointer-events-none"></div>

        {/* Close Button */}
        <button
          onClick={() => {
            if (showGoogleChooser) setShowGoogleChooser(false);
            else onClose();
          }}
          className="absolute top-5 right-5 p-2 rounded-xl text-[#8B949E] hover:text-[#F0F6FC] hover:bg-[#21262D] transition"
        >
          <X className="w-5 h-5" />
        </button>

        {showGoogleChooser ? (
          /* ── GOOGLE ACCOUNT CHOOSER SCREEN ── */
          <div className="animate-fadeIn">
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-[#0D1117] border border-[#30363D] p-2.5 mb-3 shadow-md">
                <Chrome className="w-7 h-7 text-[#C7ED3D]" />
              </div>
              <h2 className="text-2xl font-extrabold text-[#F0F6FC] font-['Outfit']">
                Choose a Google Account
              </h2>
              <p className="text-xs text-[#8B949E] mt-1">
                Select an account to sign in to NameLens AI
              </p>
            </div>

            {/* Error Alert inside Google Chooser */}
            {error && (
              <div className="mb-4 p-3 rounded-xl bg-[#F85149]/10 border border-[#F85149]/30 text-[#F85149] text-xs flex items-center space-x-2">
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
                  className="w-full flex items-center justify-between p-3.5 rounded-xl bg-[#0D1117] border border-[#30363D] hover:border-[#C7ED3D] transition group text-left"
                >
                  <div className="flex items-center space-x-3">
                    <div className={`w-10 h-10 rounded-xl ${acc.bg} flex items-center justify-center text-sm font-bold border border-[#30363D]`}>
                      {acc.avatar}
                    </div>
                    <div>
                      <div className="text-sm font-bold text-[#F0F6FC] group-hover:text-[#C7ED3D] transition">{acc.name}</div>
                      <div className="text-xs text-[#8B949E] font-mono">{acc.email}</div>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-[#8B949E] group-hover:text-[#C7ED3D] transition transform group-hover:translate-x-1" />
                </button>
              ))}

              {/* Custom Google Account Entry Option */}
              {!isCustomGoogleAccount ? (
                <button
                  type="button"
                  onClick={() => setIsCustomGoogleAccount(true)}
                  className="w-full py-3 px-4 rounded-xl border border-dashed border-[#30363D] hover:border-[#C7ED3D] text-xs font-semibold text-[#C7ED3D] transition flex items-center justify-center space-x-2"
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
                  className="p-4 rounded-xl bg-[#0D1117] border border-[#30363D] space-y-3"
                >
                  <div className="text-xs font-bold text-[#F0F6FC]">Enter Google Account Details</div>
                  <div>
                    <input
                      type="text"
                      placeholder="Your Name (e.g. Alex Smith)"
                      value={customGoogleInput.name}
                      onChange={(e) => setCustomGoogleInput({ ...customGoogleInput, name: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-xl bg-[#161B22] border border-[#30363D] text-xs text-[#F0F6FC] placeholder-[#8B949E] focus:outline-none focus:border-[#C7ED3D]"
                    />
                  </div>
                  <div>
                    <input
                      type="email"
                      required
                      placeholder="alex@gmail.com"
                      value={customGoogleInput.email}
                      onChange={(e) => setCustomGoogleInput({ ...customGoogleInput, email: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-xl bg-[#161B22] border border-[#30363D] text-xs text-[#F0F6FC] placeholder-[#8B949E] focus:outline-none focus:border-[#C7ED3D]"
                    />
                  </div>
                  <div className="flex space-x-2 pt-1">
                    <button
                      type="button"
                      onClick={() => setIsCustomGoogleAccount(false)}
                      className="flex-1 py-2 rounded-xl bg-[#21262D] text-xs font-semibold text-[#8B949E] hover:text-[#F0F6FC]"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className="flex-1 py-2 rounded-xl bg-[#C7ED3D] hover:bg-[#D4F455] text-[#0D1117] text-xs font-bold shadow-md"
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
              className="w-full py-2.5 rounded-xl bg-[#0D1117] border border-[#30363D] text-xs font-semibold text-[#8B949E] hover:text-[#F0F6FC] transition"
            >
              ← Back to standard Sign In
            </button>
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-[#0D1117] border border-[#30363D] p-2 mb-3 shadow-md">
                <Sparkles className="w-6 h-6 text-[#C7ED3D]" />
              </div>
              <h2 className="text-2xl font-extrabold text-[#F0F6FC] font-['Outfit']">
                {isLogin ? 'Welcome Back to NameLens' : 'Register with OTP Verification'}
              </h2>
              <p className="text-xs text-[#8B949E] mt-1">
                {isLogin 
                  ? 'Access spatial name analytics, custom datasets & batch AI' 
                  : 'Create an account with OTP passcode validation'}
              </p>
            </div>

            {/* Tab Selector: Sign In vs Register */}
            <div className="flex bg-[#0D1117] p-1 rounded-xl border border-[#30363D] mb-6">
              <button
                type="button"
                onClick={() => { setIsLogin(true); setError(''); setRegStep(1); }}
                className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center space-x-2 ${
                  isLogin ? 'bg-[#21262D] text-[#C7ED3D] border border-[#C7ED3D]/50 shadow-sm' : 'text-[#8B949E] hover:text-[#F0F6FC]'
                }`}
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Sign In</span>
              </button>
              <button
                type="button"
                onClick={() => { setIsLogin(false); setError(''); setRegStep(1); }}
                className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center space-x-2 ${
                  !isLogin ? 'bg-[#21262D] text-[#C7ED3D] border border-[#C7ED3D]/50 shadow-sm' : 'text-[#8B949E] hover:text-[#F0F6FC]'
                }`}
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>Register</span>
              </button>
            </div>

            {/* Error Alert */}
            {error && (
              <div className="mb-4 p-3 rounded-xl bg-[#F85149]/10 border border-[#F85149]/30 text-[#F85149] text-xs flex items-center space-x-2">
                <span className="font-bold">•</span>
                <span>{error}</span>
              </div>
            )}

            {/* OTP Success Notice */}
            {otpNotice && !isLogin && regStep === 2 && (
              <div className="mb-4 p-3 rounded-xl bg-[#3FB950]/10 border border-[#3FB950]/30 text-[#3FB950] text-xs flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-[#3FB950] shrink-0" />
                <span>{otpNotice}</span>
              </div>
            )}

            {/* ── OPTION A: SIGN IN FORM ── */}
            {isLogin && (
              <form onSubmit={handleSignIn} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-[#8B949E] mb-1.5 uppercase tracking-wider">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-3 w-4 h-4 text-[#8B949E]" />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="researcher@namelens.ai"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#0D1117] border border-[#30363D] text-sm text-[#F0F6FC] placeholder-[#8B949E] focus:outline-none focus:border-[#C7ED3D]"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <label className="text-xs font-semibold text-[#8B949E] uppercase tracking-wider">Password</label>
                    <button type="button" onClick={handleFillDemo} className="text-[11px] text-[#C7ED3D] hover:text-[#D4F455] transition font-medium">
                      Auto-fill Demo Credentials
                    </button>
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-3 w-4 h-4 text-[#8B949E]" />
                    <input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      placeholder="••••••••••••"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#0D1117] border border-[#30363D] text-sm text-[#F0F6FC] placeholder-[#8B949E] focus:outline-none focus:border-[#C7ED3D]"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 rounded-xl bg-[#C7ED3D] hover:bg-[#D4F455] text-[#0D1117] font-extrabold text-sm shadow-lg shadow-[#C7ED3D]/25 transition flex items-center justify-center space-x-2"
                >
                  {loading ? (
                    <RefreshCw className="w-4 h-4 animate-spin text-[#0D1117]" />
                  ) : (
                    <>
                      <span>Sign In to Dashboard</span>
                      <ArrowRight className="w-4 h-4 text-[#0D1117]" />
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
                      <label className="block text-xs font-semibold text-[#8B949E] mb-1.5 uppercase tracking-wider">Full Name</label>
                      <div className="relative">
                        <User className="absolute left-3.5 top-3 w-4 h-4 text-[#8B949E]" />
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          placeholder="Alex Rivers"
                          className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#0D1117] border border-[#30363D] text-sm text-[#F0F6FC] placeholder-[#8B949E] focus:outline-none focus:border-[#C7ED3D]"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-[#8B949E] mb-1.5 uppercase tracking-wider">Email Address / Phone</label>
                      <div className="relative">
                        <Mail className="absolute left-3.5 top-3 w-4 h-4 text-[#8B949E]" />
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          placeholder="researcher@namelens.ai"
                          className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#0D1117] border border-[#30363D] text-sm text-[#F0F6FC] placeholder-[#8B949E] focus:outline-none focus:border-[#C7ED3D]"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-[#8B949E] mb-1.5 uppercase tracking-wider">Create Password</label>
                      <div className="relative">
                        <Lock className="absolute left-3.5 top-3 w-4 h-4 text-[#8B949E]" />
                        <input
                          type="password"
                          name="password"
                          value={formData.password}
                          onChange={handleInputChange}
                          placeholder="••••••••••••"
                          className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#0D1117] border border-[#30363D] text-sm text-[#F0F6FC] placeholder-[#8B949E] focus:outline-none focus:border-[#C7ED3D]"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full py-3 rounded-xl bg-[#C7ED3D] hover:bg-[#D4F455] text-[#0D1117] font-extrabold text-sm shadow-lg shadow-[#C7ED3D]/25 transition flex items-center justify-center space-x-2"
                    >
                      {loading ? (
                        <RefreshCw className="w-4 h-4 animate-spin text-[#0D1117]" />
                      ) : (
                        <>
                          <span>Send OTP Passcode to Register</span>
                          <PhoneCall className="w-4 h-4 text-[#0D1117]" />
                        </>
                      )}
                    </button>
                  </form>
                ) : (
                  /* Step 2: Enter 6-digit OTP verification code right inside registration */
                  <form onSubmit={handleVerifyOtpAndRegister} className="space-y-4">
                    {/* Active OTP Passcode Notification Banner */}
                    {receivedOtp && (
                      <div className="p-3.5 rounded-xl bg-[#0D1117] border border-[#30363D] shadow-lg space-y-2 animate-fadeIn">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2 text-[#C7ED3D] font-bold text-xs">
                            <KeyRound className="w-4 h-4 text-[#C7ED3D]" />
                            <span>Verification Passcode Generated</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => setOtpCode(receivedOtp)}
                            className="px-2.5 py-1 rounded-lg bg-[#21262D] hover:bg-[#30363D] text-[#C7ED3D] border border-[#30363D] text-[11px] font-bold shadow-md transition flex items-center space-x-1"
                          >
                            <span>Auto-Fill Code</span>
                          </button>
                        </div>
                        <div className="flex items-center justify-between bg-[#161B22] px-3.5 py-2 rounded-xl border border-[#30363D]">
                          <span className="text-xs text-[#8B949E] font-medium">Your 6-Digit Code:</span>
                          <span className="text-xl font-mono font-extrabold tracking-widest text-[#C7ED3D]">{receivedOtp}</span>
                        </div>
                      </div>
                    )}

                    <div>
                      <div className="flex justify-between items-center mb-1.5">
                        <label className="text-xs font-semibold text-[#8B949E]">
                          OTP Sent to <span className="text-[#C7ED3D]">{formData.email}</span>
                        </label>
                        <button 
                          type="button" 
                          onClick={() => setRegStep(1)} 
                          className="text-[11px] text-[#C7ED3D] hover:text-[#D4F455] transition flex items-center space-x-1"
                        >
                          <RefreshCw className="w-3 h-3" />
                          <span>Edit Info</span>
                        </button>
                      </div>
                      <div className="relative">
                        <KeyRound className="absolute left-3.5 top-3 w-4 h-4 text-[#8B949E]" />
                        <input
                          type="text"
                          maxLength={6}
                          value={otpCode}
                          onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
                          placeholder="123456"
                          className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#0D1117] border border-[#30363D] text-lg font-bold tracking-widest text-[#C7ED3D] placeholder-[#8B949E] focus:outline-none focus:border-[#C7ED3D] text-center"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full py-3 rounded-xl bg-[#C7ED3D] hover:bg-[#D4F455] text-[#0D1117] font-extrabold text-sm shadow-lg shadow-[#C7ED3D]/25 transition flex items-center justify-center space-x-2"
                    >
                      {loading ? (
                        <RefreshCw className="w-4 h-4 animate-spin text-[#0D1117]" />
                      ) : (
                        <>
                          <span>Verify OTP & Create Account</span>
                          <ShieldCheck className="w-4 h-4 text-[#0D1117]" />
                        </>
                      )}
                    </button>
                  </form>
                )}
              </>
            )}

            {/* Divider */}
            <div className="relative my-5 flex items-center justify-center">
              <div className="border-t border-[#30363D] w-full"></div>
              <span className="bg-[#161B22] px-3 text-[11px] text-[#8B949E] font-medium tracking-wider uppercase">Or Continue With</span>
            </div>

            {/* Quick Social & Guest Buttons */}
            <div className="grid grid-cols-2 gap-3 mb-4">
              <button
                type="button"
                onClick={handleGoogleAuth}
                disabled={loading}
                className="flex items-center justify-center space-x-2 py-2.5 rounded-xl bg-[#0D1117] text-xs font-semibold text-[#F0F6FC] hover:text-[#C7ED3D] transition border border-[#30363D] hover:border-[#C7ED3D]"
              >
                <Chrome className="w-4 h-4 text-[#C7ED3D]" />
                <span>Google Sign-In</span>
              </button>

              <button
                type="button"
                onClick={handleGuestPass}
                disabled={loading}
                className="flex items-center justify-center space-x-2 py-2.5 rounded-xl bg-[#0D1117] text-xs font-semibold text-[#F0F6FC] hover:text-[#3FB950] transition border border-[#30363D] hover:border-[#3FB950]"
              >
                <ShieldCheck className="w-4 h-4 text-[#3FB950]" />
                <span>Guest Pass</span>
              </button>
            </div>

            {/* Footnote */}
            <p className="text-[11px] text-center text-[#8B949E]">
              Registrations require 6-digit OTP verification and save to database.
            </p>
          </>
        )}
      </div>
    </div>
  );
}
