import { useState, ReactNode } from 'react';
import { NavLink } from 'react-router-dom';
import { useTheme } from '../../contexts/ThemeContext';
import { useAuth } from '../../hooks/useAuth';

// --- SVG Icons ---
const MoonIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>;
const SunIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>;
const ProfileIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>;
const SignOutIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>;
const HamburgerIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>;
const CloseIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>;

const MainLayout = ({ children }: { children: ReactNode }) => {
  const { theme, setTheme } = useTheme();
  const { user, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { name: 'Habits', path: '/' },
    { name: 'Analytics', path: '/analytics' },
    { name: 'Friends', path: '/friends' },
    { name: 'Profile', path: '/profile' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-background">
      <header className="bg-white dark:bg-dark-card shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Left side: Logo and Desktop Nav */}
            <div className="flex items-center space-x-8">
              <div className="text-2xl font-bold text-indigo-600 dark:text-dark-primary">
                HabitFlow
              </div>
              <nav className="hidden md:flex space-x-8">
                {navItems.map(item => (
                  <NavLink
                    key={item.name}
                    to={item.path}
                    end={item.path === '/'}
                    className={({ isActive }) =>
                      `inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                        isActive
                          ? 'border-indigo-500 text-gray-900 dark:text-dark-text'
                          : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 dark:text-dark-subtext dark:hover:text-dark-text'
                      }`
                    }
                  >
                    {item.name}
                  </NavLink>
                ))}
              </nav>
            </div>

            {/* Right side: Desktop Controls */}
            <div className="hidden md:flex items-center space-x-4">
              <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} className="p-2 rounded-full text-gray-500 dark:text-dark-subtext hover:bg-gray-100 dark:hover:bg-gray-700">
                {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
              </button>
              <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-dark-subtext">
                <ProfileIcon />
                <span>Welcome, {user?.displayName}</span>
              </div>
              <button onClick={logout} className="flex items-center space-x-2 text-sm text-gray-500 dark:text-dark-subtext hover:text-gray-700 dark:hover:text-dark-text">
                <SignOutIcon />
                <span className="hidden sm:inline">Sign Out</span>
              </button>
            </div>

            {/* Mobile Hamburger Menu Button */}
            <div className="md:hidden flex items-center">
                <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} className="p-2 rounded-full text-gray-500 dark:text-dark-subtext">
                    {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
                </button>
                <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2 rounded-md text-gray-500 dark:text-dark-subtext">
                    {isMobileMenuOpen ? <CloseIcon /> : <HamburgerIcon />}
                </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu Panel */}
        {isMobileMenuOpen && (
            <div className="md:hidden bg-white dark:bg-dark-card border-t border-gray-200 dark:border-gray-700">
                <div className="pt-2 pb-3 space-y-1">
                    {navItems.map(item => (
                         <NavLink
                            key={item.name}
                            to={item.path}
                            end={item.path === '/'}
                            onClick={() => setIsMobileMenuOpen(false)} // Close menu on click
                            className={({ isActive }) =>
                            `block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${
                                isActive
                                ? 'bg-indigo-50 border-indigo-500 text-indigo-700 dark:bg-indigo-900/50 dark:border-indigo-400 dark:text-indigo-300'
                                : 'border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800 dark:text-dark-subtext dark:hover:bg-gray-700 dark:hover:text-dark-text'
                            }`
                            }
                        >
                            {item.name}
                        </NavLink>
                    ))}
                </div>
                <div className="pt-4 pb-3 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex items-center px-4">
                        <div className="text-base font-medium text-gray-800 dark:text-dark-text">{user?.displayName}</div>
                    </div>
                    <div className="mt-3 space-y-1">
                         <button onClick={() => { logout(); setIsMobileMenuOpen(false); }} className="w-full text-left block px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100 dark:text-dark-subtext dark:hover:text-dark-text dark:hover:bg-gray-700">
                            Sign Out
                         </button>
                    </div>
                </div>
            </div>
        )}
      </header>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
};

export default MainLayout;