import React, { useState } from 'react';
import { Costs } from '../../types/project-types';

interface CostEditorProps {
  costs: Costs;
  onUpdate: (costs: Costs) => void;
}

const CostEditor: React.FC<CostEditorProps> = ({ costs, onUpdate }) => {
  const [editing, setEditing] = useState(false);
  const [editedCosts, setEditedCosts] = useState(costs);
  const [hasChanges, setHasChanges] = useState(false);

  const handleUpdate = (key: keyof Costs, value: string) => {
    const numValue = parseInt(value.replace(/[^0-9]/g, ''), 10) || 0;
    const newCosts = {
      ...editedCosts,
      [key]: numValue
    };
    
    // Recalculate total and contingency
    const subtotal = 
      newCosts.development + 
      newCosts.design + 
      newCosts.qa + 
      newCosts.infrastructure + 
      newCosts.licenses + 
      newCosts.management;
    
    newCosts.contingency = Math.round(subtotal * 0.15);
    newCosts.total = subtotal + newCosts.contingency;
    
    setEditedCosts(newCosts);
    setHasChanges(true);
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Project Cost Breakdown</h2>
        <div className="flex space-x-3">
          {editing ? (
            <>
              <button
                onClick={() => {
                  setEditedCosts(costs);
                  setEditing(false);
                  setHasChanges(false);
                }}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  onUpdate(editedCosts);
                  setEditing(false);
                  setHasChanges(false);
                }}
                disabled={!hasChanges}
                className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-[#47FFFF] to-[#FF47FF] rounded-md hover:opacity-90 disabled:opacity-50"
              >
                Save Changes
              </button>
            </>
          ) : (
            <button
              onClick={() => setEditing(true)}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
            >
              Edit Costs
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {Object.entries(editedCosts).map(([key, value]) => (
          key !== 'total' && key !== 'contingency' ? (
            <div key={key} className="bg-gray-50 rounded-lg p-4">
              <div className="text-sm font-medium text-gray-500 mb-2">
                {key.charAt(0).toUpperCase() + key.slice(1)}
              </div>
              {editing ? (
                <input
                  type="text"
                  value={`$${value.toLocaleString()}`}
                  onChange={(e) => handleUpdate(key as keyof Costs, e.target.value)}
                  className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                />
              ) : (
                <div className="text-2xl font-bold text-gray-900">
                  ${value.toLocaleString()}
                </div>
              )}
            </div>
          ) : null
        ))}
      </div>

      <div className="mt-8 bg-gray-50 rounded-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <span className="text-gray-600 font-medium">Contingency (15%)</span>
          <span className="text-xl font-semibold text-gray-900">
            ${editedCosts.contingency.toLocaleString()}
          </span>
        </div>
        <div className="flex justify-between items-center pt-4 border-t border-gray-200">
          <span className="text-lg font-bold text-gray-900">Total Investment</span>
          <span className="text-2xl font-bold text-[#0073E6]">
            ${editedCosts.total.toLocaleString()}
          </span>
        </div>
      </div>
    </div>
  );
};

export default CostEditor;