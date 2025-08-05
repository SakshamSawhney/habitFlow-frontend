import { Habit } from '../../types';
import { isToday } from 'date-fns';

interface HabitCardProps {
  habit: Habit;
  onToggle: () => void;
  onDelete: () => void;
  onSetReminder: () => void;
  isFriendView?: boolean;
}

const HabitCard = ({ habit, onToggle, onDelete, onSetReminder, isFriendView = false }: HabitCardProps) => {
  const isCompletedToday = habit.completions.some(c => isToday(new Date(c.date)));
  const streak = habit.completions.length;

  return (
    <div className="bg-white dark:bg-dark-card p-5 rounded-lg shadow-md flex flex-col justify-between">
      <div>
        <div className="flex justify-between items-start">
          <div className="flex items-center space-x-3">
            <span className="w-3 h-3 rounded-full" style={{ backgroundColor: habit.color }}></span>
            <h3 className="font-bold text-lg text-gray-900 dark:text-dark-text">{habit.name}</h3>
          </div>
          {!isFriendView && (
            <div className="flex space-x-2 text-gray-400 dark:text-gray-500">
              <button onClick={onSetReminder} className="hover:text-gray-600 dark:hover:text-gray-300">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
              </button>
              <button onClick={onDelete} className="hover:text-red-500">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
              </button>
            </div>
          )}
        </div>
        <p className="text-sm text-gray-500 dark:text-dark-subtext mt-2">{habit.description}</p>
      </div>
      <div className="flex justify-between items-end mt-4">
        <div>
          <p className="text-sm text-gray-500 dark:text-dark-subtext">Streak</p>
          <p className="text-xl font-bold text-gray-900 dark:text-dark-text">{streak} <span className="text-sm font-normal">Total</span></p>
        </div>
        <button
          onClick={onToggle}
          disabled={isFriendView}
          className={`w-16 h-16 rounded-full flex items-center justify-center border-4 transition ${
            isCompletedToday
              ? 'border-green-500'
              : 'border-gray-200 dark:border-gray-600'
          } ${isFriendView ? 'cursor-not-allowed' : ''}`}
        >
          <div className={`w-12 h-12 rounded-full transition ${
            isCompletedToday
              ? 'bg-green-500'
              : 'bg-gray-200 dark:bg-gray-600'
          }`}>
          </div>
        </button>
      </div>
    </div>
  );
};

export default HabitCard;