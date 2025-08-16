import React from 'react';
import { useParams } from 'react-router-dom';
import AttendanceManagement from '../components/teacher/AttendanceManagement';

const AttendancePage = () => {
  const { classId } = useParams();

  return (
    <div className="p-6">
      <AttendanceManagement classId={classId} />
    </div>
  );
};

export default AttendancePage;
