// src/components/InitiatorSection.js
import React from 'react';
import { Send, Clock, User, CheckCircle } from 'lucide-react';

const InitiatorSection = ({ initiator, setInitiator, onInitiate, initiatedAt }) => {
  const formatTimestamp = (timestamp) => {
    if (!timestamp) return 'Not completed';
    return new Date(timestamp).toLocaleString();
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden mb-8">
      {/* Section Header */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-100 rounded-lg">
            <User className="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Step 1: Workflow Initiation</h3>
            <p className="text-sm text-gray-600">Enter your details to begin the approval process</p>
          </div>
          {initiatedAt && (
            <div className="ml-auto">
              <div className="flex items-center gap-2 px-3 py-1 bg-green-100 rounded-full">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span className="text-sm font-medium text-green-700">Completed</span>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Content */}
      <div className="p-6">
        <div className="space-y-4">
          {/* Input Field */}
          <div>
            <label htmlFor="initiator" className="block text-sm font-medium text-gray-700 mb-2">
              Initiator Name <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                id="initiator"
                type="text"
                placeholder="Enter your full name"
                value={initiator || ''}
                onChange={(e) => setInitiator(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                disabled={!!initiatedAt}
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                <User className="h-5 w-5 text-gray-400" />
              </div>
            </div>
          </div>
          
          {/* Action Button */}
          <div className="flex items-center justify-between">
            <div className="text-xs text-gray-500">
              This will create a new workflow with a unique ID
            </div>
            <button
              onClick={onInitiate}
              disabled={!initiator || !initiator.trim() || !!initiatedAt}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center gap-2 font-medium transition-colors"
            >
              <Send size={16} />
              {initiatedAt ? 'Workflow Initiated' : 'Initiate Workflow'}
            </button>
          </div>
          
          {/* Success Message */}
          {initiatedAt && (
            <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center gap-3">
                <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-green-800">
                    Workflow successfully initiated!
                  </p>
                  <p className="text-xs text-green-600 mt-1">
                    <Clock size={12} className="inline mr-1" />
                    {formatTimestamp(initiatedAt)}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default InitiatorSection;