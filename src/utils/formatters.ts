export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(amount);
};

export const getDaysRemaining = (deadlineDateString: string): number => {
  const target = new Date(deadlineDateString).getTime();
  const now = new Date().getTime();
  const diffMs = target - now;
  return Math.ceil(diffMs / (1000 * 60 * 60 * 24));
};

export const formatDeadlineText = (deadlineDateString: string): { label: string; urgency: 'urgent' | 'warning' | 'normal' | 'expired'; days: number } => {
  const days = getDaysRemaining(deadlineDateString);
  
  if (days < 0) {
    return { label: 'Deadline Passed', urgency: 'expired', days };
  }
  if (days === 0) {
    return { label: 'Due Today', urgency: 'urgent', days };
  }
  if (days === 1) {
    return { label: '1 Day Remaining', urgency: 'urgent', days };
  }
  if (days <= 7) {
    return { label: `${days} Days Left`, urgency: 'urgent', days };
  }
  if (days <= 21) {
    return { label: `${days} Days Left`, urgency: 'warning', days };
  }
  return { label: `${days} Days Left`, urgency: 'normal', days };
};

export const formatDatePretty = (dateString: string): string => {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  } catch {
    return dateString;
  }
};

export const getInitials = (name: string): string => {
  if (!name) return 'ST';
  const parts = name.trim().split(' ');
  if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};
