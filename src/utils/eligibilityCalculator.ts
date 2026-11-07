import { Scholarship, StudentProfile, EligibilityResult } from '../types';
import { formatCurrency } from './formatters';

export function normalizeGpa(raw: number, scale: '4.0' | '10.0' | '100%'): number {
  if (scale === '4.0') return Math.min(4.0, Math.max(0, raw));
  if (scale === '10.0') return Math.min(4.0, (raw / 10) * 4);
  if (scale === '100%') return Math.min(4.0, (raw / 100) * 4);
  return raw;
}

export function calculateEligibility(
  scholarship: Scholarship,
  profile: StudentProfile | null
): EligibilityResult {
  // If no profile, provide default preview state
  if (!profile || !profile.isOnboarded) {
    return {
      overallStatus: 'Potentially Eligible',
      score: 75,
      breakdown: [
        {
          rule: 'Profile Incomplete',
          type: 'general',
          isMet: 'partial',
          explanation: 'Complete your student profile to view verified diagnostic eligibility.',
          studentValue: 'Not set',
          requiredValue: 'Complete Profile',
        },
      ],
      summary: 'Please complete your profile to run a personalized eligibility assessment.',
    };
  }

  const breakdown: EligibilityResult['breakdown'] = [];
  let scoreSum = 0;
  let maxPossibleScore = 0;

  // 1. Education Level Check (Weight: 25)
  maxPossibleScore += 25;
  const eduMatch = scholarship.educationLevels.includes(profile.educationLevel);
  if (eduMatch) {
    scoreSum += 25;
    breakdown.push({
      rule: 'Education Level',
      type: 'education',
      isMet: true,
      explanation: `Your current level (${profile.educationLevel}) satisfies the scholarship requirement.`,
      studentValue: profile.educationLevel,
      requiredValue: scholarship.educationLevels.join(', '),
    });
  } else {
    breakdown.push({
      rule: 'Education Level',
      type: 'education',
      isMet: false,
      explanation: `Requires ${scholarship.educationLevels.join(' or ')}. You are listed as ${profile.educationLevel}.`,
      studentValue: profile.educationLevel,
      requiredValue: scholarship.educationLevels.join(', '),
    });
  }

  // 2. GPA / Academic Merit Check (Weight: 25)
  maxPossibleScore += 25;
  const studentGpaNormalized = normalizeGpa(profile.gpa, profile.gpaScale);
  if (studentGpaNormalized >= scholarship.minGpa) {
    scoreSum += 25;
    breakdown.push({
      rule: 'Academic Performance (GPA)',
      type: 'gpa',
      isMet: true,
      explanation: `Your GPA (${profile.rawGpa} / ~${studentGpaNormalized.toFixed(2)} on 4.0) meets the minimum requirement of ${scholarship.minGpa.toFixed(1)}.`,
      studentValue: `${profile.rawGpa} (${profile.gpaScale})`,
      requiredValue: `Min ${scholarship.minGpa.toFixed(1)} (4.0 Scale)`,
    });
  } else if (studentGpaNormalized >= scholarship.minGpa - 0.25) {
    scoreSum += 12;
    breakdown.push({
      rule: 'Academic Performance (GPA)',
      type: 'gpa',
      isMet: 'partial',
      explanation: `Your GPA (${profile.rawGpa}) is slightly under the preferred ${scholarship.minGpa.toFixed(1)}. Some review boards consider holistic experience.`,
      studentValue: `${profile.rawGpa}`,
      requiredValue: `Min ${scholarship.minGpa.toFixed(1)}`,
    });
  } else {
    breakdown.push({
      rule: 'Academic Performance (GPA)',
      type: 'gpa',
      isMet: false,
      explanation: `Requires a minimum GPA of ${scholarship.minGpa.toFixed(1)}. Your converted GPA is ~${studentGpaNormalized.toFixed(2)}.`,
      studentValue: `${profile.rawGpa}`,
      requiredValue: `Min ${scholarship.minGpa.toFixed(1)}`,
    });
  }

  // 3. Family Income Criteria (Weight: 25)
  maxPossibleScore += 25;
  if (!scholarship.maxIncome || scholarship.maxIncome >= 999999) {
    scoreSum += 25;
    breakdown.push({
      rule: 'Financial Income Limit',
      type: 'income',
      isMet: true,
      explanation: 'No family income ceiling specified; open to all economic backgrounds.',
      studentValue: formatCurrency(profile.annualFamilyIncome),
      requiredValue: 'No Cap',
    });
  } else if (profile.annualFamilyIncome <= scholarship.maxIncome) {
    scoreSum += 25;
    breakdown.push({
      rule: 'Financial Need (Income)',
      type: 'income',
      isMet: true,
      explanation: `Your annual family income (${formatCurrency(profile.annualFamilyIncome)}) matches the required ceiling of ${formatCurrency(scholarship.maxIncome)}.`,
      studentValue: formatCurrency(profile.annualFamilyIncome),
      requiredValue: `≤ ${formatCurrency(scholarship.maxIncome)}`,
    });
  } else if (profile.annualFamilyIncome <= scholarship.maxIncome * 1.15) {
    scoreSum += 10;
    breakdown.push({
      rule: 'Financial Need (Income)',
      type: 'income',
      isMet: 'partial',
      explanation: `Your reported income (${formatCurrency(profile.annualFamilyIncome)}) is marginally above the ${formatCurrency(scholarship.maxIncome)} benchmark.`,
      studentValue: formatCurrency(profile.annualFamilyIncome),
      requiredValue: `≤ ${formatCurrency(scholarship.maxIncome)}`,
    });
  } else {
    breakdown.push({
      rule: 'Financial Need (Income)',
      type: 'income',
      isMet: false,
      explanation: `Income ceiling is ${formatCurrency(scholarship.maxIncome)}. Your reported income is ${formatCurrency(profile.annualFamilyIncome)}.`,
      studentValue: formatCurrency(profile.annualFamilyIncome),
      requiredValue: `≤ ${formatCurrency(scholarship.maxIncome)}`,
    });
  }

  // 4. Demographics / Category / Field of Study (Weight: 25)
  maxPossibleScore += 25;
  const isGeneralCategory = scholarship.category === 'General' || scholarship.category === 'Merit-Based' || scholarship.category === 'Need-Based';
  const categoryMatch = 
    isGeneralCategory ||
    scholarship.category === profile.category ||
    profile.scholarshipPreferences.includes(scholarship.category) ||
    (scholarship.category === 'STEM' && (profile.course.toLowerCase().includes('comp') || profile.course.toLowerCase().includes('eng') || profile.course.toLowerCase().includes('data') || profile.course.toLowerCase().includes('tech')));

  if (categoryMatch) {
    scoreSum += 25;
    breakdown.push({
      rule: 'Target Category & Stream',
      type: 'category',
      isMet: true,
      explanation: `Your profile matches the targeted focus (${scholarship.category}).`,
      studentValue: `${profile.category} (${profile.course})`,
      requiredValue: scholarship.category,
    });
  } else {
    scoreSum += 8;
    breakdown.push({
      rule: 'Target Category & Stream',
      type: 'category',
      isMet: 'partial',
      explanation: `Primary cohort is designated for "${scholarship.category}". Cross-discipline applicants may be reviewed on petition.`,
      studentValue: `${profile.category} (${profile.course})`,
      requiredValue: scholarship.category,
    });
  }

  const percentage = Math.round((scoreSum / maxPossibleScore) * 100);

  let overallStatus: 'Eligible' | 'Potentially Eligible' | 'Not Eligible' = 'Not Eligible';
  let summary = '';

  if (percentage >= 85 && eduMatch) {
    overallStatus = 'Eligible';
    summary = 'Strong criteria alignment across education level, income profile, and academic standing.';
  } else if (percentage >= 55) {
    overallStatus = 'Potentially Eligible';
    summary = 'You meet key qualification baselines with minor variances. Verification or holistic review may apply.';
  } else {
    overallStatus = 'Not Eligible';
    summary = 'Your current profile does not satisfy one or more critical non-negotiable prerequisites (e.g. education level or income limits).';
  }

  return {
    overallStatus,
    score: percentage,
    breakdown,
    summary,
  };
}
