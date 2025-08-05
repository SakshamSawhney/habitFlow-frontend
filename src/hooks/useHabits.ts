import { useState, useEffect, useCallback } from 'react';
import { habitService } from '../api';
import { Habit } from '../types';
import toast from 'react-hot-toast';

export const useHabits = () => {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchHabits = useCallback(async () => {
    setLoading(true);
    try {
      const response = await habitService.getHabits();
      setHabits(response.data);
    } catch (error) {
      toast.error('Failed to fetch habits');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchHabits();
  }, [fetchHabits]);

  const toggleCompletion = async (habitId: string, date: string) => {
    try {
      const response = await habitService.toggleCompletion(habitId, date);
      setHabits(prev => prev.map(h => h._id === habitId ? response.data : h));
    } catch (error) {
      toast.error('Failed to update completion');
    }
  };
  
  const deleteHabit = async (habitId: string) => {
    try {
        await habitService.deleteHabit(habitId);
        setHabits(prev => prev.filter(h => h._id !== habitId));
        toast.success('Habit deleted!');
    } catch (error) {
        toast.error('Failed to delete habit');
    }
  };

  // Return the state setter function so parent components can update the state
  return { habits, setHabits, loading, toggleCompletion, deleteHabit, refetchHabits: fetchHabits };
};