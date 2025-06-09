// src/components/ForwardSteps.js
import React from 'react';
import { Send, Clock, CheckCircle, ArrowRight, Building, BookOpen, UserCheck, FileCheck } from 'lucide-react';

const ForwardSteps = ({ workflow, onForwardRequest }) => {
  const formatTimestamp = (timestamp) => {
    if (!timestamp) return null;
    return new Date(timestamp).toLocaleString();
  };

  const steps = [
    { 
      step: 3, 
      title: "Forward to Colonel MS HD", 
      description: "Send request to Colonel MS Head",
      key: 'forwardedToColAt',
      icon: Building,
      color: 'blue'
    },
    { 
      step: 4, 
      title: "Library Processing", 
      description: "Request received by concerned library",
      key: 'receivedByLibraryAt',
      icon: BookOpen,
      color: 'green'
    },
    { 
      step: 5, 
      title: "Hand over to MS 3", 
      description: "Extracts handed over to MS 3 department",
      key: 'handedToMS3At',
      icon: UserCheck,
      color: 'purple'
    },
    { 
      step: 6, 
      title: "Close Request", 
      description: "Final closure by MS 3 department",
      key: 'closedAt',
      icon: FileCheck,
      color: 'orange'
    }
  ];

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
      {/* Section Header */}
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 px-6 py-4 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-green-100 rounded-lg">
            <ArrowRight className="h-5 w-5 text-green-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Workflow Progress</h3>
            <p className="text-sm text-gray-600">Complete each step to move the workflow forward</p>
          </div>
        </div>
      </div>
      
      {/* Steps */}
      <div className="p-6">
        <div className="space-y-4">
          {steps.map((stepInfo, index) => (
            <ForwardStep
              key={stepInfo.step}
              stepInfo={stepInfo}
              timestamp={workflow[stepInfo.key]}
              onForward={() => onForwardRequest(stepInfo.step)}
              formatTimestamp={formatTimestamp}
              isLast={index === steps.length - 1}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

const ForwardStep = ({ stepInfo, timestamp, onForward, formatTimestamp, isLast }) => {
  const { step, title, description, icon: Icon, color } = stepInfo;
  const isCompleted = !!timestamp;
  
  const colorClasses = {
    blue: {
      bg: 'bg-blue-50',
      border: 'border-blue-200',
      icon: 'bg-blue-100 text-blue-600',
      button: 'bg-blue-600 hover:bg-blue-700',
      text: 'text-blue-700'
    },
    green: {
      bg: 'bg-green-50',
      border: 'border-green-200',
      icon: 'bg-green-100 text-green-600',
      button: 'bg-green-600 hover:bg-green-700',
      text: 'text-green-700'
    },
    purple: {
      bg: 'bg-purple-50',
      border: 'border-purple-200',
      icon: 'bg-purple-100 text-purple-600',
      button: 'bg-purple-600 hover:bg-purple-700',
      text: 'text-purple-700'
    },
    orange: {
      bg: 'bg-orange-50',
      border: 'border-orange-200',
      icon: 'bg-orange-100 text-orange-600',
      button: 'bg-orange-600 hover:bg-orange-700',
      text: 'text-orange-700'
    }
  };

  const colors = colorClasses[color];

  return (
    <div className="relative">
      <div className={`border-2 rounded-lg p-4 transition-all ${
        isCompleted 
          ? 'border-green-200 bg-green-50' 
          : `${colors.border} ${colors.bg}`
      }`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            {/* Step Icon */}
            <div className={`p-3 rounded-lg ${isCompleted ? 'bg-green-100' : colors.icon}`}>
              {isCompleted ? (
                <CheckCircle className="h-6 w-6 text-green-600" />
              ) : (
                <Icon className="h-6 w-6" />
              )}
            </div>
            
            {/* Step Info */}
            <div>
              <h4 className="font-semibold text-gray-900">
                Step {step}: {title}
              </h4>
              <p className="text-sm text-gray-600">{description}</p>
              {isCompleted && (
                <div className="flex items-center gap-2 mt-1">
                  <Clock size={14} className="text-green-600" />
                  <span className="text-sm text-green-700 font-medium">
                    Completed: {formatTimestamp(timestamp)}
                  </span>
                </div>
              )}
            </div>
          </div>
          
          {/* Action Button */}
          <div className="flex-shrink-0">
            {isCompleted ? (
              <div className="flex items-center gap-2 px-4 py-2 bg-green-100 text-green-700 rounded-lg">
                <CheckCircle size={16} />
                <span className="font-medium">Completed</span>
              </div>
            ) : (
              <button
                onClick={onForward}
                className={`px-6 py-2 text-white rounded-lg transition-colors flex items-center gap-2 font-medium ${colors.button}`}
              >
                <Send size={16} />
                Forward
              </button>
            )}
          </div>
        </div>
      </div>
      
      {/* Connecting Line */}
      {!isLast && (
        <div className="flex justify-center py-2">
          <div className={`w-0.5 h-4 ${isCompleted ? 'bg-green-300' : 'bg-gray-300'}`}></div>
        </div>
      )}
    </div>
  );
};

export default ForwardSteps;