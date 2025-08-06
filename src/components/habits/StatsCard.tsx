import { ReactNode } from 'react'; // Importing ReactNode type for defining icon types

// Mapping of icon names to SVG icons (used dynamically in the card)
const iconMap: { [key: string]: ReactNode } = {
  // Target icon
  target: (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"></circle>
      <circle cx="12" cy="12" r="6"></circle>
      <circle cx="12" cy="12" r="2"></circle>
    </svg>
  ),

  // Calendar icon
  calendar: (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
      <line x1="16" y1="2" x2="16" y2="6"></line>
      <line x1="8" y1="2" x2="8" y2="6"></line>
      <line x1="3" y1="10" x2="21" y2="10"></line>
    </svg>
  ),

  // Trending icon
  trending: (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline>
      <polyline points="17 6 23 6 23 12"></polyline>
    </svg>
  ),

  // Percent icon
  percent: (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="19" y1="5" x2="5" y2="19"></line>
      <circle cx="6.5" cy="6.5" r="2.5"></circle>
      <circle cx="17.5" cy="17.5" r="2.5"></circle>
    </svg>
  ),
};

// Props interface for the StatsCard component
interface StatsCardProps {
  title: string; // Text label/title of the stat
  value: string | number; // Value of the stat (number or string)
  icon: keyof typeof iconMap; // Icon key, must match one from iconMap
}

// StatsCard functional component
const StatsCard = ({ title, value, icon }: StatsCardProps) => {
  return (
    // Card container with dark/light theme support and flex layout
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md flex items-center space-x-4">
      
      {/* Icon container with background and text color styling */}
      <div className="p-3 rounded-full bg-indigo-100 dark:bg-indigo-900 text-indigo-500 dark:text-indigo-300">
        {iconMap[icon]} {/* Render the icon from the iconMap using the key passed in props */}
      </div>
      
      {/* Title and value section */}
      <div>
        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</p> {/* Stat label */}
        <p className="text-2xl font-bold text-gray-900 dark:text-white">{value}</p> {/* Stat value */}
      </div>
    </div>
  );
};

export default StatsCard; // Exporting component for use in other parts of the app
