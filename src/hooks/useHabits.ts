import { useState, useEffect, useCallback } from 'react';
import { habitService } from '../api';
import { Habit } from '../types';
import toast from 'react-hot-toast';

/**
 * Custom React hook for managing habits data and operations
 * Provides CRUD operations for habits with loading state management
 */
export const useHabits = () => {
  // State for storing the list of habits, initialized as empty array
  const [habits, setHabits] = useState<Habit[]>([]);
  
  // State to track loading status, initialized as true (loading on mount)
  const [loading, setLoading] = useState(true);

  /**
   * Memoized function to fetch habits from the API
   * Wrapped in useCallback to maintain stable reference
   */
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
  }, []); // Empty dependency array means this function is created once

  // Fetch habits on component mount
  useEffect(() => {
    fetchHabits();
  }, [fetchHabits]);

  /**
   * Toggles completion status for a habit on a specific date
   * @param habitId - ID of the habit to update
   * @param date - Date string (YYYY-MM-DD) for which to toggle completion
   */
  const toggleCompletion = async (habitId: string, date: string) => {
    try {
      const response = await habitService.toggleCompletion(habitId, date);
      // Update the specific habit in state with the response data
      setHabits(prev => prev.map(h => h._id === habitId ? response.data : h));
    } catch (error) {
      toast.error('Failed to update completion');
    }
  };
  
  /**
   * Deletes a habit by ID and updates local state
   * @param habitId - ID of the habit to delete
   */
  const deleteHabit = async (habitId: string) => {
    try {
      await habitService.deleteHabit(habitId);
      // Remove the deleted habit from state
      setHabits(prev => prev.filter(h => h._id !== habitId));
      toast.success('Habit deleted!');
    } catch (error) {
      toast.error('Failed to delete habit');
    }
  };

  // Expose state and operations to consuming components
  return { 
    habits,             // Array of habit objects
    setHabits,          // Direct state setter (use carefully)
    loading,            // Boolean indicating loading state
    toggleCompletion,   // Function to toggle habit completion status
    deleteHabit,        // Function to delete a habit
    refetchHabits: fetchHabits  // Function to refresh habits data
  };
};
