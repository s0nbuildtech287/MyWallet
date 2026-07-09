import React, { useState } from 'react';
import { Lock, User, Eye, EyeOff, Shield, Zap, BarChart3 } from 'lucide-react';
import logo from '../assets/logoooo.png';

export default function Login({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 800));

    if (username === 'xu4ns0n' && password === 'Sondeptrai123@k') {
      onLogin();
    } else {
      setError('Tên đăng nhập hoặc mật khẩu không chính xác.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center p-4 relative overflow-hidden">
      
      {/* Animated Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-20 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-emerald-500/5 to-teal-500/5 rounded-full blur-3xl" />
      </div>

      {/* Login Card */}
      <div className="relative z-10 w-full max-w-md">
        
        {/* Header Logo & Brand */}
        <div className="text-center mb-8 animate-fadeIn">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl shadow-2xl shadow-emerald-500/20 mb-4 overflow-hidden">
            <img src={logo} alt="MyWallet Hub" className="w-full h-full object-contain" />
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-400 via-teal-300 to-emerald-400 bg-clip-text text-transparent mb-2">
            MyWallet Hub
          </h1>
          <p className="text-sm text-slate-400">
            Nền tảng quản lý tài sản thông minh
          </p>
        </div>

        {/* Login Form Card */}
        <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-700/30 rounded-3xl shadow-2xl p-8 animate-slideUp">
          
          <h2 className="text-xl font-bold text-slate-100 mb-6 text-center">
            Đăng nhập vào tài khoản
          </h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            
            {/* Username Input */}
            <div className="space-y-2">
              <label htmlFor="username" className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Tên đăng nhập
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                <input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Nhập tên đăng nhập"
                  disabled={loading}
                  className="w-full bg-slate-950/60 border border-slate-700/30 focus:border-emerald-500/50 rounded-xl py-3 pl-10 pr-4 text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all disabled:opacity-60"
                  required
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="space-y-2">
              <label htmlFor="password" className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Mật khẩu
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Nhập mật khẩu"
                  disabled={loading}
                  className="w-full bg-slate-950/60 border border-slate-700/30 focus:border-emerald-500/50 rounded-xl py-3 pl-10 pr-12 text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all disabled:opacity-60"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs py-2.5 px-3 rounded-xl flex items-center gap-2 animate-shake">
                <div className="w-1 h-4 bg-rose-500 rounded-full" />
                <span>{error}</span>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-slate-950 font-bold py-3 rounded-xl text-sm transition-all shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/30 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-slate-950/30 border-t-slate-950 rounded-full animate-spin" />
                  <span>Đang xác thực...</span>
                </>
              ) : (
                <>
                  <Shield className="h-4 w-4" />
                  <span>Đăng nhập</span>
                </>
              )}
            </button>

          </form>

          {/* Divider */}
          <div className="mt-6 pt-6 border-t border-slate-700/30">
            <p className="text-xs text-slate-600 text-center">
              Liên hệ quản trị viên nếu bạn quên mật khẩu.
            </p>
          </div>

        </div>

        {/* Feature Pills */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          {[
            { icon: Shield, text: 'Bảo mật cao' },
            { icon: Zap, text: 'Thời gian thực' },
            { icon: BarChart3, text: 'Phân tích chuyên sâu' }
          ].map((feature, idx) => (
            <div
              key={idx}
              className="inline-flex items-center gap-1.5 bg-slate-900/40 border border-slate-700/20 rounded-full px-3 py-1.5 text-xs text-slate-400 backdrop-blur-sm"
            >
              <feature.icon className="h-3 w-3 text-emerald-400" />
              <span>{feature.text}</span>
            </div>
          ))}
        </div>

      </div>

      {/* Footer */}
      <div className="absolute bottom-6 left-0 right-0 text-center">
        <p className="text-xs text-slate-600">
          © 2026 MyWallet Hub. Nền tảng quản lý đầu tư cá nhân.
        </p>
      </div>

    </div>
  );
}
