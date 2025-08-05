import { useState, FormEvent } from 'react';
import Modal from '../ui/Modal';

// The component's props are defined here. It expects to receive a function called `addHabit`.
interface AddHabitModalProps {
    isOpen: boolean;
    onClose: () => void;
    addHabit: (habitData: { name: string; description?: string; color: string; }) => void;
}

const colors = ['#ef4444', '#f97316', '#eab308', '#84cc16', '#22c55e', '#14b8a6', '#0ea5e9', '#6366f1', '#8b5cf6', '#d946ef'];

const AddHabitModal = ({ isOpen, onClose, addHabit }: AddHabitModalProps) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [color, setColor] = useState(colors[0]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!name) return;
    
    // This line calls the function that was passed down from the Dashboard.
    // If the prop isn't passed correctly, this will cause a "not a function" error.
    addHabit({ name, description, color });
    
    onClose();
    setName('');
    setDescription('');
    setColor(colors[0]);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add a New Habit">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-300">Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full px-3 py-2 mt-1 text-white bg-gray-700 border border-gray-600 rounded-md"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300">Description (Optional)</label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-3 py-2 mt-1 text-white bg-gray-700 border border-gray-600 rounded-md"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300">Color</label>
          <div className="flex gap-2 mt-2">
            {colors.map(c => (
              <button
                key={c}
                type="button"
                onClick={() => setColor(c)}
                className={`w-8 h-8 rounded-full ${color === c ? 'ring-2 ring-offset-2 ring-offset-gray-800 ring-white' : ''}`}
                style={{ backgroundColor: c }}
              ></button>
            ))}
          </div>
        </div>
        <div className="flex justify-end gap-4 pt-4">
          <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-600 rounded hover:bg-gray-500">Cancel</button>
          <button type="submit" className="px-4 py-2 bg-indigo-600 rounded hover:bg-indigo-700">Add Habit</button>
        </div>
      </form>
    </Modal>
  );
};

export default AddHabitModal;