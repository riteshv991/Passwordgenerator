import React, { useState } from 'react';
import { GeneratedPassword } from '../types';
import { History, Copy, Check, Download, Trash2, Eye, EyeOff } from 'lucide-react';
import { PasswordStrengthIndicator } from './PasswordStrengthIndicator';
import { calculatePasswordStrength } from '../utils/passwordGenerator';

interface PasswordHistoryProps {
  passwords: GeneratedPassword[];
  onClear: () => void;
  onExport: () => void;
}

export function PasswordHistory({ passwords, onClear, onExport }: PasswordHistoryProps) {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [visiblePasswords, setVisiblePasswords] = useState<Set<string>>(new Set());

  const handleCopy = async (password: string, id: string) => {
    try {
      await navigator.clipboard.writeText(password);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      console.error('Failed to copy password:', err);
    }
  };

  const togglePasswordVisibility = (id: string) => {
    const newVisible = new Set(visiblePasswords);
    if (newVisible.has(id)) {
      newVisible.delete(id);
    } else {
      newVisible.add(id);
    }
    setVisiblePasswords(newVisible);
  };

  if (passwords.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-gray-100 rounded-lg">
            <History className="w-5 h-5 text-gray-600" />
          </div>
          <h2 className="text-xl font-semibold text-gray-800">Password History</h2>
        </div>
        <div className="text-center py-8">
          <p className="text-gray-500">No passwords generated yet</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gray-100 rounded-lg">
            <History className="w-5 h-5 text-gray-600" />
          </div>
          <h2 className="text-xl font-semibold text-gray-800">Password History</h2>
          <span className="bg-gray-100 text-gray-600 text-sm px-2 py-1 rounded-full">
            {passwords.length}
          </span>
        </div>
        <div className="flex gap-2">
          <button
            onClick={onExport}
            className="p-2 rounded-lg bg-emerald-100 hover:bg-emerald-200 text-emerald-600 transition-colors"
            title="Export passwords"
          >
            <Download className="w-5 h-5" />
          </button>
          <button
            onClick={onClear}
            className="p-2 rounded-lg bg-red-100 hover:bg-red-200 text-red-600 transition-colors"
            title="Clear history"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="space-y-4 max-h-96 overflow-y-auto">
        {passwords.map((item) => {
          const isVisible = visiblePasswords.has(item.id);
          const strengthResult = calculatePasswordStrength(item.password);
          
          return (
            <div key={item.id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="font-mono text-sm bg-gray-50 px-2 py-1 rounded break-all">
                      {isVisible ? item.password : '•'.repeat(item.password.length)}
                    </div>
                    <button
                      onClick={() => togglePasswordVisibility(item.id)}
                      className="p-1 rounded hover:bg-gray-100"
                    >
                      {isVisible ? (
                        <EyeOff className="w-4 h-4 text-gray-600" />
                      ) : (
                        <Eye className="w-4 h-4 text-gray-600" />
                      )}
                    </button>
                    <button
                      onClick={() => handleCopy(item.password, item.id)}
                      className="p-1 rounded hover:bg-gray-100"
                    >
                      {copiedId === item.id ? (
                        <Check className="w-4 h-4 text-emerald-600" />
                      ) : (
                        <Copy className="w-4 h-4 text-gray-600" />
                      )}
                    </button>
                  </div>
                  <div className="text-xs text-gray-500 mb-2">
                    Generated on {item.timestamp.toLocaleString()}
                  </div>
                  <div className="text-xs text-gray-600">
                    Length: {item.options.length} • 
                    {item.options.includeUppercase && ' Uppercase'} •
                    {item.options.includeLowercase && ' Lowercase'} •
                    {item.options.includeNumbers && ' Numbers'} •
                    {item.options.includeSymbols && ' Symbols'}
                  </div>
                </div>
              </div>
              <div className="text-xs">
                <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                  strengthResult.strength === 'weak' ? 'bg-red-100 text-red-800' :
                  strengthResult.strength === 'fair' ? 'bg-orange-100 text-orange-800' :
                  strengthResult.strength === 'good' ? 'bg-yellow-100 text-yellow-800' :
                  strengthResult.strength === 'strong' ? 'bg-blue-100 text-blue-800' :
                  'bg-emerald-100 text-emerald-800'
                }`}>
                  {strengthResult.strength.charAt(0).toUpperCase() + strengthResult.strength.slice(1).replace('-', ' ')}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}