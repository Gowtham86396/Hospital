import React from 'react';
import { Users, TestTube2, Stethoscope, Syringe, UserCheck, Calendar } from 'lucide-react';

const StatCard = ({ icon: Icon, title, value, color }: { icon: any, title: string, value: string, color: string }) => (
  <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
    <div className="flex items-center">
      <div className={`p-3 rounded-full ${color} bg-opacity-10`}>
        <Icon className={`w-6 h-6 ${color.replace('bg-', 'text-')}`} />
      </div>
      <div className="ml-4">
        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</h3>
        <p className="text-2xl font-semibold text-gray-900 dark:text-white">{value}</p>
      </div>
    </div>
  </div>
);

const Dashboard = () => {
  const stats = [
    { icon: Users, title: 'Total Patients', value: '1,234', color: 'bg-blue-500' },
    { icon: Calendar, title: "Today's Patients", value: '42', color: 'bg-green-500' },
    { icon: UserCheck, title: 'Active Patients', value: '789', color: 'bg-purple-500' },
    { icon: TestTube2, title: 'Pending Lab Tests', value: '56', color: 'bg-yellow-500' },
    { icon: Stethoscope, title: 'Completed Procedures', value: '328', color: 'bg-pink-500' },
    { icon: Syringe, title: 'Upcoming Surgeries', value: '12', color: 'bg-red-500' },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stats.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </div>
    </div>
  );
};

export default Dashboard;