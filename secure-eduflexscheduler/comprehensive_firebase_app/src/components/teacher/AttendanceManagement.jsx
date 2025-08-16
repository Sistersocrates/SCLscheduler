import React, { useState, useEffect } from 'react';
import { useAuth } from '../AuthProvider';
import { 
  getClassRoster, 
  getClassWaitlist, 
  recordAttendance, 
  getClassAttendance,
  updateAttendanceRecord,
  approveWaitlistStudent,
  getClassDetails
} from '../../lib/teacherFirebase';
import { 
  Users, 
  ClipboardCheck, 
  Calendar, 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  User,
  Mail,
  Phone,
  Download,
  Filter,
  Search,
  MoreHorizontal,
  UserPlus,
  UserMinus,
  Loader,
  Save,
  Edit,
  Eye,
  TrendingUp,
  BarChart3
} from 'lucide-react';

const AttendanceManagement = ({ classId }) => {
  const { user } = useAuth();
  const [classDetails, setClassDetails] = useState(null);
  const [activeTab, setActiveTab] = useState('roster');
  const [roster, setRoster] = useState([]);
  const [waitlist, setWaitlist] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [attendanceRecords, setAttendanceRecords] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [filters, setFilters] = useState({
    search: '',
    status: 'all',
    dateRange: 'week'
  });

  useEffect(() => {
    if (classId && user) {
      loadInitialData();
    }
  }, [classId, user]);

  useEffect(() => {
    if (classId && user && classDetails) {
      loadTabData();
    }
  }, [activeTab, classDetails]);

  const loadInitialData = async () => {
    try {
      setLoading(true);
      const details = await getClassDetails(classId);
      setClassDetails(details);
    } catch (error) {
      console.error('Failed to load class details', error);
    } finally {
      setLoading(false);
    }
  };

  const loadTabData = async () => {
    try {
      setLoading(true);
      if (activeTab === 'roster') {
        const rosterData = await getClassRoster(user.uid, classId);
        setRoster(rosterData);
      } else if (activeTab === 'waitlist') {
        const waitlistData = await getClassWaitlist(user.uid, classId);
        setWaitlist(waitlistData);
      } else if (activeTab === 'attendance') {
        const attendanceData = await getClassAttendance(user.uid, classId, {
          dateRange: getDateRange()
        });
        setAttendance(attendanceData);
        
        const todayAttendance = await getClassAttendance(user.uid, classId, {
          date: selectedDate
        });
        
        const todayRecords = {};
        todayAttendance.forEach(record => {
          todayRecords[record.studentId] = {
            id: record.id,
            status: record.status,
            notes: record.notes || '',
            creditAwarded: record.creditAwarded
          };
        });
        setAttendanceRecords(todayRecords);
      }
    } catch (error) {
      console.error('Error loading tab data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getDateRange = () => {
    const end = new Date();
    const start = new Date();
    
    switch (filters.dateRange) {
      case 'week':
        start.setDate(end.getDate() - 7);
        break;
      case 'month':
        start.setMonth(end.getMonth() - 1);
        break;
      case 'semester':
        start.setMonth(end.getMonth() - 4);
        break;
      default:
        start.setDate(end.getDate() - 7);
    }
    
    return { start: start.toISOString(), end: end.toISOString() };
  };

  const handleAttendanceChange = (studentId, field, value) => {
    setAttendanceRecords(prev => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        [field]: value
      }
    }));
  };

  const saveAttendance = async () => {
    try {
      setSaving(true);
      
      const records = roster.map(student => {
        const studentRecords = attendanceRecords[student.studentId] || {};
        const status = studentRecords.status || 'absent';
        const credit = studentRecords.credit !== undefined ? studentRecords.credit : (status === 'present' ? 1 : 0);

        return {
          studentId: student.studentId,
          status: status,
          notes: studentRecords.notes || '',
          creditAwarded: credit
        };
      });

      await recordAttendance(user.uid, classId, {
        date: selectedDate,
        records
      });

      await loadTabData();
    } catch (error) {
      console.error('Error saving attendance:', error);
    } finally {
      setSaving(false);
    }
  };

  const approveFromWaitlist = async (enrollmentId) => {
    try {
      await approveWaitlistStudent(user.uid, classId, enrollmentId);
      await loadTabData();
    } catch (error) {
      console.error('Error approving waitlist student:', error);
    }
  };

  const exportRoster = () => {
    const csvContent = [
      ['Name', 'Email', 'Student ID', 'Grade Level', 'Enrollment Date'],
      ...roster.map(student => [
        student.student.displayName,
        student.student.email,
        student.student.studentId,
        student.student.gradeLevel || 'N/A',
        new Date(student.enrollmentDate?.toDate()).toLocaleDateString()
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${classDetails?.title}_roster.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  // ... (rest of the component is the same)
};

export default AttendanceManagement;
