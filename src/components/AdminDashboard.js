// src/components/AdminDashboard.js
import React, { useState, useEffect } from 'react';
import { 
  Users, FileText, BarChart3, Download, Search, Filter, 
  Calendar, CheckCircle, XCircle, Clock, Eye, Trash2, 
  RefreshCw, TrendingUp, AlertTriangle 
} from 'lucide-react';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [workflows, setWorkflows] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');

  // Fetch data on component mount
  useEffect(() => {
    fetchWorkflows();
    fetchStats();
  }, []);

  const fetchWorkflows = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:3001/api/workflow');
      const data = await response.json();
      setWorkflows(data.workflows || []);
    } catch (error) {
      console.error('Error fetching workflows:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/stats');
      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const deleteWorkflow = async (id) => {
    if (window.confirm('Are you sure you want to delete this workflow?')) {
      try {
        await fetch(`http://localhost:3001/api/workflow/${id}`, { method: 'DELETE' });
        fetchWorkflows(); // Refresh list
        fetchStats(); // Refresh stats
      } catch (error) {
        console.error('Error deleting workflow:', error);
      }
    }
  };

  const exportData = async (format = 'csv') => {
    try {
      const response = await fetch(`http://localhost:3001/api/workflow/export?format=${format}`);
      const data = await response.text();
      
      const blob = new Blob([data], { 
        type: format === 'csv' ? 'text/csv' : 'application/json' 
      });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `workflows_${new Date().toISOString().split('T')[0]}.${format}`;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error exporting data:', error);
    }
  };

  // Filter workflows based on search and filters
  const filteredWorkflows = workflows.filter(workflow => {
    const matchesSearch = workflow.initiator.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         workflow.id.toString().includes(searchTerm);
    const matchesStatus = statusFilter === 'all' || workflow.status === statusFilter;
    const matchesDate = dateFilter === 'all' || 
                       (dateFilter === 'today' && isToday(workflow.createdAt)) ||
                       (dateFilter === 'week' && isThisWeek(workflow.createdAt)) ||
                       (dateFilter === 'month' && isThisMonth(workflow.createdAt));
    
    return matchesSearch && matchesStatus && matchesDate;
  });

  const isToday = (dateString) => {
    const date = new Date(dateString);
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const isThisWeek = (dateString) => {
    const date = new Date(dateString);
    const today = new Date();
    const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
    return date >= weekAgo;
  };

  const isThisMonth = (dateString) => {
    const date = new Date(dateString);
    const today = new Date();
    return date.getMonth() === today.getMonth() && date.getFullYear() === today.getFullYear();
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'initiated': return 'bg-blue-100 text-blue-800';
      case 'in_progress': return 'bg-yellow-100 text-yellow-800';
      case 'closed': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getApprovalColor = (approval) => {
    switch (approval) {
      case 'approved': return 'text-green-600';
      case 'rejected': return 'text-red-600';
      case 'pending': return 'text-yellow-600';
      default: return 'text-gray-400';
    }
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'workflows', label: 'All Workflows', icon: FileText },
    { id: 'analytics', label: 'Analytics', icon: TrendingUp },
    { id: 'officers', label: 'Officers', icon: Users }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="text-gray-600">Approval Workflow Management System</p>
            </div>
            <div className="flex gap-4">
              <button
                onClick={() => exportData('csv')}
                className="flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700"
              >
                <Download size={16} />
                Export CSV
              </button>
              <button
                onClick={fetchWorkflows}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                <RefreshCw size={16} />
                Refresh
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-orange-500 text-orange-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon size={16} />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'overview' && <OverviewTab stats={stats} workflows={workflows} />}
        {activeTab === 'workflows' && (
          <WorkflowsTab 
            workflows={filteredWorkflows}
            loading={loading}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
            dateFilter={dateFilter}
            setDateFilter={setDateFilter}
            onDelete={deleteWorkflow}
            formatDate={formatDate}
            getStatusColor={getStatusColor}
          />
        )}
        {activeTab === 'analytics' && <AnalyticsTab workflows={workflows} />}
        {activeTab === 'officers' && <OfficersTab workflows={workflows} getApprovalColor={getApprovalColor} />}
      </div>
    </div>
  );
};

