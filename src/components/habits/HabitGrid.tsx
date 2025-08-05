import { useState } from 'react';
import { Habit } from '../../types';
import { format, addDays, subDays, startOfWeek, endOfWeek, eachDayOfInterval, isSameDay, isSameMonth } from 'date-fns';
import { useHabits } from '../../hooks/useHabits';
import AddHabitModal from './AddHabitModal';

const HabitGrid = ({ habits }: { habits: Habit[] }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { toggleCompletion, deleteHabit } = useHabits();

  const weekDays = eachDayOfInterval({
    start: startOfWeek(currentDate, { weekStartsOn: 1 }), // Monday
    end: endOfWeek(currentDate, { weekStartsOn: 1 }),
  });

  const handleToggle = (habitId: string, date: Date) => {
    toggleCompletion(habitId, date.toISOString());
  };
  
  const handleDelete = (habitId: string) => {
    if(window.confirm('Are you sure you want to delete this habit?')) {
        deleteHabit(habitId);
    }
  }

  return (
    <div className="bg-gray-800 p-4 rounded-lg">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-4">
            <button onClick={() => setCurrentDate(subDays(currentDate, 7))}>&lt;</button>
            <h2 className="text-xl font-bold">{format(currentDate, 'MMMM yyyy')}</h2>
            <button onClick={() => setCurrentDate(addDays(currentDate, 7))}>&gt;</button>
        </div>
        <button onClick={() => setIsModalOpen(true)} className="px-4 py-2 bg-indigo-600 rounded hover:bg-indigo-700">Add Habit</button>
      </div>

      <div className="grid grid-cols-[auto,1fr] gap-2">
        {/* Habit Names Column */}
        <div className="grid grid-rows-[auto,1fr] gap-2">
          <div className="h-12"></div> {/* Spacer */}
          {habits.map(habit => (
            <div key={habit._id} className="h-12 flex items-center pr-4 font-semibold" style={{ color: habit.color }}>
              {habit.name}
              <button onClick={() => handleDelete(habit._id)} className="ml-2 text-red-500 opacity-50 hover:opacity-100">x</button>
            </div>
          ))}
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-2">
            {/* Day Headers */}
            {weekDays.map(day => (
                <div key={day.toString()} className="h-12 flex flex-col items-center justify-center">
                    <span className="text-sm text-gray-400">{format(day, 'E')}</span>
                    <span className={`text-lg font-bold ${isSameDay(day, new Date()) ? 'text-indigo-400' : ''}`}>{format(day, 'd')}</span>
                </div>
            ))}
            {/* Completion Cells */}
            {habits.map(habit => (
                weekDays.map(day => {
                    const isCompleted = habit.completions.some(c => isSameDay(new Date(c.date), day));
                    return (
                        <div key={`${habit._id}-${day.toString()}`} className="h-12 flex items-center justify-center">
                            <button 
                                onClick={() => handleToggle(habit._id, day)}
                                className={`w-8 h-8 rounded-full transition-colors ${!isSameMonth(day, currentDate) ? 'opacity-30' : ''}`}
                                style={{ backgroundColor: isCompleted ? habit.color : '#4a5568' }}
                            ></button>
                        </div>
                    )
                })
            ))}
        </div>
      </div>
      <AddHabitModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
};

export default HabitGrid;