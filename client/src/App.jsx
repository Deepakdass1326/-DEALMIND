import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { Toaster } from 'react-hot-toast';
import store from './store';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import GamePage from './pages/GamePage';
import LeaderboardPage from './pages/LeaderboardPage';
import HistoryPage from './pages/HistoryPage';
import StorePage from './pages/StorePage';

function App() {
  return (
    <Provider store={store}>
      <Router>
        <Toaster
          position="top-center"
          toastOptions={{
            style: {
              background: '#0a0a0a',
              color: '#f0f0f5',
              border: '1px solid rgba(255,255,255,0.06)',
              borderRadius: '12px',
              fontSize: '0.9rem',
              fontFamily: 'Inter, sans-serif',
            },
            success: {
              iconTheme: { primary: '#a1cca5', secondary: '#0a0a0a' },
            },
            error: {
              iconTheme: { primary: '#ef4444', secondary: '#0a0a0a' },
            },
          }}
        />
        <Navbar />
        {/* Main content wrapper — style ensures padding is properly applied regardless of Tailwind */}
        <main className="flex-1" style={{ width: '100%', paddingTop: '96px' }}>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/store" element={
              <ProtectedRoute>
                <StorePage />
              </ProtectedRoute>
            } />
            <Route path="/game" element={
              <ProtectedRoute>
                <GamePage />
              </ProtectedRoute>
            } />
            <Route path="/leaderboard" element={<LeaderboardPage />} />
            <Route path="/history" element={
              <ProtectedRoute>
                <HistoryPage />
              </ProtectedRoute>
            } />
          </Routes>
        </main>
      </Router>
    </Provider>
  );
}

export default App;
