import React, { useState } from 'react';
import { Tab } from '@headlessui/react';
import { 
  DocumentTextIcon, 
  CogIcon, 
  ShieldCheckIcon,
  TrashIcon,
  PlusIcon
} from '@heroicons/react/24/outline';
import { useAPIStore } from '../../stores/apiStore';
import TokenUsageIndicator from './TokenUsageIndicator';
import { toast } from 'react-hot-toast';

interface KnowledgeDocument {
  id: string;
  name: string;
  size: number;
  uploadedAt: string;
}

interface Rule {
  id: string;
  type: 'positive' | 'negative';
  content: string;
}

const ConfigurationPage: React.FC = () => {
  const [knowledgeDocs, setKnowledgeDocs] = useState<KnowledgeDocument[]>([]);
  const [positiveRules, setPositiveRules] = useState<Rule[]>([]);
  const [negativeRules, setNegativeRules] = useState<Rule[]>([]);
  const [newRule, setNewRule] = useState('');
  const [ruleType, setRuleType] = useState<'positive' | 'negative'>('positive');
  const [tokenLimitBypass, setTokenLimitBypass] = useState(false);
  const [maxTokens, setMaxTokens] = useState({
    'gpt-3.5': 4096,
    'gpt-4': 8192
  });
  const [selectedModel, setSelectedModel] = useState('gpt-3.5');
  const [tokenUsage, setTokenUsage] = useState({
    input: 0,
    output: 0,
    total: 0
  });

  const handleDocumentUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    if (knowledgeDocs.length + files.length > 5) {
      toast.error('You can only upload a maximum of 5 knowledge documents');
      return;
    }

    const newDocs = files.map(file => ({
      id: crypto.randomUUID(),
      name: file.name,
      size: file.size,
      uploadedAt: new Date().toISOString()
    }));

    setKnowledgeDocs(prev => [...prev, ...newDocs]);
    toast.success('Document(s) uploaded successfully');
  };

  const handleDeleteDocument = (id: string) => {
    setKnowledgeDocs(prev => prev.filter(doc => doc.id !== id));
    toast.success('Document deleted');
  };

  const handleAddRule = () => {
    if (!newRule.trim()) return;

    const rule: Rule = {
      id: crypto.randomUUID(),
      type: ruleType,
      content: newRule.trim()
    };

    if (ruleType === 'positive') {
      setPositiveRules(prev => [...prev, rule]);
    } else {
      setNegativeRules(prev => [...prev, rule]);
    }

    setNewRule('');
    toast.success(`${ruleType === 'positive' ? 'Positive' : 'Negative'} rule added`);
  };

  const handleDeleteRule = (id: string, type: 'positive' | 'negative') => {
    if (type === 'positive') {
      setPositiveRules(prev => prev.filter(rule => rule.id !== id));
    } else {
      setNegativeRules(prev => prev.filter(rule => rule.id !== id));
    }
    toast.success('Rule deleted');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-200 mb-8">Configuration</h1>

      <Tab.Group>
        <Tab.List className="flex space-x-2 rounded-xl bg-gray-800 p-1 mb-8">
          <Tab className={({ selected }) =>
            `w-full rounded-lg py-2.5 text-sm font-medium leading-5 transition-all
            ${selected 
              ? 'bg-gradient-to-r from-[#47FFFF] to-[#FF47FF] text-white shadow'
              : 'text-gray-400 hover:text-gray-200 hover:bg-gray-700'
            }`
          }>
            <div className="flex items-center justify-center space-x-2">
              <DocumentTextIcon className="w-5 h-5" />
              <span>Knowledge Documents</span>
            </div>
          </Tab>
          <Tab className={({ selected }) =>
            `w-full rounded-lg py-2.5 text-sm font-medium leading-5 transition-all
            ${selected 
              ? 'bg-gradient-to-r from-[#FF47FF] to-[#7F47FF] text-white shadow'
              : 'text-gray-400 hover:text-gray-200 hover:bg-gray-700'
            }`
          }>
            <div className="flex items-center justify-center space-x-2">
              <ShieldCheckIcon className="w-5 h-5" />
              <span>Token Management</span>
            </div>
          </Tab>
          <Tab className={({ selected }) =>
            `w-full rounded-lg py-2.5 text-sm font-medium leading-5 transition-all
            ${selected 
              ? 'bg-gradient-to-r from-[#7F47FF] to-[#47FFFF] text-white shadow'
              : 'text-gray-400 hover:text-gray-200 hover:bg-gray-700'
            }`
          }>
            <div className="flex items-center justify-center space-x-2">
              <CogIcon className="w-5 h-5" />
              <span>Model Settings</span>
            </div>
          </Tab>
        </Tab.List>

        <Tab.Panels>
          {/* Knowledge Documents Panel */}
          <Tab.Panel>
            <div className="bg-gray-800 rounded-lg p-6 space-y-8">
              {/* Document Upload */}
              <div>
                <h2 className="text-lg font-medium text-gray-200 mb-4">Knowledge Documents</h2>
                <div className="flex justify-between items-center mb-4">
                  <p className="text-sm text-gray-400">
                    Upload up to 5 documents to improve prompt generation
                  </p>
                  <label className="flex items-center px-4 py-2 text-sm text-white bg-gradient-to-r from-[#47FFFF] to-[#FF47FF] rounded-lg hover:opacity-90 cursor-pointer">
                    <PlusIcon className="w-5 h-5 mr-2" />
                    Upload Document
                    <input
                      type="file"
                      onChange={handleDocumentUpload}
                      className="hidden"
                      multiple
                      accept=".txt,.md,.pdf"
                      disabled={knowledgeDocs.length >= 5}
                    />
                  </label>
                </div>

                {/* Document List */}
                <div className="space-y-4">
                  {knowledgeDocs.map(doc => (
                    <div key={doc.id} className="flex items-center justify-between bg-gray-700 rounded-lg p-4">
                      <div>
                        <h3 className="text-gray-200 font-medium">{doc.name}</h3>
                        <p className="text-sm text-gray-400">
                          {(doc.size / 1024).toFixed(1)} KB • Uploaded {new Date(doc.uploadedAt).toLocaleDateString()}
                        </p>
                      </div>
                      <button
                        onClick={() => handleDeleteDocument(doc.id)}
                        className="p-2 text-gray-400 hover:text-red-400"
                      >
                        <TrashIcon className="w-5 h-5" />
                      </button>
                    </div>
                  ))}

                  {knowledgeDocs.length === 0 && (
                    <div className="text-center py-8 text-gray-400">
                      No documents uploaded yet
                    </div>
                  )}
                </div>
              </div>

              {/* Rules */}
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-200 mb-4">Generation Rules</h3>
                  <div className="flex space-x-4 mb-4">
                    <input
                      type="text"
                      value={newRule}
                      onChange={(e) => setNewRule(e.target.value)}
                      placeholder="Enter a new rule..."
                      className="flex-1 bg-gray-700 text-gray-200 border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    />
                    <select
                      value={ruleType}
                      onChange={(e) => setRuleType(e.target.value as 'positive' | 'negative')}
                      className="bg-gray-700 text-gray-200 border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="positive">Positive</option>
                      <option value="negative">Negative</option>
                    </select>
                    <button
                      onClick={handleAddRule}
                      disabled={!newRule.trim()}
                      className="px-4 py-2 text-white bg-gradient-to-r from-[#47FFFF] to-[#FF47FF] rounded-md hover:opacity-90 disabled:opacity-50"
                    >
                      Add Rule
                    </button>
                  </div>

                  {/* Rules Lists */}
                  <div className="grid grid-cols-2 gap-6">
                    {/* Positive Rules */}
                    <div>
                      <h4 className="text-sm font-medium text-gray-200 mb-2">Positive Rules</h4>
                      <div className="space-y-2">
                        {positiveRules.map(rule => (
                          <div key={rule.id} className="flex items-center justify-between bg-gray-700 rounded-lg p-3">
                            <span className="text-gray-200">{rule.content}</span>
                            <button
                              onClick={() => handleDeleteRule(rule.id, 'positive')}
                              className="p-1 text-gray-400 hover:text-red-400"
                            >
                              <TrashIcon className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Negative Rules */}
                    <div>
                      <h4 className="text-sm font-medium text-gray-200 mb-2">Negative Rules</h4>
                      <div className="space-y-2">
                        {negativeRules.map(rule => (
                          <div key={rule.id} className="flex items-center justify-between bg-gray-700 rounded-lg p-3">
                            <span className="text-gray-200">{rule.content}</span>
                            <button
                              onClick={() => handleDeleteRule(rule.id, 'negative')}
                              className="p-1 text-gray-400 hover:text-red-400"
                            >
                              <TrashIcon className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Tab.Panel>

          {/* Token Management Panel */}
          <Tab.Panel>
            <div className="bg-gray-800 rounded-lg p-6 space-y-8">
              <div>
                <h2 className="text-lg font-medium text-gray-200 mb-4">Token Usage</h2>
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-gray-700 rounded-lg p-4">
                    <p className="text-sm text-gray-400">Input Tokens</p>
                    <p className="text-2xl font-bold text-gray-200">{tokenUsage.input}</p>
                  </div>
                  <div className="bg-gray-700 rounded-lg p-4">
                    <p className="text-sm text-gray-400">Output Tokens</p>
                    <p className="text-2xl font-bold text-gray-200">{tokenUsage.output}</p>
                  </div>
                  <div className="bg-gray-700 rounded-lg p-4">
                    <p className="text-sm text-gray-400">Total Tokens</p>
                    <p className="text-2xl font-bold text-gray-200">{tokenUsage.total}</p>
                  </div>
                </div>
              </div>

              <div>
                <h2 className="text-lg font-medium text-gray-200 mb-4">Token Limits</h2>
                <div className="space-y-4">
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={tokenLimitBypass}
                      onChange={(e) => setTokenLimitBypass(e.target.checked)}
                      className="rounded border-gray-600 bg-gray-700 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-gray-200">Enable Token Limit Bypass</span>
                  </label>

                  {tokenLimitBypass && (
                    <div className="bg-yellow-900/20 border border-yellow-700/50 rounded-lg p-4 mb-4">
                      <p className="text-yellow-400 text-sm">
                        Warning: Bypassing token limits may result in increased API costs and potential errors
                      </p>
                    </div>
                  )}

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-200 mb-2">
                        GPT-3.5 Max Tokens
                      </label>
                      <input
                        type="number"
                        value={maxTokens['gpt-3.5']}
                        onChange={(e) => setMaxTokens(prev => ({ ...prev, 'gpt-3.5': parseInt(e.target.value) }))}
                        className="w-full bg-gray-700 text-gray-200 border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-200 mb-2">
                        GPT-4 Max Tokens
                      </label>
                      <input
                        type="number"
                        value={maxTokens['gpt-4']}
                        onChange={(e) => setMaxTokens(prev => ({ ...prev, 'gpt-4': parseInt(e.target.value) }))}
                        className="w-full bg-gray-700 text-gray-200 border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Tab.Panel>

          {/* Model Settings Panel */}
          <Tab.Panel>
            <div className="bg-gray-800 rounded-lg p-6 space-y-8">
              <div>
                <h2 className="text-lg font-medium text-gray-200 mb-4">OpenAI Model Selection</h2>
                <div className="grid grid-cols-2 gap-4">
                  <div
                    className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                      selectedModel === 'gpt-3.5'
                        ? 'border-[#47FFFF] bg-gray-700'
                        : 'border-gray-700 hover:border-gray-600'
                    }`}
                    onClick={() => setSelectedModel('gpt-3.5')}
                  >
                    <h3 className="text-gray-200 font-medium">GPT-3.5</h3>
                    <p className="text-sm text-gray-400 mt-1">Fast and efficient for most tasks</p>
                    <div className="mt-2 text-sm text-gray-400">
                      <p>Max Tokens: 4,096</p>
                      <p>Context Window: 4,096 tokens</p>
                    </div>
                  </div>

                  <div
                    className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                      selectedModel === 'gpt-4'
                        ? 'border-[#FF47FF] bg-gray-700'
                        : 'border-gray-700 hover:border-gray-600'
                    }`}
                    onClick={() => setSelectedModel('gpt-4')}
                  >
                    <h3 className="text-gray-200 font-medium">GPT-4</h3>
                    <p className="text-sm text-gray-400 mt-1">Most capable model for complex tasks</p>
                    <div className="mt-2 text-sm text-gray-400">
                      <p>Max Tokens: 8,192</p>
                      <p>Context Window: 8,192 tokens</p>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h2 className="text-lg font-medium text-gray-200 mb-4">Model Performance</h2>
                <div className="bg-gray-700 rounded-lg p-4">
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-gray-400">Average Processing Time</p>
                      <p className="text-2xl font-bold text-gray-200">
                        {selectedModel === 'gpt-3.5' ? '2.3s' : '4.8s'}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">Token Usage Efficiency</p>
                      <div className="h-2 bg-gray-600 rounded-full mt-1">
                        <div
                          className="h-full bg-gradient-to-r from-[#47FFFF] to-[#FF47FF] rounded-full"
                          style={{
                            width: selectedModel === 'gpt-3.5' ? '85%' : '95%'
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Tab.Panel>
        </Tab.Panels>
      </Tab.Group>
    </div>
  );
};

export default ConfigurationPage;