import { useData } from '../contexts/DataContext';

export const useAnalytics = () => {
  const { analyticsData, loading } = useData();
  return { data: analyticsData, loading };
};
