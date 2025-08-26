import React, { useState } from 'react';
import { Bot, Mail, Lock, User, Phone, Globe } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { isSupabaseConfigured } from '../../lib/supabase';

interface AuthFormProps {
  initialMode?: 'signin' | 'signup';
  onBack?: () => void;
}

const AuthForm: React.FC<AuthFormProps> = ({ initialMode = 'signin', onBack }) => {
  const [isSignUp, setIsSignUp] = useState(initialMode === 'signup');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [country, setCountry] = useState('US');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [emailError, setEmailError] = useState('');

  const { signIn, signUp } = useAuth();

  // Email validation function
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    
    // Basic format check
    if (!emailRegex.test(email)) {
      return false;
    }
    
    // Check for common invalid patterns
    const invalidPatterns = [
      /^[^@]+@[^@]+\.(test|example|invalid|localhost)$/i,
      /^[^@]+@[^@]+\.(com\.com|org\.org)$/i,
      /^[^@]+@[^@]*\.(co\.uk\.com|gmail\.co)$/i,
      /^[^@]+@[^@]*\.(clinic\d*\.com)$/i, // Matches clinic1.com, clinic2.com, etc.
    ];
    
    return !invalidPatterns.some(pattern => pattern.test(email));
  };

  // Real-time email validation
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newEmail = e.target.value;
    setEmail(newEmail);
    setEmailError('');
    setError('');
    
    if (newEmail && !validateEmail(newEmail)) {
      setEmailError('Please enter a valid email address from a real domain (e.g., gmail.com, outlook.com)');
    }
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate email before submission
    if (!validateEmail(email)) {
      setEmailError('Please enter a valid email address from a real domain');
      return;
    }
    
    setLoading(true);
    setError('');
    setEmailError('');

    try {
      if (isSignUp) {
        const { error } = await signUp(email, password, {
          name,
          phone,
          country
        });
        if (error) throw error;
      } else {
        const { error } = await signIn(email, password);
        if (error) throw error;
      }
    } catch (err: any) {
      console.error('Auth error:', err);
      
      if (err.code === 'invalid_credentials' || err.message?.includes('Invalid login credentials')) {
        if (isSignUp) {
          setError('Failed to create account. Please try a different email or contact support.');
        } else {
          setError('Invalid email or password. Please check your credentials and try again. For new users, please sign up first.');
        }
      } else if (err.message?.includes('email_address_invalid') || 
                 (err.message?.includes('Email address') && err.message?.includes('is invalid')) ||
                 err.code === 'email_address_invalid') {
        setEmailError('Invalid email address. Please use a real email from domains like gmail.com, outlook.com, yahoo.com, or your company domain. Avoid test domains like clinic1.com, example.com, or temporary email services.');
      } else if (err.code === 'email_not_confirmed' || err.message?.includes('Email not confirmed')) {
        setError('Please check your email and click the confirmation link before signing in. If you haven\'t received the email, please contact support.');
      } else {
        setError(err.message || 'An error occurred');
      }
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Bot className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">HealthSphere CMS</h1>
            <p className="text-gray-600 mt-2">AI-First Clinical Management System</p>
            {onBack && (
              <button
                onClick={onBack}
                className="mt-4 text-blue-600 hover:text-blue-800 text-sm font-medium"
              >
                ← Back to Home
              </button>
            )}
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {isSignUp && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="pl-10 w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Dr. John Smith"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <div className="relative">
                    <Phone className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="pl-10 w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="+1 (555) 123-4567"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Country
                  </label>
                  <div className="relative">
                    <Globe className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                    <select
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                      className="pl-10 w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    >
                      <option value="US">United States</option>
                      <option value="IN">India</option>
                      <option value="GB">United Kingdom</option>
                      <option value="CA">Canada</option>
                      <option value="AU">Australia</option>
                    </select>
                  </div>
                </div>
              </>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                <input
                  type="email"
                  value={email}
                  onChange={handleEmailChange}
                  className={`pl-10 w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent ${
                    emailError 
                      ? 'border-red-300 focus:ring-red-500' 
                      : 'border-gray-300 focus:ring-blue-500'
                  }`}
                  placeholder="doctor@example.com"
                  required
                />
              </div>
              {emailError && (
                <p className="mt-2 text-sm text-red-600">{emailError}</p>
              )}
              <div className="mt-2 text-xs text-gray-500 space-y-1">
                <p className="font-medium">Email Requirements:</p>
                <p>✅ Use real domains: gmail.com, outlook.com, yahoo.com, company.com</p>
                <p>❌ Avoid: clinic1.com, test.com, example.com, fake.com, temp emails</p>
                <p>💡 Must be able to receive confirmation emails</p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            {error && (
              <div className="text-red-600 text-sm bg-red-50 p-3 rounded-lg">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading || !!emailError}
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
            >
              {loading ? 'Please wait...' : (isSignUp ? 'Create Account' : 'Sign In')}
            </button>
          </form>

          {/* Toggle */}
          <div className="mt-6 text-center">
            <button
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              {isSignUp 
                ? 'Already have an account? Sign in' 
                : "Don't have an account? Sign up"}
            </button>
          </div>

          {/* Demo credentials */}
          {!isSignUp && !isSupabaseConfigured && (
            <div className="mt-4 p-3 bg-gray-50 rounded-lg text-center">
              <p className="text-xs text-gray-600">Demo: Use any email/password to continue</p>
            </div>
          )}

          {/* Default user credentials */}
          {!isSignUp && isSupabaseConfigured && (
            <div className="mt-4 p-3 bg-blue-50 rounded-lg">
              <p className="text-xs text-blue-800 font-medium mb-2">⚠️ Setup Required:</p>
              <div className="text-xs text-blue-700 space-y-1">
                <div>1. Apply database migrations in Supabase</div>
                <div>2. Create users: admin@healthsphere.com / admin123</div>
                <div>3. Or register new accounts using the sign up form</div>
              </div>
              <p className="text-xs text-blue-600 mt-2">
                Getting "Invalid credentials"? The database needs setup first.
              </p>
            </div>
          )}

          {!isSupabaseConfigured && (
            <div className="mt-4 p-3 bg-yellow-50 rounded-lg">
              <p className="text-xs text-gray-500">
                Supabase not configured. Using demo mode.
              </p>
            </div>
          )}
          
          {isSupabaseConfigured && (
            <div className="mt-4 p-3 bg-green-50 rounded-lg border border-green-200">
              <p className="text-xs text-green-700">
                <strong>✅ Database Updated:</strong> Email confirmation disabled via migration. For complete setup, also disable in Supabase Dashboard:
                <br />
                <span className="font-mono text-xs">Authentication → Settings → Email Confirmation → OFF</span>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthForm;