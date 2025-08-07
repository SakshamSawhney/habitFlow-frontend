import { Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import Friends from './pages/Friends';
import Analytics from './pages/Analytics';
import Profile from './pages/Profile';
import FriendProfile from './pages/FriendProfile';
import ProtectedRoute from './components/auth/ProtectedRoute';
import MainLayout from './components/layout/MainLayout';
import { useAuth } from './hooks/useAuth';
import { useData } from './contexts/DataContext';

function App() {
  const { loading: authLoading } = useAuth();
  const { loading: dataLoading } = useData();

  const isLoading = authLoading || dataLoading;

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      
      <Route 
        path="/*" 
        element={
          <ProtectedRoute>
            <MainLayout>
              {isLoading ? (
                <div className="flex justify-center items-center h-full">
                    <p>Loading Application...</p>
                </div>
              ) : (
                <Routes>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/analytics" element={<Analytics />} />
                  <Route path="/friends" element={<Friends />} />
                  <Route path="/friends/:userId" element={<FriendProfile />} />
                  <Route path="/profile" element={<Profile />} />
                </Routes>
              )}
            </MainLayout>
          </ProtectedRoute>
        } 
      />
    </Routes>
  );
}

export default App;
