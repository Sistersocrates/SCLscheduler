
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UserCircle, Mail, Phone, GraduationCap, Briefcase } from 'lucide-react';
import { motion } from 'framer-motion';

const StudentProfileView = ({ student }) => {
  // Placeholder data if student prop is not provided
  const displayStudent = student || {
    id: 'student-123',
    name: 'Alex Johnson',
    email: 'alex.johnson@example.com',
    phone: '555-1234',
    grade: '11th Grade',
    advisor: 'Ms. Emily Carter',
    profileImageUrl: '', // Add a placeholder image URL or handle missing image
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <Card className="bg-slate-800/60 border-slate-700 text-slate-200">
        <CardHeader className="items-center text-center">
          {displayStudent.profileImageUrl ? (
            <img  src={displayStudent.profileImageUrl} alt={displayStudent.name} className="w-24 h-24 rounded-full mx-auto border-2 border-pink-400 object-cover" src="https://images.unsplash.com/photo-1692274634343-aa1bc1828b7c" />
          ) : (
            <UserCircle className="w-24 h-24 text-pink-400 mx-auto" />
          )}
          <CardTitle className="text-2xl mt-3 text-pink-300">{displayStudent.name}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 pt-2">
          <InfoItem icon={Mail} label="Email" value={displayStudent.email} href={`mailto:${displayStudent.email}`} />
          <InfoItem icon={Phone} label="Phone" value={displayStudent.phone || 'N/A'} href={displayStudent.phone ? `tel:${displayStudent.phone}` : undefined} />
          <InfoItem icon={GraduationCap} label="Grade" value={displayStudent.grade || 'N/A'} />
          <InfoItem icon={Briefcase} label="Advisor" value={displayStudent.advisor || 'N/A'} />
          {/* Add more student details here */}
        </CardContent>
      </Card>
    </motion.div>
  );
};

const InfoItem = ({ icon: Icon, label, value, href }) => (
  <div className="flex items-center p-2 bg-slate-700/40 rounded-md">
    <Icon className="h-5 w-5 text-slate-500 mr-3 flex-shrink-0" />
    <div className="flex-grow">
      <span className="text-xs text-slate-400">{label}</span>
      {href ? (
        <a href={href} className="block text-sm text-slate-200 hover:text-pink-400 transition-colors">{value}</a>
      ) : (
        <p className="text-sm text-slate-200">{value}</p>
      )}
    </div>
  </div>
);

export default StudentProfileView;
