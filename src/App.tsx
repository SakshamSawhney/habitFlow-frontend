import { Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import Friends from './pages/Friends';
import Analytics from './pages/Analytics';
import Profile from './pages/Profile';
import FriendProfile from './pages/FriendProfile'; // New page for viewing friend profiles
import ProtectedRoute from './components/auth/ProtectedRoute';
import MainLayout from './components/layout/MainLayout';
import { useAuth } from './hooks/useAuth';

function App() {
  const { loading } = useAuth();

  if (loading) {
    return <div className="flex justify-center items-center h-screen bg-gray-900 text-white">Loading...</div>;
  }

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      
      <Route 
        path="/*" 
        element={
          <ProtectedRoute>
            <MainLayout>
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/analytics" element={<Analytics />} />
                <Route path="/friends" element={<Friends />} />
                <Route path="/friends/:userId" element={<FriendProfile />} /> {/* New route */}
                <Route path="/profile" element={<Profile />} />
              </Routes>
            </MainLayout>
          </ProtectedRoute>
        } 
      />
    </Routes>
  );
}

export default App;