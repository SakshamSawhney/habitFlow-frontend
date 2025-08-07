import { useData } from '../contexts/DataContext';

export const useHabits = () => {
  const { habits, loading, addHabit, toggleCompletion, deleteHabit } = useData();
  return { habits, loading, addHabit, toggleCompletion, deleteHabit };
};
