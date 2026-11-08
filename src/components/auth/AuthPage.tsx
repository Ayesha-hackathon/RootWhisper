/**
 * RootWhisper Professional Eco-Tech Botanical Authentication View.
 * Immersive full-screen leafy wallpaper background with frosted-glass panel.
 * Provides real human user login, registration, password validation, and password recovery.
 */

import React, { useState, useEffect } from 'react';
import { Eye, EyeOff, Lock, Mail, User, CheckCircle2, AlertCircle, ArrowRight, KeyRound, Sprout, ShieldCheck, Activity } from 'lucide-react';
import { authApi, AuthUser } from '../../services/authApi';
import botanicalWallpaper from '../../assets/images/botanical_wallpaper.jpg';

interface AuthPageProps {
  onAuthSuccess: (user: AuthUser) => void;
}

type AuthMode = 'login' | 'register' | 'forgot' | 'reset';

export const AuthPage: React.FC<AuthPageProps> = ({ onAuthSuccess }) => {
  const [mode, setMode] = useState<AuthMode>('login');
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [resetToken, setResetToken] = useState('');
  const [tokenValidating, setTokenValidating] = useState(false);
  const [isTokenValid, setIsTokenValid] = useState<boolean | null>(null);
  const [maskedEmail, setMaskedEmail] = useState<string | null>(null);
  const [resetCompleted, setResetCompleted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Automatically detect and validate recovery token from URL parameters
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const tokenFromUrl = params.get('token') || params.get('reset_token');

    if (tokenFromUrl) {
      setResetToken(tokenFromUrl);
      setMode('reset');
      setTokenValidating(true);
      setError(null);
      setSuccessMsg(null);

      authApi
        .verifyResetToken(tokenFromUrl)
        .then((res) => {
          setIsTokenValid(true);
          if (res.user_email_masked) {
            setMaskedEmail(res.user_email_masked);
          }
        })
        .catch((err) => {
          setIsTokenValid(false);
          setError(err.message || 'This password reset link is invalid, expired, or has already been used.');
        })
        .finally(() => {
          setTokenValidating(false);
        });
    }
  }, []);

  // Password strength criteria
  const hasMinLength = password.length >= 8;
  const hasUpper = /[A-Z]/.test(password);
  const hasLower = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);
  const isPasswordValid = hasMinLength && hasUpper && hasLower && hasNumber && hasSpecial;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await authApi.login(email, password, rememberMe);
      onAuthSuccess(res.user);
    } catch (err: any) {
      setError(err.message || 'Login failed. Please verify your email and password.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!isPasswordValid) {
      setError('Please satisfy all password security requirements.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    try {
      const res = await authApi.register(fullName, email, password, confirmPassword);
      onAuthSuccess(res.user);
    } catch (err: any) {
      setError(err.message || 'Registration failed. Email address may already be registered.');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);
    setLoading(true);
    try {
      const res = await authApi.forgotPassword(email);
      setSuccessMsg(res.message);
      setEmail('');
    } catch (err: any) {
      setError(err.message || 'Unable to process password reset request.');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);

    if (!isPasswordValid) {
      setError('New password must satisfy all security rules.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    try {
      const res = await authApi.resetPassword(resetToken, password, confirmPassword);
      setResetCompleted(true);
      setSuccessMsg(res.message);
      setPassword('');
      setConfirmPassword('');
      // Clean recovery token from browser URL address bar
      window.history.replaceState({}, document.title, window.location.pathname);
    } catch (err: any) {
      setError(err.message || 'Password reset failed. Token may be invalid or expired.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen w-full relative flex items-center justify-center lg:justify-end p-4 sm:p-6 lg:p-10 xl:pr-24 overflow-x-hidden bg-[#0A1A14]"
      style={{
        backgroundImage: `url(${botanicalWallpaper})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      {/* Subtle atmospheric vignette overlay to protect text readability while keeping lush leaf edges visible */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/45 via-[#071912]/25 to-black/40 pointer-events-none" />
      <div className="absolute inset-0 bg-radial from-transparent via-transparent to-black/35 pointer-events-none" />

      {/* Main Content Grid: Hero Narrative on Desktop + Frosted Glass Form on Centre-Right */}
      <div className="w-full max-w-6xl relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        
        {/* Left Side: Editorial Botanical Identity (Visible on Large Screens) */}
        <div className="hidden lg:flex lg:col-span-6 xl:col-span-7 flex-col justify-center space-y-6 text-white drop-shadow-md pr-4">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#123B36]/80 backdrop-blur-md border border-[#55B6A3]/40 text-[#DDF0E1] text-xs font-mono w-fit shadow-lg">
            <span className="w-2 h-2 rounded-full bg-[#55B6A3] animate-pulse" />
            <span>AI Canopy Microclimate Screening · v2.4</span>
          </div>

          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-[#173F32]/90 border border-[#55B6A3]/40 flex items-center justify-center shadow-inner">
                <Sprout className="w-6 h-6 text-[#A8C3A0]" />
              </div>
              <h1 className="text-3xl xl:text-4xl font-bold tracking-tight text-white font-sans">
                RootWhisper
              </h1>
            </div>
            <p className="text-base xl:text-lg text-[#DDF0E1]/90 font-light max-w-lg leading-relaxed mt-2">
              Species-aware plant water-stress screening powered by contactless radiometric IR thermography and multi-node physiological intelligence.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-3 max-w-lg pt-2">
            <div className="p-3 rounded-xl bg-[#0F2A22]/70 backdrop-blur-md border border-white/10">
              <p className="text-[10px] text-[#A8C3A0] uppercase font-mono">Specimen 01</p>
              <p className="text-xs font-semibold text-white mt-0.5">Tulsi</p>
              <p className="text-[10px] text-[#DDF0E1]/70 italic mt-0.5">O. tenuiflorum</p>
            </div>
            <div className="p-3 rounded-xl bg-[#0F2A22]/70 backdrop-blur-md border border-white/10">
              <p className="text-[10px] text-[#A8C3A0] uppercase font-mono">Specimen 02</p>
              <p className="text-xs font-semibold text-white mt-0.5">Hibiscus</p>
              <p className="text-[10px] text-[#DDF0E1]/70 italic mt-0.5">H. rosa-sinensis</p>
            </div>
            <div className="p-3 rounded-xl bg-[#0F2A22]/70 backdrop-blur-md border border-white/10">
              <p className="text-[10px] text-[#A8C3A0] uppercase font-mono">Specimen 03</p>
              <p className="text-xs font-semibold text-white mt-0.5">Money Plant</p>
              <p className="text-[10px] text-[#DDF0E1]/70 italic mt-0.5">E. aureum</p>
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs text-[#DDF0E1]/75 pt-1">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-[#55B6A3]" />
              Argon2id Session Security
            </span>
            <span className="text-white/30">·</span>
            <span className="flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 text-[#55B6A3]" />
              Live Telemetry Processing
            </span>
          </div>
        </div>

        {/* Right Side: Semi-Transparent Frosted-Glass Login Panel */}
        <div className="lg:col-span-6 xl:col-span-5 w-full flex justify-center lg:justify-end">
          <div className="w-full max-w-md bg-[#0D241C]/85 backdrop-blur-xl rounded-2xl border border-white/20 shadow-[0_25px_60px_rgba(0,0,0,0.55)] p-6 sm:p-8 text-white relative transition-all duration-300">
            
            {/* Top Brand Pill & Welcome Header */}
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-[#173F32] border border-[#55B6A3]/40 mb-3 shadow-lg shadow-[#087E75]/20">
                <Sprout className="w-6 h-6 text-[#A8C3A0]" />
              </div>
              <h2 className="text-2xl font-bold tracking-tight text-white">
                {mode === 'login' && 'Welcome to RootWhisper'}
                {mode === 'register' && 'Create Account'}
                {mode === 'forgot' && 'Reset Password'}
                {mode === 'reset' && 'Set New Password'}
              </h2>
              <p className="text-xs text-[#DDF0E1]/80 mt-1 font-normal">
                {mode === 'login' && 'Sign in to access your multi-node screening station'}
                {mode === 'register' && 'Register to manage plant monitoring nodes and AI baselines'}
                {mode === 'forgot' && 'Enter your registered email to receive recovery instructions'}
                {mode === 'reset' && (maskedEmail ? `Set a new secure password for ${maskedEmail}` : 'Set a new secure password for your account')}
              </p>
            </div>

            {/* Error Notification */}
            {error && (
              <div className="mb-4 p-3.5 rounded-xl bg-[#C95D58]/20 border border-[#C95D58]/50 flex items-start gap-2.5 text-xs text-[#FFD6D3] backdrop-blur-sm animate-fadeIn">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-[#FFA8A3]" />
                <span className="leading-relaxed font-medium">{error}</span>
              </div>
            )}

            {/* Success Notification */}
            {successMsg && (
              <div className="mb-4 p-3.5 rounded-xl bg-[#087E75]/30 border border-[#55B6A3]/60 flex items-start gap-2.5 text-xs text-[#DDF0E1] backdrop-blur-sm animate-fadeIn">
                <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-[#55B6A3]" />
                <span className="leading-relaxed font-medium">{successMsg}</span>
              </div>
            )}

            {/* 1. LOGIN FORM */}
            {mode === 'login' && (
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-white/95 mb-1.5 tracking-wide">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 absolute left-3.5 top-3 text-[#A8C3A0]/70" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="researcher@rootwhisper.org"
                      className="w-full pl-10 pr-3.5 py-2.5 text-xs bg-black/30 border border-white/20 rounded-xl focus:outline-none focus:border-[#55B6A3] focus:ring-2 focus:ring-[#55B6A3]/35 text-white placeholder-white/40 transition-all"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-semibold text-white/95 tracking-wide">
                      Password
                    </label>
                    <button
                      type="button"
                      onClick={() => {
                        setError(null);
                        setSuccessMsg(null);
                        setMode('forgot');
                      }}
                      className="text-[11px] font-medium text-[#55B6A3] hover:text-white hover:underline cursor-pointer transition-colors"
                    >
                      Forgot password?
                    </button>
                  </div>
                  <div className="relative">
                    <Lock className="w-4 h-4 absolute left-3.5 top-3 text-[#A8C3A0]/70" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••••••"
                      className="w-full pl-10 pr-10 py-2.5 text-xs bg-black/30 border border-white/20 rounded-xl focus:outline-none focus:border-[#55B6A3] focus:ring-2 focus:ring-[#55B6A3]/35 text-white placeholder-white/40 transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-3 text-[#A8C3A0]/80 hover:text-white cursor-pointer transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="w-3.5 h-3.5 rounded text-[#087E75] focus:ring-[#55B6A3] bg-black/40 border-white/25 cursor-pointer"
                    />
                    <span className="text-xs text-white/90">Remember me</span>
                  </label>
                </div>

                {/* Eco Teal Primary Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-[#087E75] to-[#125A50] hover:from-[#0A968B] hover:to-[#176F64] text-white text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg shadow-[#087E75]/30 border border-[#55B6A3]/40 active:scale-[0.99] disabled:opacity-50"
                >
                  {loading ? 'Authenticating...' : 'Sign In'}
                  {!loading && <ArrowRight className="w-3.5 h-3.5" />}
                </button>

                <div className="text-center pt-3 border-t border-white/10">
                  <p className="text-xs text-white/75">
                    Don&apos;t have an account?{' '}
                    <button
                      type="button"
                      onClick={() => {
                        setError(null);
                        setSuccessMsg(null);
                        setMode('register');
                      }}
                      className="font-semibold text-[#55B6A3] hover:text-white hover:underline cursor-pointer transition-colors"
                    >
                      Create Account
                    </button>
                  </p>
                </div>
              </form>
            )}

            {/* 2. REGISTER FORM */}
            {mode === 'register' && (
              <form onSubmit={handleRegister} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-white/95 mb-1.5 tracking-wide">
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 absolute left-3.5 top-3 text-[#A8C3A0]/70" />
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Dr. Eleanor Vance"
                      className="w-full pl-10 pr-3.5 py-2.5 text-xs bg-black/30 border border-white/20 rounded-xl focus:outline-none focus:border-[#55B6A3] focus:ring-2 focus:ring-[#55B6A3]/35 text-white placeholder-white/40 transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-white/95 mb-1.5 tracking-wide">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 absolute left-3.5 top-3 text-[#A8C3A0]/70" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="researcher@rootwhisper.org"
                      className="w-full pl-10 pr-3.5 py-2.5 text-xs bg-black/30 border border-white/20 rounded-xl focus:outline-none focus:border-[#55B6A3] focus:ring-2 focus:ring-[#55B6A3]/35 text-white placeholder-white/40 transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-white/95 mb-1.5 tracking-wide">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 absolute left-3.5 top-3 text-[#A8C3A0]/70" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••••••"
                      className="w-full pl-10 pr-10 py-2.5 text-xs bg-black/30 border border-white/20 rounded-xl focus:outline-none focus:border-[#55B6A3] focus:ring-2 focus:ring-[#55B6A3]/35 text-white placeholder-white/40 transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-3 text-[#A8C3A0]/80 hover:text-white cursor-pointer transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>

                  {/* Password Strength Indicator */}
                  <div className="mt-2.5 p-2.5 rounded-xl bg-black/40 border border-white/10 space-y-1 text-[10px]">
                    <p className="font-semibold text-white/90 mb-1">Password Requirements:</p>
                    <div className="grid grid-cols-2 gap-1 text-white/60">
                      <span className={hasMinLength ? 'text-[#55B6A3] font-semibold' : ''}>
                        {hasMinLength ? '✓' : '○'} 8+ characters
                      </span>
                      <span className={hasUpper ? 'text-[#55B6A3] font-semibold' : ''}>
                        {hasUpper ? '✓' : '○'} Uppercase letter
                      </span>
                      <span className={hasLower ? 'text-[#55B6A3] font-semibold' : ''}>
                        {hasLower ? '✓' : '○'} Lowercase letter
                      </span>
                      <span className={hasNumber ? 'text-[#55B6A3] font-semibold' : ''}>
                        {hasNumber ? '✓' : '○'} Digit
                      </span>
                      <span className={`col-span-2 ${hasSpecial ? 'text-[#55B6A3] font-semibold' : ''}`}>
                        {hasSpecial ? '✓' : '○'} Special character (!@#$%^&*)
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-white/95 mb-1.5 tracking-wide">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 absolute left-3.5 top-3 text-[#A8C3A0]/70" />
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••••••"
                      className="w-full pl-10 pr-10 py-2.5 text-xs bg-black/30 border border-white/20 rounded-xl focus:outline-none focus:border-[#55B6A3] focus:ring-2 focus:ring-[#55B6A3]/35 text-white placeholder-white/40 transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3.5 top-3 text-[#A8C3A0]/80 hover:text-white cursor-pointer transition-colors"
                    >
                      {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading || !isPasswordValid}
                  className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-[#087E75] to-[#125A50] hover:from-[#0A968B] hover:to-[#176F64] text-white text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg shadow-[#087E75]/30 border border-[#55B6A3]/40 active:scale-[0.99] disabled:opacity-50"
                >
                  {loading ? 'Creating Account...' : 'Create Account'}
                  {!loading && <ArrowRight className="w-3.5 h-3.5" />}
                </button>

                <div className="text-center pt-3 border-t border-white/10">
                  <p className="text-xs text-white/75">
                    Already have an account?{' '}
                    <button
                      type="button"
                      onClick={() => {
                        setError(null);
                        setSuccessMsg(null);
                        setMode('login');
                      }}
                      className="font-semibold text-[#55B6A3] hover:text-white hover:underline cursor-pointer transition-colors"
                    >
                      Sign In
                    </button>
                  </p>
                </div>
              </form>
            )}

            {/* 3. FORGOT PASSWORD FORM */}
            {mode === 'forgot' && (
              <form onSubmit={handleForgotPassword} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-white/95 mb-1.5 tracking-wide">
                    Registered Email Address
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 absolute left-3.5 top-3 text-[#A8C3A0]/70" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="researcher@rootwhisper.org"
                      className="w-full pl-10 pr-3.5 py-2.5 text-xs bg-black/30 border border-white/20 rounded-xl focus:outline-none focus:border-[#55B6A3] focus:ring-2 focus:ring-[#55B6A3]/35 text-white placeholder-white/40 transition-all"
                    />
                  </div>
                  <p className="text-[11px] text-[#DDF0E1]/70 mt-1.5">
                    We will send a single-use password reset link via Gmail SMTP.
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-[#087E75] to-[#125A50] hover:from-[#0A968B] hover:to-[#176F64] text-white text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg shadow-[#087E75]/30 border border-[#55B6A3]/40 active:scale-[0.99] disabled:opacity-50"
                >
                  {loading ? 'Sending Reset Email...' : 'Send Recovery Instructions'}
                  {!loading && <KeyRound className="w-3.5 h-3.5" />}
                </button>

                <div className="text-center text-xs pt-3 border-t border-white/10">
                  <button
                    type="button"
                    onClick={() => {
                      setError(null);
                      setSuccessMsg(null);
                      setMode('login');
                    }}
                    className="font-medium text-[#55B6A3] hover:text-white hover:underline cursor-pointer transition-colors"
                  >
                    ← Back to Sign In
                  </button>
                </div>
              </form>
            )}

            {/* 4. RESET PASSWORD FORM */}
            {mode === 'reset' && (
              <div className="space-y-4">
                {tokenValidating ? (
                  <div className="py-8 text-center space-y-3">
                    <div className="w-9 h-9 border-2 border-[#55B6A3] border-t-transparent rounded-full animate-spin mx-auto" />
                    <p className="text-xs text-[#DDF0E1]/85 font-mono">
                      Validating security token with RootWhisper backend...
                    </p>
                  </div>
                ) : resetCompleted ? (
                  <div className="py-5 text-center space-y-4">
                    <div className="w-12 h-12 rounded-full bg-[#087E75]/30 border border-[#55B6A3] flex items-center justify-center mx-auto text-[#55B6A3] shadow-lg">
                      <CheckCircle2 className="w-7 h-7" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-white">Password Updated Successfully</h3>
                      <p className="text-xs text-[#DDF0E1]/80 mt-1 leading-relaxed">
                        Your account password has been updated. The recovery token has been invalidated.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setResetCompleted(false);
                        setIsTokenValid(null);
                        setError(null);
                        setSuccessMsg(null);
                        setMode('login');
                      }}
                      className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-[#087E75] to-[#125A50] hover:from-[#0A968B] hover:to-[#176F64] text-white text-xs font-semibold cursor-pointer shadow-lg transition-all"
                    >
                      Sign In With New Password
                    </button>
                  </div>
                ) : isTokenValid === false ? (
                  <div className="py-4 text-center space-y-4">
                    <div className="w-12 h-12 rounded-full bg-[#C95D58]/20 border border-[#C95D58]/50 flex items-center justify-center mx-auto text-[#FFA8A3]">
                      <AlertCircle className="w-7 h-7" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-white">Invalid or Expired Link</h3>
                      <p className="text-xs text-[#FFD6D3]/90 mt-1 leading-relaxed">
                        {error || 'This password reset link is invalid, expired, or has already been used.'}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setIsTokenValid(null);
                        setError(null);
                        setSuccessMsg(null);
                        setMode('forgot');
                      }}
                      className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-[#087E75] to-[#125A50] hover:from-[#0A968B] hover:to-[#176F64] text-white text-xs font-semibold cursor-pointer shadow-lg transition-all"
                    >
                      Request a New Recovery Link
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleResetPassword} className="space-y-4">
                    {/* User identifier badge if masked email is known */}
                    {maskedEmail && (
                      <div className="p-2.5 rounded-xl bg-white/10 border border-white/15 text-center">
                        <span className="text-[11px] text-[#A8C3A0] font-mono">
                          Account: {maskedEmail}
                        </span>
                      </div>
                    )}

                    {/* New Password */}
                    <div>
                      <label className="block text-xs font-semibold text-white/95 mb-1.5 tracking-wide">
                        New Password
                      </label>
                      <div className="relative">
                        <Lock className="w-4 h-4 absolute left-3.5 top-3 text-[#A8C3A0]/70" />
                        <input
                          type={showPassword ? 'text' : 'password'}
                          required
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="••••••••••••"
                          className="w-full pl-10 pr-10 py-2.5 text-xs bg-black/30 border border-white/20 rounded-xl focus:outline-none focus:border-[#55B6A3] focus:ring-2 focus:ring-[#55B6A3]/35 text-white placeholder-white/40 transition-all"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3.5 top-3 text-[#A8C3A0]/80 hover:text-white cursor-pointer transition-colors"
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>

                      {/* Password Requirements */}
                      <div className="mt-2.5 p-2.5 rounded-xl bg-black/40 border border-white/10 space-y-1 text-[10px]">
                        <p className="font-semibold text-white/90 mb-1">Password Requirements:</p>
                        <div className="grid grid-cols-2 gap-1 text-white/60">
                          <span className={hasMinLength ? 'text-[#55B6A3] font-semibold' : ''}>
                            {hasMinLength ? '✓' : '○'} 8+ characters
                          </span>
                          <span className={hasUpper ? 'text-[#55B6A3] font-semibold' : ''}>
                            {hasUpper ? '✓' : '○'} Uppercase letter
                          </span>
                          <span className={hasLower ? 'text-[#55B6A3] font-semibold' : ''}>
                            {hasLower ? '✓' : '○'} Lowercase letter
                          </span>
                          <span className={hasNumber ? 'text-[#55B6A3] font-semibold' : ''}>
                            {hasNumber ? '✓' : '○'} Digit
                          </span>
                          <span className={`col-span-2 ${hasSpecial ? 'text-[#55B6A3] font-semibold' : ''}`}>
                            {hasSpecial ? '✓' : '○'} Special character (!@#$%^&*)
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Confirm New Password */}
                    <div>
                      <label className="block text-xs font-semibold text-white/95 mb-1.5 tracking-wide">
                        Confirm New Password
                      </label>
                      <div className="relative">
                        <Lock className="w-4 h-4 absolute left-3.5 top-3 text-[#A8C3A0]/70" />
                        <input
                          type={showConfirmPassword ? 'text' : 'password'}
                          required
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          placeholder="••••••••••••"
                          className="w-full pl-10 pr-10 py-2.5 text-xs bg-black/30 border border-white/20 rounded-xl focus:outline-none focus:border-[#55B6A3] focus:ring-2 focus:ring-[#55B6A3]/35 text-white placeholder-white/40 transition-all"
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-3.5 top-3 text-[#A8C3A0]/80 hover:text-white cursor-pointer transition-colors"
                        >
                          {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={loading || !isPasswordValid}
                      className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-[#087E75] to-[#125A50] hover:from-[#0A968B] hover:to-[#176F64] text-white text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg shadow-[#087E75]/30 border border-[#55B6A3]/40 active:scale-[0.99] disabled:opacity-50"
                    >
                      {loading ? 'Updating Password...' : 'Save New Password'}
                      {!loading && <ArrowRight className="w-3.5 h-3.5" />}
                    </button>

                    <div className="text-center pt-3 border-t border-white/10">
                      <button
                        type="button"
                        onClick={() => {
                          setError(null);
                          setSuccessMsg(null);
                          setMode('login');
                        }}
                        className="text-xs font-medium text-[#55B6A3] hover:text-white hover:underline cursor-pointer transition-colors"
                      >
                        ← Back to Sign In
                      </button>
                    </div>
                  </form>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
