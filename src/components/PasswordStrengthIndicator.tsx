import React from 'react';
import { PasswordStrengthResult } from '../types';
import { Shield, ShieldAlert, ShieldCheck, ShieldX } from 'lucide-react';

interface PasswordStrengthIndicatorProps {
  strengthResult: PasswordStrengthResult;
  className?: string;
}

const strengthConfig = {
  'weak': {
    color: 'text-red-600',
    bgColor: 'bg-red-100',
    borderColor: 'border-red-200',
    icon: ShieldX,
    label: 'Weak',
    description: 'This password is vulnerable to attacks'
  },
  'fair': {
    color: 'text-orange-600',
    bgColor: 'bg-orange-100',
    borderColor: 'border-orange-200',
    icon: ShieldAlert,
    label: 'Fair',
    description: 'This password could be stronger'
  },
  'good': {
    color: 'text-yellow-600',
    bgColor: 'bg-yellow-100',
    borderColor: 'border-yellow-200',
    icon: Shield,
    label: 'Good',
    description: 'This password is decent but could be better'
  },
  'strong': {
    color: 'text-blue-600',
    bgColor: 'bg-blue-100',
    borderColor: 'border-blue-200',
    icon: ShieldCheck,
    label: 'Strong',
    description: 'This password is strong and secure'
  },
  'very-strong': {
    color: 'text-emerald-600',
    bgColor: 'bg-emerald-100',
    borderColor: 'border-emerald-200',
    icon: ShieldCheck,
    label: 'Very Strong',
    description: 'This password is extremely secure'
  }
};

export function PasswordStrengthIndicator({ strengthResult, className = '' }: PasswordStrengthIndicatorProps) {
  const config = strengthConfig[strengthResult.strength];
  const IconComponent = config.icon;

  return (
    <div className={`${className}`}>
      <div className="flex items-center gap-3 mb-3">
        <div className={`p-2 rounded-lg ${config.bgColor} ${config.borderColor} border`}>
          <IconComponent className={`w-5 h-5 ${config.color}`} />
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between mb-1">
            <span className={`font-medium ${config.color}`}>{config.label}</span>
            <span className="text-sm text-gray-500">{strengthResult.score}/100</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className={`h-2 rounded-full transition-all duration-500 ${
                strengthResult.strength === 'weak' ? 'bg-red-500' :
                strengthResult.strength === 'fair' ? 'bg-orange-500' :
                strengthResult.strength === 'good' ? 'bg-yellow-500' :
                strengthResult.strength === 'strong' ? 'bg-blue-500' : 'bg-emerald-500'
              }`}
              style={{ width: `${strengthResult.score}%` }}
            />
          </div>
        </div>
      </div>
      
      <p className="text-sm text-gray-600 mb-2">{config.description}</p>
      
      {strengthResult.feedback.length > 0 && (
        <div className="space-y-1">
          <p className="text-sm font-medium text-gray-700">Suggestions:</p>
          <ul className="text-sm text-gray-600 space-y-1">
            {strengthResult.feedback.map((suggestion, index) => (
              <li key={index} className="flex items-start gap-2">
                <span className="text-gray-400 mt-1">•</span>
                <span>{suggestion}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}