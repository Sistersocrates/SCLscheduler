import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';
import { 
  getFirestore, 
  collection, 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  limit, 
  getDocs, 
  addDoc,
  onSnapshot,
  serverTimestamp,
  Timestamp
} from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';

// Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

// Auth providers
const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: 'select_account'
});

// Authentication functions
export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return result;
  } catch (error) {
    console.error('Error signing in with Google:', error);
    
    // Handle specific error cases
    if (error.code === 'auth/popup-closed-by-user') {
      return { error: 'Sign-in was cancelled. Please try again.' };
    } else if (error.code === 'auth/popup-blocked') {
      return { error: 'Pop-up was blocked. Please allow pop-ups and try again.' };
    } else if (error.code === 'auth/network-request-failed') {
      return { error: 'Network error. Please check your connection and try again.' };
    }
    
    return { error: 'Failed to sign in. Please try again.' };
  }
};

export const signOutUser = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error('Error signing out:', error);
    throw error;
  }
};

// Enhanced user management functions
export const createUserProfile = async (user, additionalData = {}) => {
  if (!user) return;
  
  const userRef = doc(db, 'users', user.uid);
  const userSnap = await getDoc(userRef);
  
  if (!userSnap.exists()) {
    const { displayName, email, photoURL } = user;
    const createdAt = serverTimestamp();
    
    // Prepare user profile data
    const userProfileData = {
      displayName,
      email,
      photoURL,
      role: additionalData.role || 'student',
      status: 'active',
      createdAt,
      updatedAt: createdAt,
      lastLoginAt: createdAt,
      // Common fields
      department: additionalData.department || '',
      phoneNumber: additionalData.phoneNumber || '',
      // Role-specific fields
      ...(additionalData.role === 'student' && {
        studentId: additionalData.studentId || '',
        gradeLevel: additionalData.gradeLevel || null,
        graduationYear: additionalData.graduationYear || null,
        enrollmentStatus: 'active'
      }),
      ...(additionalData.role === 'teacher' && {
        employeeId: additionalData.employeeId || '',
        teachingSubjects: additionalData.teachingSubjects || [],
        qualifications: additionalData.qualifications || [],
        officeHours: additionalData.officeHours || {}
      }),
      ...(additionalData.role === 'counselor' && {
        employeeId: additionalData.employeeId || '',
        specialization: additionalData.specialization || '',
        licenseNumber: additionalData.licenseNumber || '',
        availableHours: additionalData.availableHours || {}
      }),
      ...(additionalData.role === 'admin' && {
        employeeId: additionalData.employeeId || '',
        adminLevel: additionalData.adminLevel || 'standard',
        permissions: additionalData.permissions || {
          userManagement: true,
          systemSettings: true,
          reports: true,
          security: true
        }
      })
    };
    
    try {
      await setDoc(userRef, userProfileData);
      
      // Create audit log
      await createAuditLog(user.uid, 'user_created', 'users', user.uid, {
        role: additionalData.role || 'student',
        email: email,
        department: additionalData.department || ''
      });
      
      // Send welcome notification
      await createNotification({
        userId: user.uid,
        type: 'welcome',
        title: 'Welcome to EduFlex Scheduler!',
        message: `Your ${additionalData.role || 'student'} account has been created successfully. Explore your dashboard to get started.`,
        priority: 'normal'
      });
      
      console.log('User profile created successfully:', userProfileData);
      
    } catch (error) {
      console.error('Error creating user profile:', error);
      throw error;
    }
  } else {
    // Update last login for existing users
    await updateDoc(userRef, {
      lastLoginAt: serverTimestamp()
    });
    
    console.log('Existing user logged in, updated lastLoginAt');
  }
  
  return userRef;
};

export const getUserProfile = async (userId) => {
  try {
    const userRef = doc(db, 'users', userId);
    const userSnap = await getDoc(userRef);
    
    if (userSnap.exists()) {
      const userData = { id: userSnap.id, ...userSnap.data() };
      
      // Convert Firestore timestamps to JavaScript dates for easier handling
      if (userData.createdAt?.toDate) {
        userData.createdAt = userData.createdAt.toDate();
      }
      if (userData.updatedAt?.toDate) {
        userData.updatedAt = userData.updatedAt.toDate();
      }
      if (userData.lastLoginAt?.toDate) {
        userData.lastLoginAt = userData.lastLoginAt.toDate();
      }
      
      return userData;
    }
    return null;
  } catch (error) {
    console.error('Error getting user profile:', error);
    throw error;
  }
};

export const updateUserProfile = async (userId, updateData) => {
  try {
    const userRef = doc(db, 'users', userId);
    const updatePayload = {
      ...updateData,
      updatedAt: serverTimestamp()
    };
    
    await updateDoc(userRef, updatePayload);
    
    // Create audit log
    await createAuditLog(userId, 'user_updated', 'users', userId, updateData);
    
    console.log('User profile updated successfully');
    
  } catch (error) {
    console.error('Error updating user profile:', error);
    throw error;
  }
};

