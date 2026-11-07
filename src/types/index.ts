export type EducationLevel = 'High School' | 'Undergraduate' | 'Postgraduate' | 'Doctoral';

export type Category = 
  | 'General' 
  | 'STEM' 
  | 'Women in Tech' 
  | 'First-Generation' 
  | 'Minority / Underrepresented' 
  | 'Need-Based' 
  | 'Merit-Based' 
  | 'Arts & Humanities';

export type ApplicationStatus = 
  | 'Interested' 
  | 'Saved' 
  | 'Applying' 
  | 'Applied' 
  | 'Approved' 
  | 'Rejected';

export type DocumentStatus = 'Available' | 'Pending' | 'Uploaded (Demo)';

export interface EligibilityRule {
  rule: string;
  type: 'income' | 'gpa' | 'education' | 'category' | 'state' | 'course';
  detail: string;
}

export interface ApplicationStep {
  step: number;
  title: string;
  description: string;
}

export interface Scholarship {
  id: string;
  title: string;
  provider: string;
  providerType: 'Government' | 'Corporate' | 'Foundation' | 'University' | 'International';
  providerLogo?: string;
  amount: number;
  amountFormatted: string;
  awardType: 'Annual' | 'One-Time' | 'Full Tuition' | 'Monthly Stipend';
  deadline: string; // YYYY-MM-DD
  category: Category;
  educationLevels: EducationLevel[];
  courses: string[];
  minGpa: number; // On 4.0 scale
  maxIncome: number; // Max annual family income
  locationEligibility: string[]; // ['All'] or specific states
  requiredDocuments: string[];
  overview: string;
  fullDescription: string;
  eligibilityRules: EligibilityRule[];
  applicationSteps: ApplicationStep[];
  applicationUrl: string;
  isDemoVerified: boolean;
  source: string;
  tags: string[];
  featured?: boolean;
  renewable?: boolean;
  applicantCount?: number;
}

export interface StudentProfile {
  fullName: string;
  email: string;
  educationLevel: EducationLevel;
  institution: string;
  course: string;
  academicYear: string;
  state: string;
  annualFamilyIncome: number;
  category: string;
  gpa: number; // Normalized to 4.0 scale
  rawGpa: string; // E.g., "3.8" or "88%" or "9.2"
  gpaScale: '4.0' | '10.0' | '100%';
  scholarshipPreferences: string[];
  isOnboarded: boolean;
  avatarSeed?: string;
}

export interface ApplicationItem {
  id: string;
  scholarshipId: string;
  scholarshipTitle: string;
  provider: string;
  amountFormatted: string;
  deadline: string;
  status: ApplicationStatus;
  appliedDate?: string;
  notes: string;
  history: {
    status: ApplicationStatus;
    timestamp: string;
    note?: string;
  }[];
  lastUpdated: string;
}

export interface DocumentItem {
  id: string;
  name: string;
  type: string;
  status: DocumentStatus;
  fileName?: string;
  fileSize?: string;
  lastUpdated?: string;
  notes?: string;
  requiredByCount?: number;
}

export interface EligibilityResult {
  overallStatus: 'Eligible' | 'Potentially Eligible' | 'Not Eligible';
  score: number; // 0 - 100%
  breakdown: {
    rule: string;
    type: string;
    isMet: boolean | 'partial';
    explanation: string;
    studentValue: string;
    requiredValue: string;
  }[];
  summary: string;
}
