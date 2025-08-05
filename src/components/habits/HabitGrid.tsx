import { Habit } from '../../types';
import HabitCard from './HabitCard';

interface HabitGridProps {
    habits: Habit[];
    toggleCompletion: (habitId: string, date: string) => void;
    deleteHabit: (habitId: string) => void;
    openReminderModal: (habit: Habit) => void;
}

const HabitGrid = ({ habits, toggleCompletion, deleteHabit, openReminderModal }: HabitGridProps) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {habits.map(habit => (
                <HabitCard
                    key={habit._id}
                    habit={habit}
                    onToggle={() => toggleCompletion(habit._id, new Date().toISOString())}
                    onDelete={() => deleteHabit(habit._id)}
                    onSetReminder={() => openReminderModal(habit)}
                />
            ))}
        </div>
    );
};

export default HabitGrid;