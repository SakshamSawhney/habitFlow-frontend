import { useState, FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authService } from '../api';
import { useAuth } from '../hooks/useAuth';
import toast from 'react-hot-toast';

/**
 * Registration page component that handles user account creation
 * Includes form validation, submission handling, and success/error feedback
 */
const Register = () => {
  // Form state management
  const [email, setEmail] = useState('');           // Stores user email input
  const [password, setPassword] = useState('');     // Stores user password input
  const [displayName, setDisplayName] = useState(''); // Stores user display name
  const [loading, setLoading] = useState(false);    // Tracks form submission state

  // Navigation and authentication hooks
  const navigate = useNavigate();                   // For programmatic navigation
  const { setUser } = useAuth();                    // Auth context setter function

  /**
   * Handles form submission for user registration
   * @param e - Form event to prevent default behavior
   */
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Call registration API with form data
      const response = await authService.register({ email, password, displayName });
      
      // Store authentication token in local storage
      localStorage.setItem('token', response.data.token);
      
      // Update auth context with user data
      setUser(response.data);
      
      // Show success feedback and redirect to home
      toast.success('Account created successfully!');
      navigate('/');
    } catch (error: any) {
      // Display error message from server or fallback message
      toast.error(error.response?.data?.message || 'Failed to create account');
    } finally {
      // Reset loading state regardless of success/failure
      setLoading(false);
    }
  };

  return (
    // Main container with centered layout and dark background
    <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
      {/* Card container for the registration form */}
      <div className="w-full max-w-md p-8 space-y-6 bg-gray-800 rounded-lg shadow-lg">
        {/* Form title */}
        <h1 className="text-3xl font-bold text-center">Create Account</h1>
        
        {/* Registration form with submit handler */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Display Name input field */}
          <div>
            <label className="block text-sm font-medium text-gray-400">Display Name</label>
            <input
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              required
              className="w-full px-3 py-2 mt-1 text-white bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          
          {/* Email input field */}
          <div>
            <label className="block text-sm font-medium text-gray-400">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-3 py-2 mt-1 text-white bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          
          {/* Password input field */}
          <div>
            <label className="block text-sm font-medium text-gray-400">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-3 py-2 mt-1 text-white bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          
          {/* Submit button with loading state */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 font-semibold text-white bg-indigo-600 rounded-md hover:bg-indigo-700 disabled:bg-indigo-400 disabled:cursor-not-allowed"
          >
            {loading ? 'Creating...' : 'Sign Up'}
          </button>
        </form>
        
        {/* Link to login page for existing users */}
        <p className="text-sm text-center text-gray-400">
          Already have an account?{' '}
          <Link to="/login" className="font-medium text-indigo-400 hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
