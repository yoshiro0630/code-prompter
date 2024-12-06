import React, { useEffect, useCallback } from 'react';
import { useProjectStore } from '../stores/projectStore';
import { ChartBarIcon, DocumentTextIcon, DocumentCheckIcon } from '@heroicons/react/24/outline';

const REFRESH_INTERVAL = 5000; // Refresh every 5 seconds

const ProjectStats: React.FC = () => {
  const { currentProject, repository } = useProjectStore();
  const [stats, setStats] = React.useState({
    totalPrompts: 0,
    processedStages: 0,
    hasDocument: false,
    lastUpdated: new Date()
  });

  const loadStats = useCallback(async () => {
    if (!currentProject) return;

    const doc = await repository.getDocument(currentProject);
    let promptCount = 0;
    let processedStages = 0;

    // Count prompts and processed stages
    for (let stage = 1; stage <= 5; stage++) {
      const prompts = await repository.getPrompts(currentProject, stage);
      promptCount += prompts.length;
      if (prompts.length > 0) {
        processedStages++;
      }
    }

    setStats({
      totalPrompts: promptCount,
      processedStages,
      hasDocument: !!doc?.content,
      lastUpdated: new Date()
    });
  }, [currentProject, repository]);

  // Initial load
  useEffect(() => {
    loadStats();
  }, [loadStats]);

  // Set up auto-refresh
  useEffect(() => {
    const intervalId = setInterval(loadStats, REFRESH_INTERVAL);
    return () => clearInterval(intervalId);
  }, [loadStats]);

  return (
    <div className="grid grid-cols-3 gap-4 mb-6">
      <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-400">Total Prompts</p>
            <p className="text-2xl font-bold text-gray-200">{stats.totalPrompts}</p>
            <p className="text-xs text-gray-400 mt-1">Across {stats.processedStages} stages</p>
          </div>
          <ChartBarIcon className="w-8 h-8 text-[#47FFFF]" />
        </div>
      </div>

      <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-400">Stages Generated</p>
            <p className="text-2xl font-bold text-gray-200">{stats.processedStages}/5</p>
            <p className="text-xs text-gray-400 mt-1">Total stages completed</p>
          </div>
          <DocumentCheckIcon className="w-8 h-8 text-[#FF47FF]" />
        </div>
      </div>

      <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-400">Reference Document</p>
            <p className="text-2xl font-bold text-gray-200">
              {stats.hasDocument ? 'Ready' : 'None'}
            </p>
            <p className="text-xs text-gray-400 mt-1">
              Last updated: {stats.lastUpdated.toLocaleTimeString()}
            </p>
          </div>
          <DocumentTextIcon className="w-8 h-8 text-[#7F47FF]" />
        </div>
      </div>
    </div>
  );
};

export default ProjectStats;