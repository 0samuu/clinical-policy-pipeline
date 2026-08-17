export interface UserCredential {
  userId: string;
  password: string;
  name: string;
  role: string;
  roleKey: string;
  department: string;
  avatarInitials: string;
  avatarColor: string;
}

export const CLINICAL_CREDENTIALS: UserCredential[] = [
  {
    userId: 'ADMIN001',
    password: 'admin',
    name: 'System Administrator',
    role: 'System & Policy Admin',
    roleKey: 'ROLE_POLICY_ADMIN',
    department: 'IT & Clinical Compliance',
    avatarInitials: 'AD',
    avatarColor: 'bg-cyan-700 dark:bg-cyan-600',
  },
  {
    userId: 'OWNER',
    password: 'owner0123!',
    name: 'Dr. Helena Taylor (Owner)',
    role: 'Medical Practice Owner / CMO',
    roleKey: 'ROLE_OWNER_CMO',
    department: 'Executive Management',
    avatarInitials: 'HT',
    avatarColor: 'bg-teal-700 dark:bg-teal-600',
  },
  {
    userId: 'HEADNURSE',
    password: 'headnurse0220!',
    name: 'Nurse Supervisor Robinson',
    role: 'Head Nurse / Director of Nursing',
    roleKey: 'ROLE_HEAD_NURSE',
    department: 'Nursing Administration',
    avatarInitials: 'HN',
    avatarColor: 'bg-emerald-700 dark:bg-emerald-600',
  },
  {
    userId: 'CLINICMANAGER',
    password: 'clinicmanager1234...',
    name: 'Patricia Evans',
    role: 'Clinic Operations Manager',
    roleKey: 'ROLE_CLINIC_MANAGER',
    department: 'Operations & Quality',
    avatarInitials: 'CM',
    avatarColor: 'bg-amber-600 dark:bg-amber-500',
  },
  {
    userId: 'OBNURSE1',
    password: 'obnurse1234!',
    name: 'Nurse Clara Dupont',
    role: 'OB/GYN Staff Nurse I',
    roleKey: 'ROLE_OB_NURSE',
    department: 'Obstetrics & Gynecology',
    avatarInitials: 'O1',
    avatarColor: 'bg-indigo-700 dark:bg-indigo-600',
  },
  {
    userId: 'OBNURSE2',
    password: 'obnurse2234!',
    name: 'Nurse Maya Jensen',
    role: 'OB/GYN Staff Nurse II',
    roleKey: 'ROLE_OB_NURSE',
    department: 'Obstetrics & Gynecology',
    avatarInitials: 'O2',
    avatarColor: 'bg-violet-700 dark:bg-violet-600',
  },
];

export function validateCredentials(userIdInput: string, passwordInput: string): UserCredential | null {
  const normalizedUser = userIdInput.trim().toUpperCase();
  const trimmedPass = passwordInput.trim();
  
  const found = CLINICAL_CREDENTIALS.find(
    (c) => c.userId.toUpperCase() === normalizedUser && c.password === trimmedPass
  );

  return found || null;
}
