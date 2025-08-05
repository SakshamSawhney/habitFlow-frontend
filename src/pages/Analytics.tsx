import { useAnalytics } from '../hooks/useAnalytics';
import StatsCard from '../components/habits/StatsCard';
import { AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const Analytics = () => {
    const { data, loading } = useAnalytics();

    if (loading) {
        return <div>Loading analytics...</div>;
    }

    if (!data) {
        return <div>No analytics data available.</div>;
    }
    
    const { stats, charts, summary } = data;

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Analytics</h1>
                <p className="text-gray-500 dark:text-gray-400">Track your progress and insights</p>
            </div>

            {/* Top Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <StatsCard title="Total Completions" value={stats.totalCompletions} icon="target" />
                <StatsCard title="Average Streak" value={stats.averageStreak} icon="trending" />
                <StatsCard title="Best Streak" value={stats.bestStreak} icon="trending" />
                <StatsCard title="Completed Today" value={stats.completionsToday} icon="calendar" />
            </div>

            {/* Main Chart Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md">
                    <h3 className="font-bold mb-4">Daily Progress (30 Days)</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <AreaChart data={charts.dailyProgress}>
                            <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} />
                            <XAxis dataKey="date" fontSize={12} />
                            <YAxis />
                            <Tooltip />
                            <Area type="monotone" dataKey="completions" stroke="#4ade80" fill="#4ade80" fillOpacity={0.3} />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
                <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md">
                    <h3 className="font-bold mb-4">This Week</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={charts.weeklyProgress}>
                            <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} />
                            <XAxis dataKey="day" fontSize={12} />
                            <YAxis />
                            <Tooltip />
                            <Bar dataKey="completions" fill="#60a5fa" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
            
            {/* Bottom Chart Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                 <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md">
                    <h3 className="font-bold mb-4">Habit Streaks</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={charts.habitStreaks} layout="vertical">
                            <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} />
                            <XAxis type="number" />
                            <YAxis type="category" dataKey="name" width={80} fontSize={12} />
                            <Tooltip />
                            <Bar dataKey="streak" fill="#8884d8" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
                <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md">
                    <h3 className="font-bold mb-4">Habit Distribution</h3>
                    <ResponsiveContainer width="100%" height={300}>
                       <PieChart>
                            <Pie data={charts.habitDistribution} dataKey="completions" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                                {charts.habitDistribution.map((entry: any, index: number) => (
                                    <Cell key={`cell-${index}`} fill={entry.fill} />
                                ))}
                            </Pie>
                            <Tooltip />
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Progress Summary */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
                 <h3 className="font-bold mb-4">Progress Summary</h3>
                 <div className="grid grid-cols-3 text-center divide-x divide-gray-200 dark:divide-gray-700">
                     <div>
                         <p className="text-3xl font-bold text-green-500">{summary.todaysCompletionRate}%</p>
                         <p className="text-sm text-gray-500 dark:text-gray-400">Today's Completion Rate</p>
                     </div>
                     <div>
                         <p className="text-3xl font-bold text-blue-500">{summary.habitsWith7DayStreak}</p>
                         <p className="text-sm text-gray-500 dark:text-gray-400">Habits with 7+ Day Streaks</p>
                     </div>
                     <div>
                         <p className="text-3xl font-bold text-indigo-500">{summary.habitsWith30DayStreak}</p>
                         <p className="text-sm text-gray-500 dark:text-gray-400">Habits with 30+ Day Streaks</p>
                     </div>
                 </div>
            </div>
        </div>
    );
};

export default Analytics;