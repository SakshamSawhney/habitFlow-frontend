import { useState, FormEvent } from 'react';
import Modal from '../ui/Modal';
import { Habit } from '../../types';
import toast from 'react-hot-toast';

interface ReminderModalProps {
  isOpen: boolean;
  onClose: () => void;
  habit: Habit;
}

const weekDays = [
    { name: 'Mon', value: 'MO' },
    { name: 'Tue', value: 'TU' },
    { name: 'Wed', value: 'WE' },
    { name: 'Thu', value: 'TH' },
    { name: 'Fri', value: 'FR' },
    { name: 'Sat', value: 'SA' },
    { name: 'Sun', value: 'SU' },
];

const ReminderModal = ({ isOpen, onClose, habit }: ReminderModalProps) => {
  const [time, setTime] = useState('09:00');
  const [selectedDays, setSelectedDays] = useState<string[]>(['MO', 'TU', 'WE', 'TH', 'FR']);

  const handleDayClick = (dayValue: string) => {
    setSelectedDays(prev => 
      prev.includes(dayValue) 
        ? prev.filter(d => d !== dayValue) 
        : [...prev, dayValue]
    );
  };

  // Helper to format date for Google Calendar URL (YYYYMMDDTHHMMSSZ)
  const formatGoogleDate = (date: Date) => {
    return date.toISOString().replace(/-|:|\.\d{3}/g, '');
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (selectedDays.length === 0) {
        toast.error('Please select at least one day.');
        return;
    }

    // --- Logic to generate Google Calendar link ---
    const [hour, minute] = time.split(':');
    
    // Find the next occurrence of the first day to set the start date
    const now = new Date();
    const dayMap = ['SU', 'MO', 'TU', 'WE', 'TH', 'FR', 'SA'];
    let firstDayIndex = dayMap.indexOf(selectedDays[0]);
    let daysUntilFirstEvent = (firstDayIndex - now.getDay() + 7) % 7;
    // If the day is today but the time has passed, schedule for next week
    if (daysUntilFirstEvent === 0 && (now.getHours() > parseInt(hour) || (now.getHours() === parseInt(hour) && now.getMinutes() > parseInt(minute)))) {
        daysUntilFirstEvent = 7;
    }

    let startDate = new Date();
    startDate.setDate(startDate.getDate() + daysUntilFirstEvent);
    startDate.setHours(parseInt(hour), parseInt(minute), 0, 0);

    let endDate = new Date(startDate.getTime() + 30 * 60000); // 30 minute duration

    const baseUrl = 'https://www.google.com/calendar/render?action=TEMPLATE';
    const eventTitle = encodeURIComponent(`Habit: ${habit.name}`);
    const eventDetails = encodeURIComponent(habit.description || `Time to complete your habit: ${habit.name}`);
    const eventLocation = encodeURIComponent(''); // Optional
    const eventDates = `${formatGoogleDate(startDate)}/${formatGoogleDate(endDate)}`;
    const eventRecurrence = `RRULE:FREQ=WEEKLY;BYDAY=${selectedDays.join(',')}`;

    const calendarUrl = `${baseUrl}&text=${eventTitle}&details=${eventDetails}&location=${eventLocation}&dates=${eventDates}&recur=${eventRecurrence}`;

    window.open(calendarUrl, '_blank');
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Set Calendar Reminder">
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
            <p className="font-semibold">{habit.name}</p>
            <p className="text-sm text-gray-400">{habit.description}</p>
        </div>

        <div className="mb-4">
            <label className="block text-sm font-medium text-gray-300 mb-1">Reminder Time</label>
            <input 
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full px-3 py-2 text-white bg-gray-700 border border-gray-600 rounded-md"
            />
        </div>

        <div className="mb-6">
            <label className="block text-sm font-medium text-gray-300 mb-2">Reminder Days</label>
            <div className="flex justify-center gap-2">
                {weekDays.map(day => (
                    <button
                        key={day.value}
                        type="button"
                        onClick={() => handleDayClick(day.value)}
                        className={`px-3 py-2 rounded-lg font-semibold transition ${
                            selectedDays.includes(day.value)
                                ? 'bg-green-500 text-white'
                                : 'bg-gray-600 hover:bg-gray-500'
                        }`}
                    >
                        {day.name}
                    </button>
                ))}
            </div>
        </div>

        <div className="flex justify-end gap-4">
          <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 dark:bg-gray-600 dark:text-gray-200 dark:hover:bg-gray-500">Cancel</button>
          <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">+ Add to Calendar</button>
        </div>
      </form>
    </Modal>
  );
};

export default ReminderModal;