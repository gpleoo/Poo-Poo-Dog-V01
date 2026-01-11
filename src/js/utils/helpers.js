/**
 * Poo-Poo Dog Tracker - Helper Functions
 * Copyright (c) 2024-2025 Giampietro Leonoro & Monica Amato. All Rights Reserved.
 */

/**
 * Debounce function to limit execution rate
 */
export function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

/**
 * Throttle function to limit execution frequency
 */
export function throttle(func, limit) {
  let inThrottle;
  return function(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

/**
 * Format date to Italian locale
 */
export function formatDate(date, options = {}) {
  const defaultOptions = {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    ...options
  };
  return new Date(date).toLocaleString('it-IT', defaultOptions);
}

/**
 * Format date to YYYY-MM-DD for input fields
 */
export function formatDateForInput(date) {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Format time to HH:MM for input fields
 */
export function formatTimeForInput(date) {
  const d = new Date(date);
  const hours = String(d.getHours()).padStart(2, '0');
  const minutes = String(d.getMinutes()).padStart(2, '0');
  return `${hours}:${minutes}`;
}

/**
 * Calculate days between two dates
 */
export function daysBetween(date1, date2) {
  const oneDay = 24 * 60 * 60 * 1000;
  const firstDate = new Date(date1);
  const secondDate = new Date(date2);
  return Math.round(Math.abs((firstDate - secondDate) / oneDay));
}

/**
 * Check if date is within period
 */
export function isDateInPeriod(date, period) {
  const now = new Date();
  const checkDate = new Date(date);

  switch (period) {
    case 'today':
      return checkDate.toDateString() === now.toDateString();
    case 'yesterday':
      const yesterday = new Date(now);
      yesterday.setDate(yesterday.getDate() - 1);
      return checkDate.toDateString() === yesterday.toDateString();
    case 'week':
      const weekAgo = new Date(now);
      weekAgo.setDate(weekAgo.getDate() - 7);
      return checkDate >= weekAgo;
    case 'month':
      const monthAgo = new Date(now);
      monthAgo.setMonth(monthAgo.getMonth() - 1);
      return checkDate >= monthAgo;
    case 'all':
    default:
      return true;
  }
}

/**
 * Generate unique ID
 */
export function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
}

/**
 * Sanitize HTML to prevent XSS
 */
export function sanitizeHTML(str) {
  const temp = document.createElement('div');
  temp.textContent = str;
  return temp.innerHTML;
}

/**
 * Deep clone object
 */
export function deepClone(obj) {
  return JSON.parse(JSON.stringify(obj));
}

/**
 * Check if object is empty
 */
export function isEmpty(obj) {
  return Object.keys(obj).length === 0;
}

/**
 * Calculate age from birthdate
 */
export function calculateAge(birthdate) {
  const today = new Date();
  const birth = new Date(birthdate);
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }

  return age;
}

/**
 * Get age string (years and months)
 */
export function getAgeString(birthdate) {
  const today = new Date();
  const birth = new Date(birthdate);

  let years = today.getFullYear() - birth.getFullYear();
  let months = today.getMonth() - birth.getMonth();

  if (months < 0) {
    years--;
    months += 12;
  }

  if (years === 0) {
    return `${months} mes${months !== 1 ? 'i' : 'e'}`;
  } else if (months === 0) {
    return `${years} ann${years !== 1 ? 'i' : 'o'}`;
  } else {
    return `${years} ann${years !== 1 ? 'i' : 'o'} e ${months} mes${months !== 1 ? 'i' : 'e'}`;
  }
}

/**
 * Download file
 */
export function downloadFile(content, filename, mimeType) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Read file as text
 */
export function readFileAsText(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => resolve(e.target.result);
    reader.onerror = (e) => reject(e);
    reader.readAsText(file);
  });
}

/**
 * Read file as data URL
 */
export function readFileAsDataURL(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => resolve(e.target.result);
    reader.onerror = (e) => reject(e);
    reader.readAsDataURL(file);
  });
}
