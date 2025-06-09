// src/components/OfficersTable.js
import React from 'react';
import { Plus, Trash2 } from 'lucide-react';

const OfficersTable = ({ officers, onAddOfficer, onRemoveOfficer, onUpdateOfficer }) => {
  return (
    <div className="mb-8 p-4 border-2 border-orange-400 rounded-lg bg-orange-50">
      <div className="font-bold text-lg mb-4 text-orange-700">
        2) List of officers seeking open extracts:
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full border-collapse border-2 border-orange-400">
          <thead>
            <tr className="bg-orange-200">
              <th className="border border-orange-400 p-2 text-left">Ser.No.</th>
              <th className="border border-orange-400 p-2 text-left">IC No.</th>
              <th className="border border-orange-400 p-2 text-left">Name</th>
              <th className="border border-orange-400 p-2 text-left">Deputation</th>
              <th className="border border-orange-400 p-2 text-center">Approved by Col MS 3</th>
              <th className="border border-orange-400 p-2 text-center">Approved by Brig B</th>
              <th className="border border-orange-400 p-2 text-center">Approved by Addl MS(A)</th>
              <th className="border border-orange-400 p-2 text-center">Approved by Brig MS(C)</th>
              <th className="border border-orange-400 p-2 text-center">Approved by Addl MS(B)</th>
              <th className="border border-orange-400 p-2 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {officers.map((officer, index) => (
              <OfficerRow
                key={officer.id}
                officer={officer}
                index={index}
                onUpdate={onUpdateOfficer}
                onRemove={onRemoveOfficer}
                canRemove={officers.length > 1}
              />
            ))}
          </tbody>
        </table>
      </div>
      
      <button
        onClick={onAddOfficer}
        className="mt-4 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 flex items-center gap-2"
      >
        <Plus size={16} />
        Add Officer
      </button>
    </div>
  );
};

const OfficerRow = ({ officer, index, onUpdate, onRemove, canRemove }) => {
  return (
    <tr className="bg-orange-25">
      <td className="border border-orange-400 p-2 text-center">{index + 1}</td>
      <td className="border border-orange-400 p-2">
        <input
          type="text"
          value={officer.icNo}
          onChange={(e) => onUpdate(officer.id, 'icNo', e.target.value)}
          className="w-full p-1 border border-gray-300 rounded focus:border-orange-500 focus:outline-none"
          placeholder="IC Number"
        />
      </td>
      <td className="border border-orange-400 p-2">
        <input
          type="text"
          value={officer.name}
          onChange={(e) => onUpdate(officer.id, 'name', e.target.value)}
          className="w-full p-1 border border-gray-300 rounded focus:border-orange-500 focus:outline-none"
          placeholder="Officer Name"
        />
      </td>
      <td className="border border-orange-400 p-2">
        <input
          type="text"
          value={officer.department}
          onChange={(e) => onUpdate(officer.id, 'department', e.target.value)}
          className="w-full p-1 border border-gray-300 rounded focus:border-orange-500 focus:outline-none"
          placeholder="Department"
        />
      </td>
      <td className="border border-orange-400 p-2 text-center">
        <input
          type="checkbox"
          checked={officer.requestedBy}
          onChange={(e) => onUpdate(officer.id, 'requestedBy', e.target.checked)}
          className="w-4 h-4 text-orange-600 border-2 border-orange-300 rounded focus:ring-orange-500"
        />
      </td>
      <td className="border border-orange-400 p-2 text-center">
        <input
          type="checkbox"
          checked={officer.adjApproval}
          onChange={(e) => onUpdate(officer.id, 'adjApproval', e.target.checked)}
          className="w-4 h-4 text-orange-600 border-2 border-orange-300 rounded focus:ring-orange-500"
        />
      </td>
      <td className="border border-orange-400 p-2 text-center">
        <input
          type="checkbox"
          checked={officer.brigadeApproval}
          onChange={(e) => onUpdate(officer.id, 'brigadeApproval', e.target.checked)}
          className="w-4 h-4 text-orange-600 border-2 border-orange-300 rounded focus:ring-orange-500"
        />
      </td>
      <td className="border border-orange-400 p-2 text-center">
        <input
          type="checkbox"
          checked={officer.headApproval}
          onChange={(e) => onUpdate(officer.id, 'headApproval', e.target.checked)}
          className="w-4 h-4 text-orange-600 border-2 border-orange-300 rounded focus:ring-orange-500"
        />
      </td>
      <td className="border border-orange-400 p-2 text-center">
        <button
          onClick={() => onRemove(officer.id)}
          disabled={!canRemove}
          className="text-red-500 hover:text-red-700 disabled:text-gray-300 disabled:cursor-not-allowed"
        >
          <Trash2 size={16} />
        </button>
      </td>
    </tr>
  );
};

export default OfficersTable;