import { useState } from 'react';
import { useHabits } from '../hooks/useHabits';
import { habitService } from '../api';
import AddHabitModal from '../components/habits/AddHabitModal';
import HabitCard from '../components/habits/HabitCard';
import StatsCard from '../components/habits/StatsCard';
import ReminderModal from '../components/habits/ReminderModal';
import { isToday } from 'date-fns';
import { Habit } from '../types';
import toast from 'react-hot-toast';

const Dashboard = () => {
  // The Dashboard component is the "source of truth" for habit data on this page.
  // It gets the habits array and the function to update it (`setHabits`) from the hook.
  const { habits, setHabits, loading, toggleCompletion, deleteHabit } = useHabits();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isReminderModalOpen, setIsReminderModalOpen] = useState(false);
  const [selectedHabit, setSelectedHabit] = useState<Habit | null>(null);

  const handleOpenReminderModal = (habit: Habit) => {
    setSelectedHabit(habit);
    setIsReminderModalOpen(true);
  };
  
  // This function handles the logic for creating a habit and then updates the state.
  // It is defined here and passed down to the modal as a prop.
  const handleAddHabit = async (habitData: { name: string; description?: string; color: string }) => {
    try {
        const { data: newHabit } = await habitService.createHabit(habitData);
        // This is the crucial step: update the state with the new habit.
        setHabits(prev => [...prev, newHabit]);
        toast.success('Habit added!');
    } catch (error) {
        toast.error('Failed to add habit');
    }
  };

  const totalHabits = habits.length;
  const completedToday = habits.filter(h => h.completions.some(c => isToday(new Date(c.date)))).length;
  const todaysRate = totalHabits > 0 ? Math.round((completedToday / totalHabits) * 100) : 0;
  const totalStreaks = habits.reduce((acc, habit) => acc + (habit.completions.length || 0), 0);

  if (loading) {
    return <div>Loading habits...</div>;
  }

  return (
    <div className="dark:text-dark-text">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatsCard title="Total Habits" value={totalHabits} icon="target" />
        <StatsCard title="Completed Today" value={completedToday} icon="calendar" />
        <StatsCard title="Total Streaks" value={totalStreaks} icon="trending" />
        <StatsCard title="Today's Rate" value={`${todaysRate}%`} icon="percent" />
      </div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-dark-text">Your Habits</h2>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="px-4 py-2 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700"
        >
          + Add Habit
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {habits.map(habit => (
          <HabitCard
            key={habit._id}
            habit={habit}
            onToggle={() => toggleCompletion(habit._id, new Date().toISOString())}
            onDelete={() => deleteHabit(habit._id)}
            onSetReminder={() => handleOpenReminderModal(habit)}
          />
        ))}
      </div>
      {habits.length === 0 && (
          <div className="text-center py-12 bg-white dark:bg-dark-card rounded-lg">
              <p className="text-gray-500 dark:text-dark-subtext">You haven't added any habits yet.</p>
          </div>
      )}
      {/* The handleAddHabit function is passed to the modal via the `addHabit` prop. */}
      <AddHabitModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        addHabit={handleAddHabit}
      />
      {selectedHabit && (
        <ReminderModal
          isOpen={isReminderModalOpen}
          onClose={() => setIsReminderModalOpen(false)}
          habit={selectedHabit}
        />
      )}
    </div>
  );
};

export default Dashboard;