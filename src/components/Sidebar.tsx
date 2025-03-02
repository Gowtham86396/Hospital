import React from 'react';
import {
  LayoutDashboard,
  Users,
  TestTube2,
  Stethoscope,
  Syringe,
  Sun,
  Moon,
  Receipt,
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  const { theme, toggleTheme } = useTheme();

  const menuItems = [
    { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { id: 'patients', icon: Users, label: 'Patients' },
    { id: 'lab-tests', icon: TestTube2, label: 'Lab Tests' },
    { id: 'procedures', icon: Stethoscope, label: 'Procedures' },
    { id: 'surgeries', icon: Syringe, label: 'Surgeries' },
    { id: 'bills', icon: Receipt, label: 'Bills' },
  ];

  return (
    <div className="w-64 h-screen bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 fixed left-0 top-0">
      <div className="flex items-center justify-center h-16 border-b border-gray-200 dark:border-gray-700">
        <h1 className="text-xl font-bold text-gray-800 dark:text-white">Hospital Manager</h1>
      </div>
      <nav className="mt-6">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex items-center w-full px-6 py-3 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${
                activeTab === item.id
                  ? 'bg-blue-50 dark:bg-gray-700 text-blue-600 dark:text-white border-r-4 border-blue-600'
                  : ''
              }`}
            >
              <Icon className="w-5 h-5 mr-3" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>
      <button
        onClick={toggleTheme}
        className="absolute bottom-4 left-4 p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
      >
        {theme === 'dark' ? (
          <Sun className="w-5 h-5 text-yellow-500" />
        ) : (
          <Moon className="w-5 h-5 text-gray-600" />
        )}
      </button>
    </div>
  );
}

export default Sidebar;