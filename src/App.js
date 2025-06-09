// src/App.js - Complete Updated Application with Navigation
import React, { useState } from 'react';
import Navigation from './components/Navigation';
import WorkflowHeader from './components/WorkflowHeader';
import InitiatorSection from './components/InitiatorSection';
import OfficersTable from './components/OfficersTable';
import ForwardSteps from './components/ForwardSteps';
import AdminDashboard from './components/AdminDashboard';
import WorkflowList from './components/WorkflowList';
import './App.css';

const App = () => {
  // Navigation state - controls which view to show
  const [currentView, setCurrentView] = useState('create');
  
  // Workflow creation state (for the original form)
  const [initiator, setInitiator] = useState('');
  const [officers, setOfficers] = useState([
    { 
      id: 1, 
      icNo: '', 
      name: '', 
      deputation: '', 
      colMS3Approval: '', 
      brigBApproval: '', 
      addlMSAApproval: '', 
      brigMSCApproval: '', 
      addlMSBApproval: '' 
    }
  ]);
  const [workflow, setWorkflow] = useState({
    initiatedAt: null,
    forwardedToColAt: null,
    receivedByLibraryAt: null,
    handedToMS3At: null,
    closedAt: null
  });

  // Officer management functions
  const addOfficerRow = () => {
    const newId = Math.max(...officers.map(o => o.id)) + 1;
    setOfficers([...officers, {
      id: newId,
      icNo: '',
      name: '',
      deputation: '',
      colMS3Approval: '',
      brigBApproval: '',
      addlMSAApproval: '',
      brigMSCApproval: '',
      addlMSBApproval: ''
    }]);
  };

  const removeOfficerRow = (id) => {
    if (officers.length > 1) {
      setOfficers(officers.filter(officer => officer.id !== id));
    }
  };

  const updateOfficer = (id, field, value) => {
    setOfficers(officers.map(officer => 
      officer.id === id ? { ...officer, [field]: value } : officer
    ));
  };

  // Workflow action handlers
  const handleInitiate = async () => {
    if (!initiator.trim()) {
      alert('Please enter initiator name');
      return;
    }

    const timestamp = new Date().toISOString();
    
    console.log('Sending initiate request:', { initiator, officers, timestamp });

    try {
      const response = await fetch('http://localhost:3001/api/workflow/initiate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          initiator,
          officers,
          timestamp
        })
      });

      if (response.ok) {
        const result = await response.json();
        setWorkflow(prev => ({ ...prev, initiatedAt: timestamp }));
        alert('Workflow initiated successfully!');
        console.log('Workflow created:', result);
      } else {
        // Log the full error response
        const errorText = await response.text();
        console.error('Initiate error response:', errorText);
        
        try {
          const error = JSON.parse(errorText);
          alert(`Error: ${error.error || error.message || 'Failed to initiate workflow'}`);
          console.error('Parsed initiate error:', error);
        } catch (parseError) {
          alert(`Server error: ${response.status} - ${errorText}`);
          console.error('Raw initiate error response:', errorText);
        }
      }
    } catch (error) {
      console.error('Network error:', error);
      // Fallback to local state update if backend is not available
      setWorkflow(prev => ({ ...prev, initiatedAt: timestamp }));
      alert('Workflow initiated locally (backend not available)');
    }
  };

  const handleForwardRequest = async (step) => {
    const timestamp = new Date().toISOString();
    const stepMap = {
      3: 'forwardedToColAt',
      4: 'receivedByLibraryAt', 
      5: 'handedToMS3At',
      6: 'closedAt'
    };

    console.log('Sending forward request:', { step, timestamp, initiator, officers });

    try {
      const response = await fetch('http://localhost:3001/api/workflow/forward', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          step,
          timestamp,
          initiator,
          officers
        })
      });

      if (response.ok) {
        const result = await response.json();
        setWorkflow(prev => ({
          ...prev,
          [stepMap[step]]: timestamp
        }));
        alert(`Request forwarded successfully at step ${step}!`);
        console.log('Step completed:', result);
      } else {
        // Log the full error response
        const errorText = await response.text();
        console.error('Backend error response:', errorText);
        
        try {
          const error = JSON.parse(errorText);
          alert(`Error: ${error.error || error.message || 'Failed to forward request'}`);
          console.error('Parsed error:', error);
        } catch (parseError) {
          alert(`Server error: ${response.status} - ${errorText}`);
          console.error('Raw error response:', errorText);
        }
      }
    } catch (error) {
      console.error('Network error:', error);
      // Fallback to local state update if backend is not available
      setWorkflow(prev => ({
        ...prev,
        [stepMap[step]]: timestamp
      }));
      alert(`Step ${step} completed locally (backend not available)`);
    }
  };

  // Clear form function (optional - for resetting the form)
  const clearForm = () => {
    setInitiator('');
    setOfficers([{
      id: 1, 
      icNo: '', 
      name: '', 
      deputation: '', 
      colMS3Approval: '', 
      brigBApproval: '', 
      addlMSAApproval: '', 
      brigMSCApproval: '', 
      addlMSBApproval: '' 
    }]);
    setWorkflow({
      initiatedAt: null,
      forwardedToColAt: null,
      receivedByLibraryAt: null,
      handedToMS3At: null,
      closedAt: null
    });
  };

  // Render different views based on currentView state
  const renderCurrentView = () => {
    switch (currentView) {
      case 'create':
        return (
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <WorkflowHeader />
            
            <div className="space-y-6">
              <InitiatorSection 
                initiator={initiator}
                setInitiator={setInitiator}
                onInitiate={handleInitiate}
                initiatedAt={workflow.initiatedAt}
              />
              
              <OfficersTable 
                officers={officers}
                onAddOfficer={addOfficerRow}
                onRemoveOfficer={removeOfficerRow}
                onUpdateOfficer={updateOfficer}
              />
              
              <ForwardSteps 
                workflow={workflow}
                onForwardRequest={handleForwardRequest}
              />

              {/* Clear Form Button */}
              <div className="text-center pt-6">
                <button
                  onClick={clearForm}
                  className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors font-medium"
                >
                  Clear Form
                </button>
              </div>
            </div>
          </div>
        );
      
      case 'dashboard':
        return <AdminDashboard />;
      
      case 'list':
        return <WorkflowList />;
      
      default:
        return (
          <div className="max-w-6xl mx-auto p-6">
            <div className="text-center py-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">View Not Found</h2>
              <p className="text-gray-600 mb-6">The requested view could not be found.</p>
              <button
                onClick={() => setCurrentView('create')}
                className="px-6 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
              >
                Go to Create Workflow
              </button>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Navigation Bar */}
      <Navigation 
        currentView={currentView} 
        setCurrentView={setCurrentView} 
      />
      
      {/* Main Content Area */}
      <main className="pb-8">
        {renderCurrentView()}
      </main>
      
      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-6 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-sm text-gray-500">
              Approval Workflow Management System © {new Date().getFullYear()}
            </p>
            <p className="text-xs text-gray-400 mt-1">
              Streamlining approval processes with digital efficiency
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;