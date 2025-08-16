import React from 'react';
import { useAuth } from '../components/AuthProvider';
import StudentDashboard from '../components/student/StudentDashboard';
import TeacherDashboard from '../components/teacher/TeacherDashboard';
import AdminDashboard from '../components/admin/AdminDashboard';
import SpecialistDashboard from '../components/specialist/SpecialistDashboard';
import { Loader } from 'lucide-react';

// A placeholder for roles that don't have a dedicated dashboard yet.
const PlaceholderDashboard = ({ role }) => (
  <div className="text-center py-12">
    <h1 className="text-2xl font-bold text-gray-900">{role ? `${role.charAt(0).toUpperCase() + role.slice(1)} Dashboard` : 'Dashboard'}</h1>
    <p className="text-gray-600 mt-2">This dashboard is under construction.</p>
  </div>
);

const HomePage = () => {
  const { userRole, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const renderDashboard = () => {
    switch (userRole) {
      case 'student':
        return <StudentDashboard />;
      case 'teacher':
        return <TeacherDashboard />;
      case 'admin':
        return <AdminDashboard />;
      case 'specialist':
        return <SpecialistDashboard />;
      case 'counselor':
        return <PlaceholderDashboard role="counselor" />;
      default:
        // This can be a fallback for any other roles or if the role is not defined
        return <PlaceholderDashboard role={userRole} />;
    }
  };

  return (
    <div>
      {renderDashboard()}
    </div>
  );
};

export default HomePage;
