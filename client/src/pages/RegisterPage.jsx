import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { registerUser, clearError } from '../store/authSlice';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiUser, FiMail, FiLock, FiArrowRight } from 'react-icons/fi';
import toast from 'react-hot-toast';

const InputField = ({ icon: Icon, label, ...inputProps }) => (
  <div>
    <label className="block font-medium text-[#999]" style={{ fontSize: '0.85rem', marginBottom: 8, paddingLeft: 2 }}>
      {label}
    </label>
    <div
      className="flex items-center rounded-xl border border-white/10 bg-[#0a0a0a] transition-all duration-200 focus-within:border-[#a1cca5]/40 focus-within:bg-[#0c0c0c]"
      style={{ padding: '14px 16px', gap: 12 }}
    >
      <Icon size={18} className="shrink-0 text-[#666]" />
      <input
        {...inputProps}
        className="flex-1 bg-transparent text-white outline-none"
        style={{ fontSize: '0.95rem' }}
      />
    </div>
  </div>
);

const RegisterPage = () => {
  const [name, setName] = useState('');
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
    if (!name || !email || !password) return toast.error('Please fill in all fields');
    if (password.length < 6) return toast.error('Password must be at least 6 characters');
    dispatch(registerUser({ name, email, password }));
  };

  return (
    <div className="relative flex items-center justify-center overflow-hidden bg-[#000000]" style={{ minHeight: 'calc(100vh - 96px)', padding: '20px' }}>
      <div className="stars-bg"></div>

      {/* Background glow */}
      <div
        className="pointer-events-none absolute rounded-full"
        style={{
          left: '10%',
          bottom: '10%',
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
        style={{ maxWidth: 440, padding: '32px 40px 28px' }}
      >
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <h1 className="font-semibold text-white" style={{ fontSize: '1.75rem', marginBottom: 8, letterSpacing: '-0.02em' }}>
            Create Account
          </h1>
          <p className="text-[#888]" style={{ fontSize: '0.95rem' }}>
            Start your negotiation journey
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <InputField
              icon={FiUser}
              label="Full Name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="John Doe"
              id="register-name"
            />
            <InputField
              icon={FiMail}
              label="Email Address"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              id="register-email"
            />
            <InputField
              icon={FiLock}
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Min. 6 characters"
              id="register-password"
            />

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              id="register-submit"
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
                <>Create Account <FiArrowRight size={18} /></>
              )}
            </button>
          </div>
        </form>

        <p className="text-center text-[#666]" style={{ marginTop: 20, fontSize: '0.9rem' }}>
          Already have an account?{' '}
          <Link to="/login" className="font-semibold text-[#a1cca5] no-underline transition-colors hover:text-white">
            Log in
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default RegisterPage;