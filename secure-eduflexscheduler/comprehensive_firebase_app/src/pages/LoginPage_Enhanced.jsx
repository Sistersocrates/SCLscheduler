import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../components/AuthProvider';
import { signInWithGoogle, createUserProfile } from '../lib/firebase_enhanced';
import { GraduationCap, Shield, Users, BookOpen, UserCheck, ChevronRight, CheckCircle } from 'lucide-react';

// TODO: In a production environment, this should be replaced with a secure,
// server-side validation call to a Firebase Function or a dedicated backend endpoint.
const TEACHER_ACCESS_CODE = 'TEACHER_SECRET';

const LoginPage = () => {
  const { user, loading } = useAuth();
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [selectedRole, setSelectedRole] = useState('');
  const [step, setStep] = useState(1); // 1: role selection, 2: additional info, 3: sign in
  const [additionalInfo, setAdditionalInfo] = useState({
    department: '',
    studentId: '',
    phoneNumber: '',
    employeeId: '',
    specialization: '',
    accessCode: ''
  });
  const [error, setError] = useState('');

  // Redirect if already authenticated
  if (user && !loading) {
    return <Navigate to="/dashboard" replace />;
  }

  const roles = [
    {
      id: 'student',
      name: 'Student',
      description: 'Access seminars, schedule, and track your academic progress',
      icon: GraduationCap,
      color: 'blue',
      features: ['Browse & enroll in seminars', 'View personal schedule', 'Track academic progress', 'Book counseling appointments']
    },
    {
      id: 'teacher',
      name: 'Teacher/Faculty',
      description: 'Create and manage seminars, track attendance, and grade students',
      icon: BookOpen,
      color: 'green',
      features: ['Create & manage seminars', 'Take attendance', 'Grade assignments', 'View student rosters', 'Generate reports']
    },
    {
      id: 'counselor',
      name: 'Counselor/Specialist',
      description: 'Support students, manage appointments, and track progress',
      icon: UserCheck,
      color: 'purple',
      features: ['Monitor student progress', 'Schedule appointments', 'Generate reports', 'Access counseling tools']
    },
    {
      id: 'admin',
      name: 'Administrator',
      description: 'Manage users, system settings, and access analytics',
      icon: Shield,
      color: 'red',
      features: ['Manage all users', 'System configuration', 'View analytics', 'Access all features', 'Security settings']
    }
  ];

  const handleRoleSelection = (roleId) => {
    setSelectedRole(roleId);
    setError('');
    setStep(2);
  };

  const handleBackToRoles = () => {
    setStep(1);
    setSelectedRole('');
    setAdditionalInfo({
      department: '',
      studentId: '',
      phoneNumber: '',
      employeeId: '',
      specialization: '',
      accessCode: ''
    });
  };

  const handleProceedToSignIn = () => {
    if (!selectedRole) {
      setError('Please select your role');
      return;
    }

    // Validate teacher access code
    if (selectedRole === 'teacher') {
      if (additionalInfo.accessCode !== TEACHER_ACCESS_CODE) {
        setError('Invalid Teacher Access Code. Please check the code and try again.');
        return;
      }
    }

    setError(''); // Clear error on successful validation
    setStep(3);
  };

  const handleGoogleSignIn = async () => {
    setIsSigningIn(true);
    setError('');

    try {
      const result = await signInWithGoogle();
      
      if (result.error) {
        setError(result.error);
      } else if (result.user) {
        // Create user document with selected role and additional info
        await createUserProfile(result.user, {
          role: selectedRole,
          ...additionalInfo
        });
      }
    } catch (error) {
      setError('Failed to sign in. Please try again.');
      console.error('Sign in error:', error);
    } finally {
      setIsSigningIn(false);
    }
  };

  const getRoleColor = (color) => {
    const colors = {
      blue: 'border-blue-200 bg-blue-50 hover:bg-blue-100 text-blue-700 hover:border-blue-300',
      green: 'border-green-200 bg-green-50 hover:bg-green-100 text-green-700 hover:border-green-300',
      purple: 'border-purple-200 bg-purple-50 hover:bg-purple-100 text-purple-700 hover:border-purple-300',
      red: 'border-red-200 bg-red-50 hover:bg-red-100 text-red-700 hover:border-red-300'
    };
    return colors[color] || colors.blue;
  };

  const getSelectedRole = () => roles.find(role => role.id === selectedRole);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="flex justify-center">
            <GraduationCap className="h-16 w-16 text-blue-600" />
          </div>
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Welcome to EduFlex Scheduler
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Secure, FERPA-compliant seminar management system
          </p>
        </div>

        {/* Progress Steps */}
        <div className="flex justify-center">
          <div className="flex items-center space-x-4">
            <div className={`flex items-center justify-center w-8 h-8 rounded-full ${step >= 1 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'}`}>
              {step > 1 ? <CheckCircle className="w-5 h-5" /> : '1'}
            </div>
            <div className={`w-12 h-1 ${step >= 2 ? 'bg-blue-600' : 'bg-gray-200'}`}></div>
            <div className={`flex items-center justify-center w-8 h-8 rounded-full ${step >= 2 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'}`}>
              {step > 2 ? <CheckCircle className="w-5 h-5" /> : '2'}
            </div>
            <div className={`w-12 h-1 ${step >= 3 ? 'bg-blue-600' : 'bg-gray-200'}`}></div>
            <div className={`flex items-center justify-center w-8 h-8 rounded-full ${step >= 3 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'}`}>
              3
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8 space-y-6">
          {/* Step 1: Role Selection */}
          {step === 1 && (
            <>
              <div className="text-center">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Choose Your Role</h3>
                <p className="text-gray-600">Select the role that best describes your position</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {roles.map((role) => {
                  const Icon = role.icon;
                  
                  return (
                    <button
                      key={role.id}
                      onClick={() => handleRoleSelection(role.id)}
                      className={`p-6 border-2 rounded-lg text-left transition-all duration-200 ${getRoleColor(role.color)}`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-3">
                          <Icon className="h-8 w-8 mt-1" />
                          <div>
                            <h3 className="font-semibold text-lg">{role.name}</h3>
                            <p className="text-sm opacity-75 mt-1">{role.description}</p>
                            <ul className="mt-3 space-y-1">
                              {role.features.slice(0, 3).map((feature, index) => (
                                <li key={index} className="text-xs opacity-70 flex items-center">
                                  <CheckCircle className="w-3 h-3 mr-1" />
                                  {feature}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                        <ChevronRight className="h-5 w-5 opacity-50" />
                      </div>
                    </button>
                  );
                })}
              </div>
            </>
          )}

          {/* Step 2: Additional Information */}
          {step === 2 && selectedRole && (
            <>
              <div className="text-center">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Additional Information</h3>
                <p className="text-gray-600">Help us set up your profile for {getSelectedRole()?.name}</p>
              </div>

              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <div className="flex items-center space-x-3">
                  {React.createElement(getSelectedRole()?.icon, { className: "h-6 w-6 text-blue-600" })}
                  <div>
                    <h4 className="font-medium text-gray-900">{getSelectedRole()?.name}</h4>
                    <p className="text-sm text-gray-600">{getSelectedRole()?.description}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                {/* Common fields */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Department <span className="text-gray-400">(Optional)</span>
                  </label>
                  <input
                    type="text"
                    value={additionalInfo.department}
                    onChange={(e) => setAdditionalInfo(prev => ({ ...prev, department: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., Computer Science, Mathematics, Administration"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number <span className="text-gray-400">(Optional)</span>
                  </label>
                  <input
                    type="tel"
                    value={additionalInfo.phoneNumber}
                    onChange={(e) => setAdditionalInfo(prev => ({ ...prev, phoneNumber: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="(555) 123-4567"
                  />
                </div>

                {/* Role-specific fields */}
                {selectedRole === 'student' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Student ID <span className="text-gray-400">(Optional)</span>
                    </label>
                    <input
                      type="text"
                      value={additionalInfo.studentId}
                      onChange={(e) => setAdditionalInfo(prev => ({ ...prev, studentId: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter your student ID"
                    />
                  </div>
                )}

                {selectedRole === 'admin' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Employee ID <span className="text-gray-400">(Optional)</span>
                    </label>
                    <input
                      type="text"
                      value={additionalInfo.employeeId}
                      onChange={(e) => setAdditionalInfo(prev => ({ ...prev, employeeId: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter your employee ID"
                    />
                  </div>
                )}

                {selectedRole === 'teacher' && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Employee ID <span className="text-gray-400">(Optional)</span>
                      </label>
                      <input
                        type="text"
                        value={additionalInfo.employeeId}
                        onChange={(e) => setAdditionalInfo(prev => ({ ...prev, employeeId: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter your employee ID"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Teacher Access Code <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="password"
                        value={additionalInfo.accessCode}
                        onChange={(e) => setAdditionalInfo(prev => ({ ...prev, accessCode: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter teacher access code"
                        required
                      />
                    </div>
                  </>
                )}

                {selectedRole === 'counselor' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Specialization <span className="text-gray-400">(Optional)</span>
                    </label>
                    <input
                      type="text"
                      value={additionalInfo.specialization}
                      onChange={(e) => setAdditionalInfo(prev => ({ ...prev, specialization: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="e.g., Academic Counseling, Career Guidance"
                    />
                  </div>
                )}
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={handleBackToRoles}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
                >
                  Back
                </button>
                <button
                  onClick={handleProceedToSignIn}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  Continue
                </button>
              </div>
            </>
          )}

          {/* Step 3: Sign In */}
          {step === 3 && selectedRole && (
            <>
              <div className="text-center">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Ready to Sign In</h3>
                <p className="text-gray-600">Complete your registration with Google</p>
              </div>

              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <div className="flex items-center space-x-3 mb-3">
                  {React.createElement(getSelectedRole()?.icon, { className: "h-6 w-6 text-blue-600" })}
                  <div>
                    <h4 className="font-medium text-gray-900">{getSelectedRole()?.name}</h4>
                    <p className="text-sm text-gray-600">{getSelectedRole()?.description}</p>
                  </div>
                </div>
                
                {(additionalInfo.department || additionalInfo.studentId || additionalInfo.employeeId) && (
                  <div className="border-t pt-3 mt-3">
                    <h5 className="text-sm font-medium text-gray-700 mb-2">Profile Information:</h5>
                    <div className="text-sm text-gray-600 space-y-1">
                      {additionalInfo.department && <p>Department: {additionalInfo.department}</p>}
                      {additionalInfo.studentId && <p>Student ID: {additionalInfo.studentId}</p>}
                      {additionalInfo.employeeId && <p>Employee ID: {additionalInfo.employeeId}</p>}
                      {additionalInfo.specialization && <p>Specialization: {additionalInfo.specialization}</p>}
                    </div>
                  </div>
                )}
              </div>

              {/* Error Message */}
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-md p-3 mb-4">
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              )}

              {/* Sign In Button */}
              <button
                onClick={handleGoogleSignIn}
                disabled={isSigningIn}
                className="w-full flex justify-center items-center px-4 py-3 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
              >
                {isSigningIn ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Creating your account...
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                      <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                      <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                    Sign in with Google
                  </>
                )}
              </button>

              <button
                onClick={() => setStep(2)}
                className="w-full mt-3 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
              >
                Back to Edit Information
              </button>
            </>
          )}

          {/* Security Notice */}
          <div className="bg-gray-50 rounded-md p-4">
            <div className="flex items-start space-x-2">
              <Shield className="h-5 w-5 text-gray-600 mt-0.5" />
              <div>
                <h4 className="text-sm font-medium text-gray-900">Security & Privacy</h4>
                <p className="text-xs text-gray-600 mt-1">
                  This system is FERPA-compliant and uses enterprise-grade security. 
                  All user actions are logged for compliance and security purposes.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-xs text-gray-500">
          <p>© 2025 EduFlex Scheduler. Built with Firebase & React.</p>
          <p className="mt-1">🔒 Secure • 📚 FERPA Compliant • 🚀 Modern</p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;

