import { Dialog, Transition } from '@headlessui/react';
import { Fragment, ReactNode } from 'react';

// Define the props interface for the Modal component
interface ModalProps {
  isOpen: boolean;       // Controls whether the modal is visible
  onClose: () => void;   // Callback function to close the modal
  title: string;         // Title text displayed in the modal header
  children: ReactNode;   // Content to be rendered inside the modal body
}

/**
 * Reusable Modal component built with Headless UI's Dialog and Transition components
 * Provides smooth animations and accessibility features out of the box
 */
const Modal = ({ isOpen, onClose, title, children }: ModalProps) => {
  return (
    // Transition wrapper for the entire modal - handles mount/unmount animations
    <Transition appear show={isOpen} as={Fragment}>
      {/* Dialog root component with click-outside-to-close behavior */}
      <Dialog as="div" className="relative z-10" onClose={onClose}>
        {/* Background overlay transition - fades in/out */}
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"      // Animation timing for entering
          enterFrom="opacity-0"             // Starting state for enter animation
          enterTo="opacity-100"             // Ending state for enter animation
          leave="ease-in duration-200"      // Animation timing for exiting
          leaveFrom="opacity-100"           // Starting state for exit animation
          leaveTo="opacity-0"               // Ending state for exit animation
        >
          {/* Semi-transparent black overlay behind the modal */}
          <div className="fixed inset-0 bg-black bg-opacity-50" />
        </Transition.Child>

        {/* Container for the modal content with scroll handling */}
        <div className="fixed inset-0 overflow-y-auto">
          {/* Centering container for the modal dialog */}
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            {/* Modal panel transition - scales and fades in/out */}
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"  // Start slightly scaled down and transparent
              enterTo="opacity-100 scale-100" // End at full size and opacity
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              {/* The actual modal panel with styling */}
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-gray-800 p-6 text-left align-middle shadow-xl transition-all text-white">
                {/* Modal title section */}
                <Dialog.Title as="h3" className="text-lg font-medium leading-6">
                  {title}
                </Dialog.Title>
                {/* Modal content container with top margin */}
                <div className="mt-4">{children}</div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default Modal;
