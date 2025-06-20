import { PasswordOptions, PasswordStrength, PasswordStrengthResult } from '../types';

const LOWERCASE = 'abcdefghijklmnopqrstuvwxyz';
const UPPERCASE = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const NUMBERS = '0123456789';
const SYMBOLS = '!@#$%^&*()_+-=[]{}|;:,.<>?';
const SIMILAR_CHARS = 'il1Lo0O';

export function generatePassword(options: PasswordOptions): string {
  let charset = '';
  
  if (options.includeLowercase) charset += LOWERCASE;
  if (options.includeUppercase) charset += UPPERCASE;
  if (options.includeNumbers) charset += NUMBERS;
  if (options.includeSymbols) charset += SYMBOLS;
  
  if (options.excludeSimilar) {
    charset = charset.split('').filter(char => !SIMILAR_CHARS.includes(char)).join('');
  }
  
  if (charset === '') {
    throw new Error('At least one character type must be selected');
  }
  
  let password = '';
  const array = new Uint32Array(options.length);
  crypto.getRandomValues(array);
  
  // Ensure at least one character from each selected type
  const requiredChars: string[] = [];
  if (options.includeLowercase) requiredChars.push(getRandomChar(LOWERCASE, options.excludeSimilar));
  if (options.includeUppercase) requiredChars.push(getRandomChar(UPPERCASE, options.excludeSimilar));
  if (options.includeNumbers) requiredChars.push(getRandomChar(NUMBERS, options.excludeSimilar));
  if (options.includeSymbols) requiredChars.push(getRandomChar(SYMBOLS, options.excludeSimilar));
  
  // Fill the rest randomly
  for (let i = 0; i < options.length; i++) {
    if (i < requiredChars.length) {
      password += requiredChars[i];
    } else {
      password += charset[array[i] % charset.length];
    }
  }
  
  // Shuffle the password to avoid predictable patterns
  return shuffleString(password);
}

function getRandomChar(charset: string, excludeSimilar: boolean): string {
  let chars = charset;
  if (excludeSimilar) {
    chars = chars.split('').filter(char => !SIMILAR_CHARS.includes(char)).join('');
  }
  const array = new Uint32Array(1);
  crypto.getRandomValues(array);
  return chars[array[0] % chars.length];
}

function shuffleString(str: string): string {
  const array = str.split('');
  const randomArray = new Uint32Array(array.length);
  crypto.getRandomValues(randomArray);
  
  for (let i = array.length - 1; i > 0; i--) {
    const j = randomArray[i] % (i + 1);
    [array[i], array[j]] = [array[j], array[i]];
  }
  
  return array.join('');
}

export function calculatePasswordStrength(password: string): PasswordStrengthResult {
  let score = 0;
  const feedback: string[] = [];
  
  // Length scoring
  if (password.length >= 12) {
    score += 25;
  } else if (password.length >= 8) {
    score += 15;
    feedback.push('Consider using at least 12 characters');
  } else {
    score += 5;
    feedback.push('Password is too short');
  }
  
  // Character diversity
  const hasLower = /[a-z]/.test(password);
  const hasUpper = /[A-Z]/.test(password);
  const hasNumbers = /\d/.test(password);
  const hasSymbols = /[^a-zA-Z0-9]/.test(password);
  
  const charTypes = [hasLower, hasUpper, hasNumbers, hasSymbols].filter(Boolean).length;
  score += charTypes * 15;
  
  if (charTypes < 3) {
    feedback.push('Include more character types (uppercase, lowercase, numbers, symbols)');
  }
  
  // Repetition penalty
  const repetitionPattern = /(.)\1{2,}/;
  if (repetitionPattern.test(password)) {
    score -= 10;
    feedback.push('Avoid repeating characters');
  }
  
  // Sequential patterns penalty
  const sequentialPattern = /(abc|bcd|cde|123|234|345|qwe|wer|ert)/i;
  if (sequentialPattern.test(password)) {
    score -= 10;
    feedback.push('Avoid sequential patterns');
  }
  
  // Determine strength level
  let strength: PasswordStrength;
  if (score >= 80) {
    strength = 'very-strong';
  } else if (score >= 60) {
    strength = 'strong';
  } else if (score >= 40) {
    strength = 'good';
  } else if (score >= 20) {
    strength = 'fair';
  } else {
    strength = 'weak';
  }
  
  return { strength, score: Math.min(100, Math.max(0, score)), feedback };
}

export function generateMultiplePasswords(options: PasswordOptions, count: number): string[] {
  const passwords: string[] = [];
  for (let i = 0; i < count; i++) {
    passwords.push(generatePassword(options));
  }
  return passwords;
}