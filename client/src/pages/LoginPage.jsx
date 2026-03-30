import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser, clearError } from '../store/authSlice';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiMail, FiLock, FiArrowRight } from 'react-icons/fi';
import toast from 'react-hot-toast';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoading, error, isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    if (isAuthenticated) navigate('/store');
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearError());
    }
  }, [error, dispatch]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Please fill in all fields');
      return;
    }
    dispatch(loginUser({ email, password }));
  };

  return (
    <div className="relative flex items-center justify-center overflow-hidden bg-[#000000]" style={{ minHeight: 'calc(100vh - 96px)', padding: '20px' }}>
      <div className="stars-bg"></div>

      {/* Background glow */}
      <div
        className="pointer-events-none absolute rounded-full"
        style={{
          right: '10%',
          top: '20%',
          width: 400,
          height: 400,
          background: 'radial-gradient(circle, rgba(161,204,165,0.08) 0%, transparent 70%)',
          filter: 'blur(80px)',
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full rounded-2xl border border-white/5 bg-[#050505] shadow-2xl"
        style={{ maxWidth: 440, padding: '36px 40px 32px' }}
      >
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <h1 className="font-semibold text-white" style={{ fontSize: '1.75rem', marginBottom: 8, letterSpacing: '-0.02em' }}>
            Welcome Back
          </h1>
          <p className="text-[#888]" style={{ fontSize: '0.95rem' }}>
            Log in to continue
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {/* Email */}
            <div>
              <label className="block font-medium text-[#999]" style={{ fontSize: '0.85rem', marginBottom: 8, paddingLeft: 2 }}>
                Email Address
              </label>
              <div
                className="flex items-center rounded-xl border border-white/10 bg-[#0a0a0a] transition-all duration-200 focus-within:border-[#a1cca5]/40 focus-within:bg-[#0c0c0c]"
                style={{ padding: '14px 16px', gap: 12 }}
              >
                <FiMail size={18} className="shrink-0 text-[#666]" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1 bg-transparent text-white outline-none"
                  style={{ fontSize: '0.95rem' }}
                  placeholder="you@example.com"
                  id="login-email"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block font-medium text-[#999]" style={{ fontSize: '0.85rem', marginBottom: 8, paddingLeft: 2 }}>
                Password
              </label>
              <div
                className="flex items-center rounded-xl border border-white/10 bg-[#0a0a0a] transition-all duration-200 focus-within:border-[#a1cca5]/40 focus-within:bg-[#0c0c0c]"
                style={{ padding: '14px 16px', gap: 12 }}
              >
                <FiLock size={18} className="shrink-0 text-[#666]" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="flex-1 bg-transparent text-white outline-none"
                  style={{ fontSize: '0.95rem' }}
                  placeholder="••••••••"
                  id="login-password"
                />
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              id="login-submit"
              className="flex w-full items-center justify-center rounded-xl bg-[#a1cca5] font-semibold text-black transition-all duration-200 hover:bg-[#8bb58f] disabled:opacity-60"
              style={{ padding: '14px 0', fontSize: '1rem', gap: 8, marginTop: 8 }}
            >
              {isLoading ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  className="rounded-full border-2 border-black/30 border-t-black"
                  style={{ width: 20, height: 20 }}
                />
              ) : (
                <>Log In <FiArrowRight size={18} /></>
              )}
            </button>
          </div>
        </form>

        <p className="text-center text-[#666]" style={{ marginTop: 24, fontSize: '0.9rem' }}>
          Don't have an account?{' '}
          <Link to="/register" className="font-semibold text-[#a1cca5] no-underline transition-colors hover:text-white">
            Sign up
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default LoginPage;