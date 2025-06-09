// src/components/WorkflowList.js
import React, { useState, useEffect } from 'react';
import { 
  Eye, Download, Users, Calendar, CheckCircle, Clock, XCircle, X,
  Search, Filter, RefreshCw, AlertCircle 
} from 'lucide-react';

const WorkflowList = () => {
  const [workflows, setWorkflows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedWorkflow, setSelectedWorkflow] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchWorkflows();
  }, []);

  const fetchWorkflows = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('http://localhost:3001/api/workflow');
      
      // Check if response is HTML (404 page) instead of JSON
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error('Backend API endpoint not found. Make sure backend server is running with correct routes.');
      }
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      setWorkflows(data.workflows || []);
    } catch (error) {
      console.error('Error fetching workflows:', error);
      setError(`Failed to load workflows: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const viewWorkflowDetails = (workflow) => {
    setSelectedWorkflow(workflow);
    setShowModal(true);
  };

  const exportWorkflow = async (workflow) => {
    try {
      const dataStr = JSON.stringify(workflow, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `workflow-${workflow.id}-${workflow.initiator.replace(/\s+/g, '_')}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error exporting workflow:', error);
      alert('Failed to export workflow');
    }
  };

  const exportAllWorkflows = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/workflow/export?format=csv');
      if (!response.ok) {
        throw new Error('Export failed');
      }
      const data = await response.text();
      const blob = new Blob([data], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `all-workflows-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error exporting all workflows:', error);
      alert('Failed to export workflows');
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'closed':
        return <CheckCircle className="text-green-500" size={20} />;
      case 'in_progress':
        return <Clock className="text-yellow-500" size={20} />;
      case 'initiated':
        return <Clock className="text-blue-500" size={20} />;
      default:
        return <XCircle className="text-gray-500" size={20} />;
    }
  };

  const getStatusText = (status) => {
    return status.replace('_', ' ').toUpperCase();
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'closed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'in_progress':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'initiated':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + 
           date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const calculateProgress = (timeline) => {
    const steps = ['initiatedAt', 'forwardedToColAt', 'receivedByLibraryAt', 'handedToMS3At', 'closedAt'];
    const completedSteps = steps.filter(step => timeline[step] !== null).length;
    return (completedSteps / steps.length) * 100;
  };

  // Filter workflows based on search and status filter
  const filteredWorkflows = workflows.filter(workflow => {
    const matchesSearch = workflow.initiator.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         workflow.id.toString().includes(searchTerm) ||
                         workflow.officers.some(officer => 
                           officer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           officer.icNo.toLowerCase().includes(searchTerm.toLowerCase())
                         );
    const matchesStatus = statusFilter === 'all' || workflow.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mb-4"></div>
        <p className="text-gray-600">Loading workflows...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 flex items-center gap-3">
          <AlertCircle className="text-red-500" size={24} />
          <div>
            <h3 className="text-red-800 font-semibold">Error Loading Workflows</h3>
            <p className="text-red-700">{error}</p>
            <button
              onClick={fetchWorkflows}
              className="mt-3 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors flex items-center gap-2"
            >
              <RefreshCw size={16} />
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">All Workflows</h2>
            <p className="text-gray-600 mt-1">
              Total: {workflows.length} | 
              Showing: {filteredWorkflows.length} | 
              Completed: {workflows.filter(w => w.status === 'closed').length} | 
              In Progress: {workflows.filter(w => w.status === 'in_progress').length}
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={exportAllWorkflows}
              className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors flex items-center gap-2"
            >
              <Download size={16} />
              Export All CSV
            </button>
            <button
              onClick={fetchWorkflows}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <RefreshCw size={16} />
              Refresh
            </button>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="flex gap-4 mb-6">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search by initiator, ID, officer name, or IC number..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              />
            </div>
          </div>
          <div className="w-48">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full py-2 px-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            >
              <option value="all">All Status</option>
              <option value="initiated">Initiated</option>
              <option value="in_progress">In Progress</option>
              <option value="closed">Closed</option>
            </select>
          </div>
        </div>
      </div>

      {/* Workflows Grid */}
      {filteredWorkflows.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-500 text-lg mb-2">
            {searchTerm || statusFilter !== 'all' 
              ? 'No workflows match your search criteria' 
              : 'No workflows found'
            }
          </div>
          <p className="text-gray-400">
            {searchTerm || statusFilter !== 'all'
              ? 'Try adjusting your search or filter settings'
              : 'Create your first workflow to get started'
            }
          </p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredWorkflows.map((workflow) => (
            <WorkflowCard
              key={workflow.id}
              workflow={workflow}
              onView={() => viewWorkflowDetails(workflow)}
              onExport={() => exportWorkflow(workflow)}
              getStatusIcon={getStatusIcon}
              getStatusText={getStatusText}
              getStatusColor={getStatusColor}
              formatDate={formatDate}
              calculateProgress={calculateProgress}
            />
          ))}
        </div>
      )}

      {/* Modal for workflow details */}
      {showModal && selectedWorkflow && (
        <WorkflowModal
          workflow={selectedWorkflow}
          onClose={() => {
            setShowModal(false);
            setSelectedWorkflow(null);
          }}
          formatDate={formatDate}
          onExport={() => exportWorkflow(selectedWorkflow)}
        />
      )}
    </div>
  );
};

const WorkflowCard = ({ 
  workflow, onView, onExport, getStatusIcon, getStatusText, 
  getStatusColor, formatDate, calculateProgress 
}) => {
  const progress = calculateProgress(workflow.timeline);

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition-all duration-200 hover:border-orange-300">
      <div className="p-6">
        {/* Header */}
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              Workflow #{workflow.id}
            </h3>
            <p className="text-sm text-gray-600">by {workflow.initiator}</p>
          </div>
          <div className="flex items-center gap-2">
            {getStatusIcon(workflow.status)}
          </div>
        </div>

        {/* Status Badge */}
        <div className="mb-4">
          <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(workflow.status)}`}>
            {getStatusText(workflow.status)}
          </span>
        </div>

        {/* Progress Bar */}
        <div className="mb-4">
          <div className="flex justify-between text-xs text-gray-600 mb-1">
            <span>Progress</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-orange-400 to-orange-600 h-2 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>

        {/* Info */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Users size={14} />
            <span>{workflow.officers.length} officer{workflow.officers.length !== 1 ? 's' : ''}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Calendar size={14} />
            <span>{formatDate(workflow.createdAt)}</span>
          </div>
        </div>

        {/* Officers Preview */}
        <div className="mb-4">
          <p className="text-xs font-medium text-gray-700 mb-2">Officers:</p>
          <div className="space-y-1">
            {workflow.officers.slice(0, 2).map((officer, index) => (
              <div key={index} className="text-xs text-gray-600 truncate">
                <span className="font-medium">{officer.name}</span>
                {officer.deputation && (
                  <span className="text-gray-500"> ({officer.deputation})</span>
                )}
              </div>
            ))}
            {workflow.officers.length > 2 && (
              <div className="text-xs text-gray-500 font-medium">
                +{workflow.officers.length - 2} more officer{workflow.officers.length - 2 !== 1 ? 's' : ''}
              </div>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <button
            onClick={onView}
            className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition-colors"
          >
            <Eye size={14} />
            View Details
          </button>
          <button
            onClick={onExport}
            className="px-3 py-2 bg-gray-600 text-white text-sm rounded-md hover:bg-gray-700 transition-colors"
            title="Export JSON"
          >
            <Download size={14} />
          </button>
        </div>
      </div>
    </div>
  );
};

const WorkflowModal = ({ workflow, onClose, formatDate, onExport }) => {
  const getApprovalColor = (approval) => {
    switch (approval) {
      case 'approved': return 'text-green-600';
      case 'rejected': return 'text-red-600';
      case 'pending': return 'text-yellow-600';
      default: return 'text-gray-400';
    }
  };

  const getApprovalIcon = (approval) => {
    switch (approval) {
      case 'approved': return '✓';
      case 'rejected': return '✗';
      case 'pending': return '⏳';
      default: return '—';
    }
  };

  const getApprovalBadge = (approval) => {
    const baseClasses = "px-2 py-1 rounded-full text-xs font-medium";
    switch (approval) {
      case 'approved': 
        return `${baseClasses} bg-green-100 text-green-800`;
      case 'rejected': 
        return `${baseClasses} bg-red-100 text-red-800`;
      case 'pending': 
        return `${baseClasses} bg-yellow-100 text-yellow-800`;
      default: 
        return `${baseClasses} bg-gray-100 text-gray-800`;
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-6xl w-full max-h-[95vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="sticky top-0 bg-white flex justify-between items-center p-6 border-b border-gray-200">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              Workflow #{workflow.id} Details
            </h2>
            <p className="text-gray-600">Initiated by {workflow.initiator}</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={onExport}
              className="px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 transition-colors flex items-center gap-2"
            >
              <Download size={16} />
              Export
            </button>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X size={24} />
            </button>
          </div>
        </div>

        {/* Modal Content */}
        <div className="p-6 space-y-6">
          {/* Timeline */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Workflow Timeline</h3>
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="space-y-3">
                <TimelineStep
                  step="1. Workflow Initiated"
                  timestamp={workflow.timeline.initiatedAt}
                  formatDate={formatDate}
                  isCompleted={!!workflow.timeline.initiatedAt}
                />
                <TimelineStep
                  step="2. Forwarded to Col MS HD"
                  timestamp={workflow.timeline.forwardedToColAt}
                  formatDate={formatDate}
                  isCompleted={!!workflow.timeline.forwardedToColAt}
                />
                <TimelineStep
                  step="3. Received by Library"
                  timestamp={workflow.timeline.receivedByLibraryAt}
                  formatDate={formatDate}
                  isCompleted={!!workflow.timeline.receivedByLibraryAt}
                />
                <TimelineStep
                  step="4. Handed to MS 3"
                  timestamp={workflow.timeline.handedToMS3At}
                  formatDate={formatDate}
                  isCompleted={!!workflow.timeline.handedToMS3At}
                />
                <TimelineStep
                  step="5. Request Closed"
                  timestamp={workflow.timeline.closedAt}
                  formatDate={formatDate}
                  isCompleted={!!workflow.timeline.closedAt}
                />
              </div>
            </div>
          </div>

          {/* Officers Table */}
          <div>
            <h3 className="text-lg font-semibold mb-4">
              Officers ({workflow.officers.length})
            </h3>
            <div className="overflow-x-auto">
              <table className="min-w-full border border-gray-200 rounded-lg overflow-hidden">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ser.No.</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">IC No.</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Deputation</th>
                    <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Col MS 3</th>
                    <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Brig B</th>
                    <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Addl MS(A)</th>
                    <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Brig MS(C)</th>
                    <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Addl MS(B)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {workflow.officers.map((officer, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm text-gray-900 font-medium">{index + 1}</td>
                      <td className="px-4 py-3 text-sm text-gray-900">{officer.icNo}</td>
                      <td className="px-4 py-3 text-sm text-gray-900 font-medium">{officer.name}</td>
                      <td className="px-4 py-3 text-sm text-gray-900">{officer.deputation || '—'}</td>
                      <td className="px-4 py-3 text-center">
                        {officer.colMS3Approval ? (
                          <span className={getApprovalBadge(officer.colMS3Approval)}>
                            {officer.colMS3Approval}
                          </span>
                        ) : (
                          <span className="text-gray-400">—</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-center">
                        {officer.brigBApproval ? (
                          <span className={getApprovalBadge(officer.brigBApproval)}>
                            {officer.brigBApproval}
                          </span>
                        ) : (
                          <span className="text-gray-400">—</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-center">
                        {officer.addlMSAApproval ? (
                          <span className={getApprovalBadge(officer.addlMSAApproval)}>
                            {officer.addlMSAApproval}
                          </span>
                        ) : (
                          <span className="text-gray-400">—</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-center">
                        {officer.brigMSCApproval ? (
                          <span className={getApprovalBadge(officer.brigMSCApproval)}>
                            {officer.brigMSCApproval}
                          </span>
                        ) : (
                          <span className="text-gray-400">—</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-center">
                        {officer.addlMSBApproval ? (
                          <span className={getApprovalBadge(officer.addlMSBApproval)}>
                            {officer.addlMSBApproval}
                          </span>
                        ) : (
                          <span className="text-gray-400">—</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Workflow Summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-blue-50 rounded-lg p-4">
              <h4 className="font-semibold text-blue-900 mb-2">Status</h4>
              <p className="text-blue-700 capitalize">{workflow.status.replace('_', ' ')}</p>
            </div>
            <div className="bg-green-50 rounded-lg p-4">
              <h4 className="font-semibold text-green-900 mb-2">Created</h4>
              <p className="text-green-700">{formatDate(workflow.createdAt)}</p>
            </div>
            <div className="bg-orange-50 rounded-lg p-4">
              <h4 className="font-semibold text-orange-900 mb-2">Last Updated</h4>
              <p className="text-orange-700">{formatDate(workflow.updatedAt)}</p>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="sticky bottom-0 bg-white flex justify-end gap-3 p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

const TimelineStep = ({ step, timestamp, formatDate, isCompleted }) => (
  <div className="flex justify-between items-center">
    <div className="flex items-center gap-3">
      <div className={`w-3 h-3 rounded-full ${isCompleted ? 'bg-green-500' : 'bg-gray-300'}`}></div>
      <span className="text-sm font-medium text-gray-700">{step}</span>
    </div>
    <span className={`text-sm ${timestamp ? 'text-green-600 font-medium' : 'text-gray-400'}`}>
      {timestamp ? formatDate(timestamp) : 'Pending'}
    </span>
  </div>
);

export default WorkflowList;