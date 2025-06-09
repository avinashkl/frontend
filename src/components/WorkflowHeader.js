// src/components/WorkflowHeader.js
import React from 'react';
import { FileText, Users, Clock } from 'lucide-react';

const WorkflowHeader = () => {
  return (
    <div className="relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-gradient-to-r from-orange-50 to-amber-50 opacity-50"></div>
      <div className="absolute inset-0" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23f97316' fill-opacity='0.03'%3E%3Cpath d='M20 20c0 11.046-8.954 20-20 20v-40c11.046 0 20 8.954 20 20zM0 20c0-11.046 8.954-20 20-20v40c-11.046 0-20-8.954-20-20z'/%3E%3C/g%3E%3C/svg%3E")`,
      }}></div>
      
      {/* Content */}
      <div className="relative px-8 py-6">
        <div className="text-center">
          {/* Main Title */}
          <div className="flex items-center justify-center gap-3 mb-3">
            <div className="p-2 bg-orange-100 rounded-full">
              <FileText className="h-8 w-8 text-orange-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">
              Open Extracts Approval System
            </h1>
          </div>
          
          {/* Subtitle */}
          <p className="text-lg text-gray-600 mb-4">
            Streamlined workflow for officer extract approvals
          </p>
          
          {/* Feature Pills */}
          <div className="flex items-center justify-center gap-4 text-sm">
            <div className="flex items-center gap-2 px-3 py-1 bg-white rounded-full shadow-sm border border-orange-100">
              <Users className="h-4 w-4 text-orange-500" />
              <span className="text-gray-700">Multi-level Approval</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1 bg-white rounded-full shadow-sm border border-orange-100">
              <Clock className="h-4 w-4 text-orange-500" />
              <span className="text-gray-700">Real-time Tracking</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1 bg-white rounded-full shadow-sm border border-orange-100">
              <FileText className="h-4 w-4 text-orange-500" />
              <span className="text-gray-700">Digital Workflow</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Bottom Border */}
      <div className="h-1 bg-gradient-to-r from-orange-400 via-amber-400 to-orange-400"></div>
    </div>
  );
};

export default WorkflowHeader;