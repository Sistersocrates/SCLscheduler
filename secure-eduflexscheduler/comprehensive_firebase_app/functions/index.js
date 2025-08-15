const functions = require("firebase-functions");
const admin = require("firebase-admin");

admin.initializeApp();

const db = admin.firestore();

exports.bulkCreateUsers = functions.https.onCall(async (data, context) => {
  if (!context.auth || context.auth.token.role !== 'admin') {
    throw new functions.https.HttpsError(
      'permission-denied',
      'Only administrators can create users in bulk.'
    );
  }

  const users = data.users;
  if (!Array.isArray(users) || users.length === 0) {
    throw new functions.https.HttpsError(
      'invalid-argument',
      'The function must be called with an array of user objects.'
    );
  }

  const results = {
    successCount: 0,
    errorCount: 0,
    errors: [],
  };

  const validRoles = ['student', 'teacher', 'counselor', 'admin', 'specialist'];

  for (let i = 0; i < users.length; i++) {
    const user = users[i];

    if (!user.email || !user.role || !user.displayName) {
      results.errorCount++;
      results.errors.push({ row: i + 1, email: user.email || 'N/A', error: 'Missing required fields: email, role, displayName.' });
      continue;
    }

    if (!validRoles.includes(user.role)) {
        results.errorCount++;
        results.errors.push({ row: i + 1, email: user.email, error: `Invalid role: ${user.role}` });
        continue;
    }

    try {
      const userRecord = await admin.auth().createUser({
        email: user.email,
        displayName: user.displayName,
        password: 'defaultPassword123',
      });

      await admin.auth().setCustomUserClaims(userRecord.uid, { role: user.role });

      const userProfile = {
        displayName: user.displayName,
        email: user.email,
        photoURL: '',
        role: user.role,
        status: 'active',
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        lastLoginAt: null,
        studentId: user.studentId || '',
        employeeId: user.employeeId || '',
        department: user.department || '',
      };

      await db.collection('users').doc(userRecord.uid).set(userProfile);

      results.successCount++;
    } catch (error) {
      results.errorCount++;
      results.errors.push({ row: i + 1, email: user.email, error: error.message });
    }
  }

  return results;
});
