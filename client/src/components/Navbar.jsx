import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../store/authSlice';
import { motion } from 'framer-motion';
import { HiOutlineMenu, HiOutlineX } from 'react-icons/hi';
import { useState } from 'react';

const Navbar = () => {
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
    setMobileOpen(false);
  };

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="fixed left-0 right-0 top-0 z-50 border-b border-white/5 bg-black/95 backdrop-blur-md"
    >
      {/* Desktop Bar */}
      <div
        className="flex items-center justify-between px-6"
        style={{ height: 72, maxWidth: 1280, width: '100%', margin: '0 auto' }}
      >
        {/* Logo */}
        <Link to="/" className="flex items-center no-underline" style={{ gap: 10 }}>
          <div className="h-2 w-2 rounded-full bg-[#a1cca5]" />
          <span className="text-lg font-bold tracking-tight text-white">
            DEALMIND
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden items-center md:flex" style={{ gap: 40 }}>
          {/* Main Links */}
          <div className="flex items-center" style={{ gap: 32 }}>
            <NavLink to="/store" label="Store" />
            <NavLink to="/leaderboard" label="Leaderboard" />
            {isAuthenticated && <NavLink to="/history" label="History" />}
          </div>

          {/* Divider */}
          <div className="h-5 w-px bg-white/10" />

          {/* Auth Actions */}
          <div className="flex items-center" style={{ gap: 16 }}>
            {isAuthenticated ? (
              <>
                <span className="text-sm font-semibold text-white">
                  {user?.name}
                </span>
                <button
                  onClick={handleLogout}
                  className="rounded-full border border-white/20 text-sm font-medium text-white transition-colors hover:bg-white/5"
                  style={{ padding: '8px 20px' }}
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-sm font-medium text-[#c0c0c0] no-underline transition-colors hover:text-white"
                >
                  Log in
                </Link>
                <Link
                  to="/register"
                  className="rounded-full bg-white text-sm font-bold text-black no-underline transition-colors hover:bg-[#a1cca5]"
                  style={{ padding: '10px 24px' }}
                >
                  Sign up
                </Link>
              </>
            )}
          </div>
        </div>

        {/* Mobile Toggle */}
        <button
          className="cursor-pointer border-none bg-transparent p-1 text-white md:hidden"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <HiOutlineX size={24} /> : <HiOutlineMenu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="border-b border-white/5 bg-[#000000] md:hidden"
          style={{ padding: 16 }}
        >
          <div className="flex flex-col" style={{ gap: 4 }}>
            {isAuthenticated ? (
              <>  
                <MobileNavLink to="/store" label="Store" onClick={() => setMobileOpen(false)} />
                <MobileNavLink to="/leaderboard" label="Leaderboard" onClick={() => setMobileOpen(false)} />
                <MobileNavLink to="/history" label="History" onClick={() => setMobileOpen(false)} />
                <button
                  onClick={handleLogout}
                  className="rounded-xl text-left font-semibold text-red-500 hover:bg-white/5"
                  style={{ padding: 12 }}
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <MobileNavLink to="/login" label="Login" onClick={() => setMobileOpen(false)} />
                <MobileNavLink to="/register" label="Sign Up" onClick={() => setMobileOpen(false)} />
              </>
            )}
          </div>
        </motion.div>
      )}
    </motion.nav>
  );
};

const NavLink = ({ to, label }) => (
  <Link
    to={to}
    className="text-sm font-medium text-[#999] no-underline transition-colors hover:text-white"
  >
    {label}
  </Link>
);

const MobileNavLink = ({ to, label, onClick }) => (
  <Link
    to={to}
    onClick={onClick}
    className="rounded-xl text-left font-medium text-white no-underline transition-all duration-200 hover:bg-white/5"
    style={{ padding: 12 }}
  >
    {label}
  </Link>
);

export default Navbar;