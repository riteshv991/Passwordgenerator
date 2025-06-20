import React, { useState } from 'react';
import { Copy, Check, Eye, EyeOff, RefreshCw } from 'lucide-react';
import { PasswordStrengthIndicator } from './PasswordStrengthIndicator';
import { calculatePasswordStrength } from '../utils/passwordGenerator';

interface GeneratedPasswordProps {
  password: string;
  onRegenerate: () => void;
  isGenerating: boolean;
}

export function GeneratedPassword({ password, onRegenerate, isGenerating }: GeneratedPasswordProps) {
  const [copied, setCopied] = useState(false);
  const [showPassword, setShowPassword] = useState(true);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(password);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy password:', err);
    }
  };

  const strengthResult = password ? calculatePasswordStrength(password) : null;

  if (!password) {
    return (
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <RefreshCw className="w-8 h-8 text-gray-400" />
          </div>
          <p className="text-gray-500">Click "Generate Password" to create a secure password</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-800">Generated Password</h2>
        <button
          onClick={onRegenerate}
          disabled={isGenerating}
          className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 disabled:opacity-50 transition-colors"
          title="Generate new password"
        >
          <RefreshCw className={`w-5 h-5 ${isGenerating ? 'animate-spin' : ''}`} />
        </button>
      </div>

      <div className="mb-6">
        <div className="relative">
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 font-mono text-lg break-all">
            {showPassword ? password : '•'.repeat(password.length)}
          </div>
          <div className="absolute right-2 top-2 flex gap-2">
            <button
              onClick={() => setShowPassword(!showPassword)}
              className="p-2 rounded-md bg-white border border-gray-200 hover:bg-gray-50 transition-colors"
              title={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? (
                <EyeOff className="w-4 h-4 text-gray-600" />
              ) : (
                <Eye className="w-4 h-4 text-gray-600" />
              )}
            </button>
            <button
              onClick={handleCopy}
              className="p-2 rounded-md bg-white border border-gray-200 hover:bg-gray-50 transition-colors"
              title="Copy to clipboard"
            >
              {copied ? (
                <Check className="w-4 h-4 text-emerald-600" />
              ) : (
                <Copy className="w-4 h-4 text-gray-600" />
              )}
            </button>
          </div>
        </div>
        
        {copied && (
          <p className="text-sm text-emerald-600 mt-2 flex items-center gap-1">
            <Check className="w-4 h-4" />
            Password copied to clipboard!
          </p>
        )}
      </div>

      {strengthResult && (
        <PasswordStrengthIndicator strengthResult={strengthResult} />
      )}
    </div>
  );
}