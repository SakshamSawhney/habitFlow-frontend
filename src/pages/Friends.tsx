import { useState } from 'react';
import { useFriends } from '../hooks/useFriends';
import { useAuth } from '../hooks/useAuth';
import { User } from '../types';
import { Link } from 'react-router-dom';

const Friends = () => {
    const { 
        friends, 
        incomingRequests, 
        searchResults,
        searchUsers,
        sendRequest,
        acceptRequest,
        declineRequest,
        removeFriendship
    } = useFriends();
    const { user } = useAuth();
    const [query, setQuery] = useState('');

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        searchUsers(query);
    };

    return (
        <div className="dark:text-dark-text">
            <h1 className="text-3xl font-bold mb-6">Manage Friends</h1>
            <div className="mb-8 p-4 bg-white dark:bg-dark-card rounded-lg shadow">
                <h2 className="text-xl font-semibold mb-2">Find Friends</h2>
                <form onSubmit={handleSearch} className="flex gap-2">
                    <input 
                        type="text" 
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Search by display name..."
                        className="flex-grow px-3 py-2 bg-gray-200 dark:bg-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                    <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">Search</button>
                </form>
                <div className="mt-4 space-y-2">
                    {searchResults.map((user: User) => (
                        <div key={user._id} className="flex justify-between items-center p-2 bg-gray-100 dark:bg-gray-700 rounded">
                            <span>{user.displayName} ({user.email})</span>
                            <button onClick={() => sendRequest(user._id)} className="px-3 py-1 text-sm bg-green-500 text-white rounded hover:bg-green-600">Add</button>
                        </div>
                    ))}
                </div>
            </div>
            <div className="grid md:grid-cols-2 gap-8">
                <div className="p-4 bg-white dark:bg-dark-card rounded-lg shadow">
                    <h2 className="text-xl font-semibold mb-2">Incoming Requests ({incomingRequests.length})</h2>
                    <div className="space-y-2">
                        {incomingRequests.map(req => (
                            <div key={req._id} className="flex justify-between items-center p-2 bg-gray-100 dark:bg-gray-700 rounded">
                                <span>{req.requester.displayName}</span>
                                <div className="flex gap-2">
                                    <button onClick={() => acceptRequest(req._id)} className="px-3 py-1 text-sm bg-green-500 text-white rounded hover:bg-green-600">Accept</button>
                                    <button onClick={() => declineRequest(req._id)} className="px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600">Decline</button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="p-4 bg-white dark:bg-dark-card rounded-lg shadow">
                    <h2 className="text-xl font-semibold mb-2">Friends ({friends.length})</h2>
                     <div className="space-y-2">
                        {friends.map(friendship => {
                            const friendUser = friendship.requester._id === user?._id ? friendship.recipient : friendship.requester;
                            return (
                                <div key={friendship._id} className="flex justify-between items-center p-2 bg-gray-100 dark:bg-gray-700 rounded">
                                    <Link to={`/friends/${friendUser._id}`} className="font-semibold hover:underline">
                                        {friendUser.displayName}
                                    </Link>
                                    <button onClick={() => removeFriendship(friendship._id)} className="px-3 py-1 text-sm bg-gray-500 text-white rounded hover:bg-gray-600">Remove</button>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Friends;