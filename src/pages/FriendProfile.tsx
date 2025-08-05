import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { api } from '../api';
import { User, Habit } from '../types';
import { format } from 'date-fns';
import HabitCard from '../components/habits/HabitCard';

const FriendProfile = () => {
    const { userId } = useParams();
    const [profile, setProfile] = useState<{ user: User; habits: Habit[] } | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const { data } = await api.get(`/profile/${userId}`);
                setProfile(data);
            } catch (error) {
                console.error("Failed to fetch friend's profile", error);
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, [userId]);

    if (loading) return <div>Loading profile...</div>;
    if (!profile) return <div>Could not find this user.</div>;

    const { user, habits } = profile;

    return (
        <div className="dark:text-dark-text">
            <div className="bg-white dark:bg-dark-card p-8 rounded-lg shadow-md mb-8">
                <div className="flex items-center space-x-6 mb-8">
                    <img 
                        src={user.avatarUrl || `https://i.pravatar.cc/150?u=${user._id}`} 
                        alt="Profile" 
                        className="w-24 h-24 rounded-full object-cover"
                    />
                    <div>
                        <h1 className="text-3xl font-bold">{user.displayName}</h1>
                        <p className="text-gray-500 dark:text-dark-subtext">{user.bio || "No bio yet."}</p>
                        <p className="text-sm text-gray-400 dark:text-dark-subtext mt-2">Member since {format(new Date(user.createdAt), 'MMMM yyyy')}</p>
                    </div>
                </div>
            </div>
            <h2 className="text-2xl font-bold mb-4">{user.displayName}'s Habits</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {habits.map(habit => (
                    <HabitCard
                        key={habit._id}
                        habit={habit}
                        onToggle={() => {}}
                        onDelete={() => {}}
                        onSetReminder={() => {}}
                        isFriendView={true}
                    />
                ))}
                {habits.length === 0 && <p className="text-gray-500 dark:text-dark-subtext">This user hasn't added any habits yet.</p>}
            </div>
        </div>
    );
};

export default FriendProfile;