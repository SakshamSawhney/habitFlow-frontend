import { useState, FormEvent } from 'react'; // Importing React hooks and types
import Modal from '../ui/Modal'; // Custom modal component
import { Habit } from '../../types'; // Habit type definition
import toast from 'react-hot-toast'; // Toast notification library

// Props interface for ReminderModal
interface ReminderModalProps {
  isOpen: boolean; // Whether modal is open
  onClose: () => void; // Function to close modal
  habit: Habit; // Habit data to set reminders for
}

// Weekday options for recurring reminders
const weekDays = [
    { name: 'Mon', value: 'MO' },
    { name: 'Tue', value: 'TU' },
    { name: 'Wed', value: 'WE' },
    { name: 'Thu', value: 'TH' },
    { name: 'Fri', value: 'FR' },
    { name: 'Sat', value: 'SA' },
    { name: 'Sun', value: 'SU' },
];

// ReminderModal component
const ReminderModal = ({ isOpen, onClose, habit }: ReminderModalProps) => {
  const [time, setTime] = useState('09:00'); // State for reminder time (default 9:00 AM)
  const [selectedDays, setSelectedDays] = useState<string[]>(['MO', 'TU', 'WE', 'TH', 'FR']); // Default selected weekdays

  // Toggle selection of a weekday
  const handleDayClick = (dayValue: string) => {
    setSelectedDays(prev => 
      prev.includes(dayValue) 
        ? prev.filter(d => d !== dayValue) // Deselect if already selected
        : [...prev, dayValue] // Add if not already selected
    );
  };

  // Helper to format date string for Google Calendar URL
  const formatGoogleDate = (date: Date) => {
    return date.toISOString().replace(/-|:|\.\d{3}/g, ''); // Format: YYYYMMDDTHHMMSSZ
  };

  // Handle form submission
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    // Show error toast if no days selected
    if (selectedDays.length === 0) {
        toast.error('Please select at least one day.');
        return;
    }

    // Split selected time into hour and minute
    const [hour, minute] = time.split(':');
    
    // Get current date and determine first day of reminder
    const now = new Date();
    const dayMap = ['SU', 'MO', 'TU', 'WE', 'TH', 'FR', 'SA'];
    let firstDayIndex = dayMap.indexOf(selectedDays[0]);

    // Calculate days to wait until first reminder
    let daysUntilFirstEvent = (firstDayIndex - now.getDay() + 7) % 7;

    // If time has already passed today, schedule for next week
    if (daysUntilFirstEvent === 0 && (now.getHours() > parseInt(hour) || (now.getHours() === parseInt(hour) && now.getMinutes() > parseInt(minute)))) {
        daysUntilFirstEvent = 7;
    }

    // Set start and end time for the calendar event
    let startDate = new Date();
    startDate.setDate(startDate.getDate() + daysUntilFirstEvent);
    startDate.setHours(parseInt(hour), parseInt(minute), 0, 0);

    let endDate = new Date(startDate.getTime() + 30 * 60000); // Event duration = 30 minutes

    // Build Google Calendar URL
    const baseUrl = 'https://www.google.com/calendar/render?action=TEMPLATE';
    const eventTitle = encodeURIComponent(`Habit: ${habit.name}`); // Title of event
    const eventDetails = encodeURIComponent(habit.description || `Time to complete your habit: ${habit.name}`); // Event description
    const eventLocation = encodeURIComponent(''); // Optional location
    const eventDates = `${formatGoogleDate(startDate)}/${formatGoogleDate(endDate)}`; // Start and end date in correct format
    const eventRecurrence = `RRULE:FREQ=WEEKLY;BYDAY=${selectedDays.join(',')}`; // Recurrence rule (weekly on selected days)

    // Final URL to open Google Calendar with pre-filled event
    const calendarUrl = `${baseUrl}&text=${eventTitle}&details=${eventDetails}&location=${eventLocation}&dates=${eventDates}&recur=${eventRecurrence}`;

    // Open the calendar event in a new tab
    window.open(calendarUrl, '_blank');
    onClose(); // Close modal after opening calendar
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Set Calendar Reminder">
      <form onSubmit={handleSubmit}>
        {/* Habit name and description display */}
        <div className="mb-4">
            <p className="font-semibold">{habit.name}</p>
            <p className="text-sm text-gray-400">{habit.description}</p>
        </div>

        {/* Time picker input */}
        <div className="mb-4">
            <label className="block text-sm font-medium text-gray-300 mb-1">Reminder Time</label>
            <input 
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full px-3 py-2 text-white bg-gray-700 border border-gray-600 rounded-md"
            />
        </div>

        {/* Day selection buttons */}
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
                                ? 'bg-green-500 text-white' // Highlight selected day
                                : 'bg-gray-600 hover:bg-gray-500' // Default style for unselected
                        }`}
                    >
                        {day.name}
                    </button>
                ))}
            </div>
        </div>

        {/* Submit and Cancel buttons */}
        <div className="flex justify-end gap-4">
          <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 dark:bg-gray-600 dark:text-gray-200 dark:hover:bg-gray-500">Cancel</button>
          <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">+ Add to Calendar</button>
        </div>
      </form>
    </Modal>
  );
};

export default ReminderModal;
