// src/components/Navigation.js
import React from 'react';
import { Plus, BarChart3, FileText, Calendar } from 'lucide-react';

const Navigation = ({ currentView, setCurrentView }) => {
  const navItems = [
    {
      id: 'create',
      label: 'Create Workflow',
      icon: Plus,
      description: 'Create new approval workflow',
      gradient: 'from-blue-500 to-blue-600'
    },
    {
      id: 'dashboard',
      label: 'Admin Dashboard',
      icon: BarChart3,
      description: 'View and manage all workflows',
      gradient: 'from-purple-500 to-purple-600'
    },
    {
      id: 'list',
      label: 'Workflow List',
      icon: FileText,
      description: 'Browse workflow history',
      gradient: 'from-green-500 to-green-600'
    }
  ];

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo/Title */}
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-r from-orange-400 to-amber-400 rounded-lg">
              <FileText className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">
                Approval Workflow System
              </h1>
              <p className="text-xs text-gray-500">Digital workflow management</p>
            </div>
          </div>

          {/* Navigation Items */}
          <div className="flex items-center space-x-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentView === item.id;
              
              return (
                <button
                  key={item.id}
                  onClick={() => setCurrentView(item.id)}
                  className={`group relative flex items-center gap-3 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? `bg-gradient-to-r ${item.gradient} text-white shadow-md transform scale-105`
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                  title={item.description}
                >
                  <Icon size={18} className={isActive ? 'text-white' : 'text-current'} />
                  <span className="hidden sm:inline">{item.label}</span>
                  
                  {/* Active indicator */}
                  {isActive && (
                    <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2">
                      <div className="w-1 h-1 bg-white rounded-full"></div>
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {/* Right Side Info */}
          <div className="flex items-center space-x-4">
            <div className="hidden md:flex items-center gap-2 text-sm text-gray-500">
              <Calendar size={16} />
              <span>{new Date().toLocaleDateString()}</span>
            </div>
            <div className="w-8 h-8 bg-gradient-to-r from-gray-400 to-gray-500 rounded-full flex items-center justify-center">
              <span className="text-white text-xs font-medium">U</span>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;