import React, { useState } from 'react';
import { UserRole } from '../types';
import { Landmark, Shield, Lock, User, KeyRound, Sparkles, CheckCircle2 } from 'lucide-react';

interface LoginPageProps {
  onLogin: (role: UserRole, username: string) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const [role, setRole] = useState<UserRole>('System Administrator');
  const [username, setUsername] = useState('admin@nexora.io');
  const [password, setPassword] = useState('••••••••••••');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin(role, username || 'admin@nexora.io');
  };

  const handleDemoLogin = (selectedRole: UserRole) => {
    setRole(selectedRole);
    let demoUser = 'admin@nexora.io';
    if (selectedRole === 'Project Authority') demoUser = 'director@nexora.io';
    if (selectedRole === 'Landowner') demoUser = 'stakeholder@nexora.io';
    setUsername(demoUser);
    onLogin(selectedRole, demoUser);
  };

  return (
    <div className="min-h-screen bg-[#f5f3ec] flex flex-col justify-between">
      {/* Top Header Bar */}
      <header className="bg-[#161c18] text-stone-100 border-b border-[#263329] text-xs">
        <div className="max-w-7xl mx-auto px-4 py-2.5 flex items-center justify-between">
          <div className="flex items-center space-x-2 font-medium">
            <span className="w-2 h-2 rounded-full bg-amber-400 inline-block"></span>
            <span className="font-bold text-white tracking-wider">NEXORA PLATFORM</span>
            <span className="text-stone-500">|</span>
            <span className="text-amber-300 font-normal">🚜 CIVIL CONTRACTORS &amp; 🌾 FARMER LAND INTELLIGENCE</span>
          </div>
          <div className="text-amber-400/90 font-mono text-[11px]">
            CADASTRAL &amp; RIGHT-OF-WAY GATEWAY
          </div>
        </div>
      </header>

      {/* Main Login Card */}
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white border border-stone-300 shadow-lg">
          {/* Card Top Banner */}
          <div className="bg-[#18201a] text-white p-6 border-b-4 border-amber-500 text-center">
            <div className="w-12 h-12 bg-amber-500 text-stone-950 mx-auto flex items-center justify-center rounded-xs mb-3 shadow-xs">
              <Landmark className="w-7 h-7 text-stone-950" />
            </div>
            <h1 className="text-2xl font-serif font-bold tracking-tight text-white">
              NEXORA
            </h1>
            <p className="text-xs font-semibold text-amber-400 uppercase tracking-widest mt-0.5">
              Civil Right-of-Way &amp; Farmer Land Portal
            </p>
            <p className="text-xs text-stone-300 mt-2 max-w-xs mx-auto leading-relaxed">
              Early Delay Detection &amp; Consensus Support for Constructors, Surveyors and Farming Communities
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
            {/* Role Selection */}
            <div>
              <label className="block font-bold text-stone-800 uppercase tracking-wide mb-1">
                Select Your Perspective:
              </label>
              <div className="grid grid-cols-3 gap-1.5 p-1 bg-stone-100 border border-stone-200">
                {(['System Administrator', 'Project Authority', 'Landowner'] as UserRole[]).map(r => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => {
                      setRole(r);
                      if (r === 'System Administrator') setUsername('admin@nexora.io');
                      else if (r === 'Project Authority') setUsername('director@nexora.io');
                      else setUsername('stakeholder@nexora.io');
                    }}
                    className={`p-1.5 text-center text-[11px] font-semibold transition ${
                      role === r
                        ? 'bg-amber-500 text-stone-950 font-bold shadow-xs'
                        : 'text-stone-700 hover:bg-stone-200'
                    }`}
                  >
                    {r === 'System Administrator' ? '🏛️ Admin' : r === 'Project Authority' ? '🚜 Constructor' : '🌾 Farmer'}
                  </button>
                ))}
              </div>
            </div>

            {/* Username */}
            <div>
              <label className="block font-semibold text-stone-700 mb-1">
                Authorized Identifier / Email / 7-12 Survey ID:
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-2.5 flex items-center text-stone-400">
                  <User className="w-4 h-4 text-amber-600" />
                </span>
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full pl-8 pr-3 py-2 bg-white border border-stone-300 text-stone-900 rounded-xs focus:ring-1 focus:ring-amber-500 focus:outline-none font-sans"
                  placeholder="name@contractor.com or survey-number"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block font-semibold text-stone-700 mb-1">
                Security Password / Token / OTP:
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-2.5 flex items-center text-stone-400">
                  <Lock className="w-4 h-4 text-amber-600" />
                </span>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-8 pr-3 py-2 bg-white border border-stone-300 text-stone-900 rounded-xs focus:ring-1 focus:ring-amber-500 focus:outline-none font-sans"
                  placeholder="Enter authorized access credentials"
                />
              </div>
            </div>

            {/* Security Notice */}
            <div className="p-2.5 bg-amber-50/60 border border-amber-200 text-[11px] text-stone-700 flex items-start space-x-2">
              <Shield className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
              <span>
                Verified gateway for EPC contractors, survey patwaris, district SLAO collectors, and titleholding landowners.
              </span>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              id="btn-login-submit"
              className="w-full py-2.5 px-4 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs uppercase tracking-wider rounded-xs shadow-xs transition"
            >
              Enter {role} Portal
            </button>

            {/* Instant Demo Quick-Access */}
            <div className="pt-4 border-t border-stone-200">
              <div className="text-center font-bold text-[11px] text-stone-500 uppercase tracking-wider mb-2">
                One-Click Role Evaluation
              </div>
              <div className="space-y-1.5">
                <button
                  type="button"
                  onClick={() => handleDemoLogin('System Administrator')}
                  className="w-full py-1.5 px-3 bg-[#18201a] hover:bg-stone-800 text-amber-300 border border-amber-500/40 font-bold text-xs rounded-xs flex items-center justify-between transition shadow-xs"
                >
                  <span className="flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    <span>Demo: System Administrator &amp; Full Cadastre</span>
                  </span>
                  <span className="text-[10px] uppercase font-mono text-amber-400">Launch →</span>
                </button>

                <div className="grid grid-cols-2 gap-1.5">
                  <button
                    type="button"
                    onClick={() => handleDemoLogin('Project Authority')}
                    className="py-1.5 px-2 bg-amber-100/70 hover:bg-amber-200/80 text-amber-950 font-semibold text-[11px] border border-amber-300 text-center flex items-center justify-center gap-1"
                  >
                    <span>🚜</span>
                    <span>EPC Constructor</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDemoLogin('Landowner')}
                    className="py-1.5 px-2 bg-emerald-100/70 hover:bg-emerald-200/80 text-emerald-950 font-semibold text-[11px] border border-emerald-300 text-center flex items-center justify-center gap-1"
                  >
                    <span>🌾</span>
                    <span>Farmer &amp; Landowner</span>
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-[#161c18] text-stone-400 text-xs py-3 border-t border-[#263329] text-center">
        <div className="max-w-7xl mx-auto px-4">
          NEXORA Infrastructure Intelligence • Precision Right-of-Way Support for Constructors &amp; Farmers
        </div>
      </footer>
    </div>
  );
};
