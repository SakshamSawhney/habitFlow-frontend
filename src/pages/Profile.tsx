import { useState, useEffect, ChangeEvent } from 'react';
import { useAuth } from '../hooks/useAuth';
import { profileService } from '../api';
import toast from 'react-hot-toast';
import { format } from 'date-fns';

const Profile = () => {
    const { user, setUser } = useAuth();
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        displayName: user?.displayName || '',
        bio: user?.bio || '',
    });

    useEffect(() => {
        if (user) {
            setFormData({
                displayName: user.displayName || '',
                bio: user.bio || '',
            });
        }
    }, [user]);

    const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleAvatarChange = async (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const uploadFormData = new FormData();
            uploadFormData.append('avatar', file);
            const toastId = toast.loading('Uploading photo...');
            try {
                const { data: updatedUser } = await profileService.updateAvatar(uploadFormData);
                setUser(updatedUser);
                toast.success('Profile photo updated!', { id: toastId });
            } catch (error) {
                toast.error('Failed to upload photo.', { id: toastId });
            }
        }
    };

    const handleProfileUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        const toastId = toast.loading('Updating profile...');
        try {
            const { data: updatedUser } = await profileService.updateProfile(formData);
            setUser(updatedUser);
            toast.success('Profile updated!', { id: toastId });
            setIsEditing(false);
        } catch (error) {
            toast.error('Failed to update profile.', { id: toastId });
        }
    };

    if (!user) return <div>Loading profile...</div>;

    return (
        <div className="bg-white dark:bg-dark-card p-8 rounded-lg shadow-md">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-dark-text">Your Profile</h1>
                <button 
                    onClick={() => setIsEditing(!isEditing)}
                    className="text-sm font-semibold text-indigo-600 dark:text-dark-primary hover:underline"
                >
                    {isEditing ? 'Cancel' : 'Edit Profile'}
                </button>
            </div>
            <div className="flex items-center space-x-6 mb-8">
                <div className="relative">
                    <img 
                        src={user.avatarUrl || `https://i.pravatar.cc/150?u=${user._id}`} 
                        alt="Profile" 
                        className="w-24 h-24 rounded-full object-cover"
                    />
                     {isEditing && (
                        <label htmlFor="avatar-upload" className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center text-white rounded-full cursor-pointer opacity-0 hover:opacity-100 transition-opacity">
                            Change
                            <input id="avatar-upload" type="file" className="hidden" accept="image/*" onChange={handleAvatarChange} />
                        </label>
                    )}
                </div>
                <div>
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-dark-text">Profile Photo</h2>
                </div>
            </div>
            <form onSubmit={handleProfileUpdate}>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-500 dark:text-dark-subtext">Display Name</label>
                        <input 
                            type="text"
                            name="displayName"
                            value={formData.displayName}
                            onChange={handleInputChange}
                            disabled={!isEditing}
                            className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm disabled:bg-gray-100 dark:disabled:bg-gray-700"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-500 dark:text-dark-subtext">Bio</label>
                        <textarea 
                            name="bio"
                            rows={3}
                            value={formData.bio}
                            onChange={handleInputChange}
                            disabled={!isEditing}
                            className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm disabled:bg-gray-100 dark:disabled:bg-gray-700"
                        />
                    </div>
                </div>
                {isEditing && (
                    <div className="text-right mt-6">
                        <button type="submit" className="px-4 py-2 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700">
                            Save Changes
                        </button>
                    </div>
                )}
            </form>
            <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
                <h2 className="text-lg font-semibold mb-4">Account Information</h2>
                <div className="flex justify-between text-sm text-gray-500 dark:text-dark-subtext">
                    <div>
                        <p className="font-medium">Member Since</p>
                        <p>{user.createdAt ? format(new Date(user.createdAt), 'MMMM d, yyyy') : 'N/A'}</p>
                    </div>
                    <div>
                        <p className="font-medium">Last Updated</p>
                        <p>{user.updatedAt ? format(new Date(user.updatedAt), 'MMMM d, yyyy') : 'N/A'}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;