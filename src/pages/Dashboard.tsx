import { useState } from 'react';
import { useHabits } from '../hooks/useHabits';
import AddHabitModal from '../components/habits/AddHabitModal';
import HabitCard from '../components/habits/HabitCard';
import StatsCard from '../components/habits/StatsCard';
import ReminderModal from '../components/habits/ReminderModal';
import { isToday } from 'date-fns';
import { Habit, Completion } from '../types';

const Dashboard = () => {
  const { habits, addHabit, toggleCompletion, deleteHabit } = useHabits();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isReminderModalOpen, setIsReminderModalOpen] = useState(false);
  const [selectedHabit, setSelectedHabit] = useState<Habit | null>(null);

  const handleOpenReminderModal = (habit: Habit) => {
    setSelectedHabit(habit);
    setIsReminderModalOpen(true);
  };

  // THIS IS THE FIX: Added explicit types for parameters
  const totalHabits = habits.length;
  const completedToday = habits.filter((h: Habit) => h.completions.some((c: Completion) => isToday(new Date(c.date)))).length;
  const todaysRate = totalHabits > 0 ? Math.round((completedToday / totalHabits) * 100) : 0;
  const totalStreaks = habits.reduce((acc: number, habit: Habit) => acc + (habit.completions.length || 0), 0);

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
        {habits.map((habit: Habit) => (
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
      <AddHabitModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        addHabit={addHabit}
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