// Overview Tab Component
const OverviewTab = ({ stats, workflows }) => {
  const recentWorkflows = workflows.slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard 
          title="Total Workflows" 
          value={stats.totalWorkflows || 0}
          icon={FileText}
          color="bg-blue-500"
        />
        <StatCard 
          title="In Progress" 
          value={stats.inProgressWorkflows || 0}
          icon={Clock}
          color="bg-yellow-500"
        />
        <StatCard 
          title="Completed" 
          value={stats.closedWorkflows || 0}
          icon={CheckCircle}
          color="bg-green-500"
        />
        <StatCard 
          title="Total Officers" 
          value={stats.totalOfficers || 0}
          icon={Users}
          color="bg-purple-500"
        />
      </div>

      {/* Recent Workflows */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">Recent Workflows</h3>
        <div className="space-y-3">
          {recentWorkflows.map((workflow) => (
            <div key={workflow.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium">Workflow #{workflow.id}</p>
                <p className="text-sm text-gray-600">Initiated by {workflow.initiator}</p>
              </div>
              <div className="text-right">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  workflow.status === 'closed' ? 'bg-green-100 text-green-800' :
                  workflow.status === 'in_progress' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-blue-100 text-blue-800'
                }`}>
                  {workflow.status.replace('_', ' ')}
                </span>
                <p className="text-xs text-gray-500 mt-1">
                  {new Date(workflow.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Workflows Tab Component
const WorkflowsTab = ({ 
  workflows, loading, searchTerm, setSearchTerm, statusFilter, setStatusFilter,
  dateFilter, setDateFilter, onDelete, formatDate, getStatusColor 
}) => {
  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Search</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
              <input
                type="text"
                placeholder="Search by initiator or ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-full p-2 border border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Status</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500"
            >
              <option value="all">All Status</option>
              <option value="initiated">Initiated</option>
              <option value="in_progress">In Progress</option>
              <option value="closed">Closed</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Date Range</label>
            <select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500"
            >
              <option value="all">All Time</option>
              <option value="today">Today</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
            </select>
          </div>
        </div>
      </div>

      {/* Workflows Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold">Workflows ({workflows.length})</h3>
        </div>
        
        {loading ? (
          <div className="p-8 text-center">Loading workflows...</div>
        ) : workflows.length === 0 ? (
          <div className="p-8 text-center text-gray-500">No workflows found</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Initiator</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Officers</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {workflows.map((workflow) => (
                  <WorkflowRow 
                    key={workflow.id} 
                    workflow={workflow} 
                    onDelete={onDelete}
                    formatDate={formatDate}
                    getStatusColor={getStatusColor}
                  />
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

// Analytics Tab Component
const AnalyticsTab = ({ workflows }) => {
  const statusCounts = workflows.reduce((acc, workflow) => {
    acc[workflow.status] = (acc[workflow.status] || 0) + 1;
    return acc;
  }, {});

  const deputationCounts = workflows.reduce((acc, workflow) => {
    workflow.officers.forEach(officer => {
      const dept = officer.deputation || 'Unknown';
      acc[dept] = (acc[dept] || 0) + 1;
    });
    return acc;
  }, {});

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Status Distribution */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Workflow Status Distribution</h3>
          <div className="space-y-3">
            {Object.entries(statusCounts).map(([status, count]) => (
              <div key={status} className="flex justify-between items-center">
                <span className="capitalize">{status.replace('_', ' ')}</span>
                <span className="font-semibold">{count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Deputation Distribution */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Officers by Deputation</h3>
          <div className="space-y-3">
            {Object.entries(deputationCounts).map(([dept, count]) => (
              <div key={dept} className="flex justify-between items-center">
                <span>{dept}</span>
                <span className="font-semibold">{count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// Officers Tab Component
const OfficersTab = ({ workflows, getApprovalColor }) => {
  const allOfficers = workflows.flatMap(workflow => 
    workflow.officers.map(officer => ({
      ...officer,
      workflowId: workflow.id,
      initiator: workflow.initiator
    }))
  );

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold">All Officers ({allOfficers.length})</h3>
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Workflow</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">IC No</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Deputation</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Col MS 3</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Brig B</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Addl MS(A)</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {allOfficers.map((officer, index) => (
              <tr key={`${officer.workflowId}-${officer.id}-${index}`}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  #{officer.workflowId}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{officer.icNo}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{officer.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{officer.deputation}</td>
                <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${getApprovalColor(officer.colMS3Approval)}`}>
                  {officer.colMS3Approval || '-'}
                </td>
                <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${getApprovalColor(officer.brigBApproval)}`}>
                  {officer.brigBApproval || '-'}
                </td>
                <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${getApprovalColor(officer.addlMSAApproval)}`}>
                  {officer.addlMSAApproval || '-'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// Helper Components
const StatCard = ({ title, value, icon: Icon, color }) => (
  <div className="bg-white rounded-lg shadow p-6">
    <div className="flex items-center">
      <div className={`${color} rounded-md p-3`}>
        <Icon className="h-6 w-6 text-white" />
      </div>
      <div className="ml-4">
        <p className="text-sm font-medium text-gray-500">{title}</p>
        <p className="text-2xl font-semibold text-gray-900">{value}</p>
      </div>
    </div>
  </div>
);

const WorkflowRow = ({ workflow, onDelete, formatDate, getStatusColor }) => {
  const [showDetails, setShowDetails] = useState(false);

  return (
    <>
      <tr>
        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
          #{workflow.id}
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{workflow.initiator}</td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{workflow.officers.length}</td>
        <td className="px-6 py-4 whitespace-nowrap">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(workflow.status)}`}>
            {workflow.status.replace('_', ' ')}
          </span>
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
          {formatDate(workflow.createdAt)}
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="text-blue-600 hover:text-blue-900"
          >
            <Eye size={16} />
          </button>
          <button
            onClick={() => onDelete(workflow.id)}
            className="text-red-600 hover:text-red-900"
          >
            <Trash2 size={16} />
          </button>
        </td>
      </tr>
      {showDetails && (
        <tr>
          <td colSpan="6" className="px-6 py-4 bg-gray-50">
            <WorkflowDetails workflow={workflow} />
          </td>
        </tr>
      )}
    </>
  );
};

const WorkflowDetails = ({ workflow }) => (
  <div className="space-y-4">
    <h4 className="font-semibold">Workflow #{workflow.id} Details</h4>
    
    <div className="grid grid-cols-2 gap-4">
      <div>
        <h5 className="font-medium mb-2">Timeline</h5>
        <div className="space-y-1 text-sm">
          <p>Initiated: {workflow.timeline.initiatedAt ? new Date(workflow.timeline.initiatedAt).toLocaleString() : '-'}</p>
          <p>Forwarded to Col: {workflow.timeline.forwardedToColAt ? new Date(workflow.timeline.forwardedToColAt).toLocaleString() : '-'}</p>
          <p>Received by Library: {workflow.timeline.receivedByLibraryAt ? new Date(workflow.timeline.receivedByLibraryAt).toLocaleString() : '-'}</p>
          <p>Handed to MS3: {workflow.timeline.handedToMS3At ? new Date(workflow.timeline.handedToMS3At).toLocaleString() : '-'}</p>
          <p>Closed: {workflow.timeline.closedAt ? new Date(workflow.timeline.closedAt).toLocaleString() : '-'}</p>
        </div>
      </div>
      
      <div>
        <h5 className="font-medium mb-2">Officers ({workflow.officers.length})</h5>
        <div className="space-y-1 text-sm max-h-32 overflow-y-auto">
          {workflow.officers.map((officer, index) => (
            <p key={index}>{officer.name} ({officer.icNo}) - {officer.deputation}</p>
          ))}
        </div>
      </div>
    </div>
  </div>
);

export default AdminDashboard;