// Role validation and management
export const validateUserRole = (role) => {
  const validRoles = ['student', 'teacher', 'counselor', 'admin'];
  return validRoles.includes(role);
};

export const getUsersByRole = async (role) => {
  try {
    if (!validateUserRole(role)) {
      throw new Error('Invalid role specified');
    }
    
    const q = query(
      collection(db, 'users'),
      where('role', '==', role),
      where('status', '==', 'active'),
      orderBy('displayName')
    );
    
    const querySnapshot = await getDocs(q);
    const users = [];
    
    querySnapshot.forEach((doc) => {
      users.push({ id: doc.id, ...doc.data() });
    });
    
    return users;
  } catch (error) {
    console.error('Error getting users by role:', error);
    throw error;
  }
};

export const changeUserRole = async (userId, newRole, adminUserId) => {
  try {
    if (!validateUserRole(newRole)) {
      throw new Error('Invalid role specified');
    }
    
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, {
      role: newRole,
      updatedAt: serverTimestamp()
    });
    
    // Create audit log
    await createAuditLog(adminUserId, 'role_changed', 'users', userId, {
      newRole: newRole,
      changedBy: adminUserId
    });
    
    // Notify user of role change
    await createNotification({
      userId: userId,
      type: 'role_change',
      title: 'Role Updated',
      message: `Your role has been updated to ${newRole}. Please refresh your browser to see the changes.`,
      priority: 'high'
    });
    
    console.log(`User role changed to ${newRole} successfully`);
    
  } catch (error) {
    console.error('Error changing user role:', error);
    throw error;
  }
};

// Enhanced notification system
export const createNotification = async (notificationData) => {
  try {
    const notification = {
      ...notificationData,
      read: false,
      createdAt: serverTimestamp(),
      id: null // Will be set by Firestore
    };
    
    const notificationRef = await addDoc(collection(db, 'notifications'), notification);
    
    console.log('Notification created:', notificationRef.id);
    
    return { id: notificationRef.id, ...notification };
  } catch (error) {
    console.error('Error creating notification:', error);
    // Don't throw error for notifications to avoid breaking main flow
  }
};

export const getStudentNotifications = async (studentId, filters = {}) => {
  try {
    let q = query(
      collection(db, 'notifications'),
      where('userId', '==', studentId)
    );
    
    if (filters.unreadOnly) {
      q = query(q, where('read', '==', false));
    }
    
    if (filters.type) {
      q = query(q, where('type', '==', filters.type));
    }
    
    q = query(q, orderBy('createdAt', 'desc'), limit(50));
    
    const querySnapshot = await getDocs(q);
    const notifications = [];
    
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      notifications.push({ 
        id: doc.id, 
        ...data,
        createdAt: data.createdAt?.toDate() || new Date()
      });
    });
    
    return notifications;
  } catch (error) {
    console.error('Error getting student notifications:', error);
    throw error;
  }
};

export const markNotificationAsRead = async (notificationId) => {
  try {
    const notificationRef = doc(db, 'notifications', notificationId);
    await updateDoc(notificationRef, {
      read: true,
      readAt: serverTimestamp()
    });
  } catch (error) {
    console.error('Error marking notification as read:', error);
    throw error;
  }
};

// Enhanced audit logging
export const createAuditLog = async (userId, action, resourceType, resourceId, details = {}) => {
  try {
    const auditLog = {
      userId,
      action,
      resourceType,
      resourceId,
      details,
      timestamp: serverTimestamp(),
      userAgent: navigator.userAgent,
      ipAddress: 'client-side', // Would be populated server-side in production
      sessionId: generateSessionId()
    };
    
    await addDoc(collection(db, 'auditLogs'), auditLog);
    console.log('Audit log created:', action);
  } catch (error) {
    console.error('Error creating audit log:', error);
    // Don't throw error for audit logging failures
  }
};

// Utility functions
export const generateSessionId = () => {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
};

export const formatTimestamp = (timestamp) => {
  if (!timestamp) return '';
  
  if (timestamp.toDate) {
    return timestamp.toDate();
  }
  
  return new Date(timestamp);
};

export const createTimestamp = (date) => {
  return Timestamp.fromDate(new Date(date));
};

