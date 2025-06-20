import React, { useState, useCallback } from 'react';
import { Key, Shield, Download } from 'lucide-react';
import { PasswordOptions, GeneratedPassword } from './types';
import { generatePassword } from './utils/passwordGenerator';
import { PasswordOptionsComponent } from './components/PasswordOptions';
import { GeneratedPassword as GeneratedPasswordComponent } from './components/GeneratedPassword';
import { PasswordHistory } from './components/PasswordHistory';

function App() {
  const [options, setOptions] = useState<PasswordOptions>({
    length: 16,
    includeUppercase: true,
    includeLowercase: true,
    includeNumbers: true,
    includeSymbols: true,
    excludeSimilar: false,
  });

  const [currentPassword, setCurrentPassword] = useState<string>('');
  const [passwordHistory, setPasswordHistory] = useState<GeneratedPassword[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGeneratePassword = useCallback(async () => {
    setIsGenerating(true);
    
    // Add a small delay for better UX
    await new Promise(resolve => setTimeout(resolve, 200));
    
    try {
      const newPassword = generatePassword(options);
      setCurrentPassword(newPassword);
      
      const passwordEntry: GeneratedPassword = {
        id: crypto.randomUUID(),
        password: newPassword,
        strength: 'strong', // This will be calculated by the component
        timestamp: new Date(),
        options: { ...options },
      };
      
      setPasswordHistory(prev => [passwordEntry, ...prev.slice(0, 49)]); // Keep last 50
    } catch (error) {
      console.error('Error generating password:', error);
    } finally {
      setIsGenerating(false);
    }
  }, [options]);

  const handleClearHistory = () => {
    setPasswordHistory([]);
  };

  const handleExportPasswords = () => {
    const data = passwordHistory.map(p => ({
      password: p.password,
      timestamp: p.timestamp.toISOString(),
      length: p.options.length,
      options: p.options,
    }));
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `passwords-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-emerald-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-600 rounded-2xl mb-4">
            <Key className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Secure Password Generator
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Create strong, unique passwords to protect your accounts and sensitive information. 
            Customize your password criteria and generate secure passwords in seconds.
          </p>
        </div>

        {/* Main Content */}
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Password Options */}
            <div>
              <PasswordOptionsComponent
                options={options}
                onChange={setOptions}
                onGenerate={handleGeneratePassword}
                isGenerating={isGenerating}
              />
            </div>

            {/* Generated Password */}
            <div>
              <GeneratedPasswordComponent
                password={currentPassword}
                onRegenerate={handleGeneratePassword}
                isGenerating={isGenerating}
              />
            </div>
          </div>

          {/* Password History */}
          <div className="mb-8">
            <PasswordHistory
              passwords={passwordHistory}
              onClear={handleClearHistory}
              onExport={handleExportPasswords}
            />
          </div>

          {/* Security Tips */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-emerald-100 rounded-lg">
                <Shield className="w-5 h-5 text-emerald-600" />
              </div>
              <h2 className="text-xl font-semibold text-gray-800">Security Best Practices</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-medium text-gray-800 mb-2">Password Guidelines</h3>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Use at least 12 characters for better security</li>
                  <li>• Include a mix of uppercase, lowercase, numbers, and symbols</li>
                  <li>• Avoid using personal information or common words</li>
                  <li>• Don't reuse passwords across different accounts</li>
                </ul>
              </div>
              <div>
                <h3 className="font-medium text-gray-800 mb-2">Storage Tips</h3>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Use a reputable password manager</li>
                  <li>• Enable two-factor authentication when available</li>
                  <li>• Never share passwords via email or text</li>
                  <li>• Regularly update passwords for important accounts</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;