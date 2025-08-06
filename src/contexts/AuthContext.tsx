import { createContext, useState, useEffect, ReactNode } from 'react';
import { authService } from '../api'; // API service to get authenticated user info
import { User } from '../types';      // Type definition for User object

// Define the shape of the context value
interface AuthContextType {
  user: User | null;                      // currently logged-in user
  setUser: (user: User | null) => void;  // function to update user state
  loading: boolean;                      // whether user data is still loading
  logout: () => void;                    // function to log out the user
}

// Create a context for authentication
export const AuthContext = createContext<AuthContextType | undefined>(undefined);

// AuthProvider component to wrap the app and provide auth context
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null); // state to store user
  const [loading, setLoading] = useState(true);        // state to track loading status

  // useEffect runs on component mount
  useEffect(() => {
    const token = localStorage.getItem('token'); // check for existing token
    if (token) {
      // If token exists, fetch user info
      authService.getMe()
        .then(response => setUser(response.data)) // Set user data if valid token
        .catch(() => {
          // If token is invalid, remove it and reset user
          localStorage.removeItem('token');
          setUser(null);
        })
        .finally(() => setLoading(false)); // done loading
    } else {
      // No token found, mark as not loading
      setLoading(false);
    }
  }, []);

  // Logout function clears token and user state
  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  // Provide context value to children components
  return (
    <AuthContext.Provider value={{ user, setUser, loading, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