// Dashboard data functions
export const getDashboardStats = async (userId, userRole) => {
  try {
    const stats = {};
    
    switch (userRole) {
      case 'student':
        const enrollments = await getStudentEnrollments(userId);
        stats.enrolledSeminars = enrollments.length;
        stats.completedSeminars = enrollments.filter(e => e.status === 'completed').length;
        stats.upcomingEvents = enrollments.filter(e => e.status === 'enrolled').length;
        stats.totalCredits = enrollments.reduce((sum, e) => sum + (e.classDetails?.credits || 0), 0);
        break;
        
      case 'teacher':
        const teacherClasses = await getTeacherClasses(userId);
        stats.mySeminars = teacherClasses.length;
        stats.totalStudents = teacherClasses.reduce((sum, c) => sum + (c.currentEnrollment || 0), 0);
        stats.activeSeminars = teacherClasses.filter(c => c.status === 'active').length;
        stats.avgRating = calculateAverageRating(teacherClasses);
        break;
        
      case 'counselor':
        stats.activeStudents = await getCounselorStudentCount(userId);
        stats.appointmentsToday = await getTodayAppointmentCount(userId);
        stats.pendingReviews = await getPendingReviewCount(userId);
        stats.successRate = await getCounselorSuccessRate(userId);
        break;
        
      case 'admin':
        stats.totalUsers = await getTotalUserCount();
        stats.activeSessions = await getActiveSessionCount();
        stats.systemHealth = await getSystemHealthScore();
        stats.securityScore = await getSecurityScore();
        break;
    }
    
    return stats;
  } catch (error) {
    console.error('Error getting dashboard stats:', error);
    return {};
  }
};

// Helper functions for dashboard stats
const getStudentEnrollments = async (studentId) => {
  try {
    const q = query(
      collection(db, 'enrollments'),
      where('studentId', '==', studentId),
      orderBy('enrollmentDate', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    const enrollments = [];
    
    for (const doc of querySnapshot.docs) {
      const enrollmentData = { id: doc.id, ...doc.data() };
      
      // Get class details
      if (enrollmentData.classId) {
        const classRef = doc(db, 'classes', enrollmentData.classId);
        const classSnap = await getDoc(classRef);
        
        if (classSnap.exists()) {
          enrollmentData.classDetails = { id: classSnap.id, ...classSnap.data() };
        }
      }
      
      enrollments.push(enrollmentData);
    }
    
    return enrollments;
  } catch (error) {
    console.error('Error getting student enrollments:', error);
    return [];
  }
};

const getTeacherClasses = async (teacherId) => {
  try {
    const q = query(
      collection(db, 'classes'),
      where('teacherId', '==', teacherId),
      orderBy('createdAt', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    const classes = [];
    
    querySnapshot.forEach((doc) => {
      classes.push({ id: doc.id, ...doc.data() });
    });
    
    return classes;
  } catch (error) {
    console.error('Error getting teacher classes:', error);
    return [];
  }
};

const calculateAverageRating = (classes) => {
  const ratingsSum = classes.reduce((sum, c) => sum + (c.rating || 0), 0);
  const ratingsCount = classes.filter(c => c.rating).length;
  return ratingsCount > 0 ? (ratingsSum / ratingsCount).toFixed(1) : 0;
};

const getCounselorStudentCount = async (counselorId) => {
  try {
    const q = query(
      collection(db, 'counselorAssignments'),
      where('counselorId', '==', counselorId),
      where('status', '==', 'active')
    );
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.size;
  } catch (error) {
    console.error('Error getting counselor student count:', error);
    return 0;
  }
};

const getTodayAppointmentCount = async (userId) => {
  try {
    const today = new Date();
    const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);
    
    const q = query(
      collection(db, 'appointments'),
      where('counselorId', '==', userId),
      where('startTime', '>=', Timestamp.fromDate(startOfDay)),
      where('startTime', '<', Timestamp.fromDate(endOfDay)),
      where('status', 'in', ['scheduled', 'confirmed'])
    );
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.size;
  } catch (error) {
    console.error('Error getting today appointment count:', error);
    return 0;
  }
};

const getPendingReviewCount = async (userId) => {
  try {
    const q = query(
      collection(db, 'studentReviews'),
      where('counselorId', '==', userId),
      where('status', '==', 'pending')
    );
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.size;
  } catch (error) {
    console.error('Error getting pending review count:', error);
    return 0;
  }
};

const getCounselorSuccessRate = async (userId) => {
  // This would calculate success rate based on student outcomes
  // For now, return a placeholder
  return '94%';
};

const getTotalUserCount = async () => {
  try {
    const q = query(
      collection(db, 'users'),
      where('status', '==', 'active')
    );
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.size;
  } catch (error) {
    console.error('Error getting total user count:', error);
    return 0;
  }
};

const getActiveSessionCount = async () => {
  // This would track active sessions
  // For now, return a placeholder
  return 89;
};

const getSystemHealthScore = async () => {
  // This would calculate system health based on various metrics
  // For now, return a placeholder
  return '99.9%';
};

const getSecurityScore = async () => {
  // This would calculate security score based on various metrics
  // For now, return a placeholder
  return '98%';
};

// Real-time listeners
export const subscribeToUserNotifications = (userId, callback) => {
  const q = query(
    collection(db, 'notifications'),
    where('userId', '==', userId),
    where('read', '==', false),
    orderBy('createdAt', 'desc')
  );
  
  return onSnapshot(q, callback);
};

export const subscribeToUserProfile = (userId, callback) => {
  const userRef = doc(db, 'users', userId);
  return onSnapshot(userRef, callback);
};
export { getStudentEnrollments, getAvailableClasses };
export default app;

