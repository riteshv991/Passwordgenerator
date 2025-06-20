import React from 'react';
import { PasswordOptions } from '../types';
import { Settings, Minus, Plus } from 'lucide-react';

interface PasswordOptionsProps {
  options: PasswordOptions;
  onChange: (options: PasswordOptions) => void;
  onGenerate: () => void;
  isGenerating: boolean;
}

export function PasswordOptionsComponent({ options, onChange, onGenerate, isGenerating }: PasswordOptionsProps) {
  const updateOption = (key: keyof PasswordOptions, value: boolean | number) => {
    onChange({ ...options, [key]: value });
  };

  const adjustLength = (increment: number) => {
    const newLength = Math.max(4, Math.min(128, options.length + increment));
    updateOption('length', newLength);
  };

  const hasAtLeastOneOption = options.includeUppercase || options.includeLowercase || 
                              options.includeNumbers || options.includeSymbols;

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-indigo-100 rounded-lg">
          <Settings className="w-5 h-5 text-indigo-600" />
        </div>
        <h2 className="text-xl font-semibold text-gray-800">Password Options</h2>
      </div>

      <div className="space-y-6">
        {/* Password Length */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Password Length: {options.length} characters
          </label>
          <div className="flex items-center gap-4">
            <button
              onClick={() => adjustLength(-1)}
              disabled={options.length <= 4}
              className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Minus className="w-4 h-4" />
            </button>
            <div className="flex-1">
              <input
                type="range"
                min="4"
                max="128"
                value={options.length}
                onChange={(e) => updateOption('length', parseInt(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>4</span>
                <span>128</span>
              </div>
            </div>
            <button
              onClick={() => adjustLength(1)}
              disabled={options.length >= 128}
              className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Character Types */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Include Character Types
          </label>
          <div className="space-y-3">
            <label className="flex items-center gap-3 cursor-pointer group">
              <input
                type="checkbox"
                checked={options.includeUppercase}
                onChange={(e) => updateOption('includeUppercase', e.target.checked)}
                className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500 focus:ring-2"
              />
              <span className="text-sm text-gray-700 group-hover:text-gray-900 transition-colors">
                Uppercase Letters (A-Z)
              </span>
            </label>
            
            <label className="flex items-center gap-3 cursor-pointer group">
              <input
                type="checkbox"
                checked={options.includeLowercase}
                onChange={(e) => updateOption('includeLowercase', e.target.checked)}
                className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500 focus:ring-2"
              />
              <span className="text-sm text-gray-700 group-hover:text-gray-900 transition-colors">
                Lowercase Letters (a-z)
              </span>
            </label>
            
            <label className="flex items-center gap-3 cursor-pointer group">
              <input
                type="checkbox"
                checked={options.includeNumbers}
                onChange={(e) => updateOption('includeNumbers', e.target.checked)}
                className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500 focus:ring-2"
              />
              <span className="text-sm text-gray-700 group-hover:text-gray-900 transition-colors">
                Numbers (0-9)
              </span>
            </label>
            
            <label className="flex items-center gap-3 cursor-pointer group">
              <input
                type="checkbox"
                checked={options.includeSymbols}
                onChange={(e) => updateOption('includeSymbols', e.target.checked)}
                className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500 focus:ring-2"
              />
              <span className="text-sm text-gray-700 group-hover:text-gray-900 transition-colors">
                Special Characters (!@#$%^&*)
              </span>
            </label>
          </div>
        </div>

        {/* Additional Options */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Additional Options
          </label>
          <label className="flex items-center gap-3 cursor-pointer group">
            <input
              type="checkbox"
              checked={options.excludeSimilar}
              onChange={(e) => updateOption('excludeSimilar', e.target.checked)}
              className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500 focus:ring-2"
            />
            <span className="text-sm text-gray-700 group-hover:text-gray-900 transition-colors">
              Exclude Similar Characters (i, l, 1, L, o, 0, O)
            </span>
          </label>
        </div>

        {/* Generate Button */}
        <button
          onClick={onGenerate}
          disabled={!hasAtLeastOneOption || isGenerating}
          className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-medium py-3 px-4 rounded-lg transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]"
        >
          {isGenerating ? 'Generating...' : 'Generate Password'}
        </button>

        {!hasAtLeastOneOption && (
          <p className="text-sm text-red-600 text-center">
            Please select at least one character type
          </p>
        )}
      </div>
    </div>
  );
}