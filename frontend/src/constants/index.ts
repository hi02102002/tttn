export const ROUTES = {
   HOME: '/',
   LOGIN: '/login',
   REGISTER: '/register',
   FORGOT_PASSWORD: '/forgot-password',
   RESET_PASSWORD: '/reset-password',
   ADMIN: '/admin',
   CLASSROOMS: '/classrooms',
   STUDENTS: '/students',
   SUBJECTS: '/subjects',
   SCORES: '/scores',
   ROLES: '/roles',
   403: '/403',
   STUDENT_DASHBOARD: '/student-dashboard',
   STUDENT_REGISTER_SUBJECTS: '/register-subjects',
   STUDENT_UPDATE_PROFILE: '/update-profile',
   STUDENT_SCORES: '/student-scores',
};

export const ENDPOINTS = {
   STUDENTS: '/students',
   ROLES: '/roles',
   CLASSES: '/classes',
   SUBJECTS: '/subjects',
   SCORES: '/scores',
   AUTH: '/auths',
};

export const ADMIN_ROUTES = [
   ROUTES.CLASSROOMS,
   ROUTES.STUDENTS,
   ROUTES.SUBJECTS,
   ROUTES.SCORES,
   ROUTES.ROLES,
   ROUTES.HOME,
];

export const STUDENT_ROUTES = [
   ROUTES.STUDENT_DASHBOARD,
   ROUTES.STUDENT_REGISTER_SUBJECTS,
];

export const AUTH_ROUTES = [ROUTES.LOGIN];

export const API_URL = 'http://localhost:5000';
