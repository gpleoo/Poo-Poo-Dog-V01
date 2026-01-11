/**
 * Poo-Poo Dog Tracker - Helper Functions
 * Copyright (c) 2024-2025 Giampietro Leonoro & Monica Amato. All Rights Reserved.
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

export function throttle(func, wait) {
  let waiting = false;
  return function executedFunction(...args) {
    if (!waiting) {
      func(...args);
      waiting = true;
      setTimeout(() => {
        waiting = false;
      }, wait);
    }
  };
}

export function generateId() {
  return Date.now() + Math.random().toString(36).substr(2, 9);
}

export function deepClone(obj) {
  return JSON.parse(JSON.stringify(obj));
}

export function formatDate(date, options = {}) {
  const defaultOptions = {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  };
  return new Date(date).toLocaleDateString('it-IT', { ...defaultOptions, ...options });
}

export function formatDateForInput(date) {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return year + '-' + month + '-' + day;
}

export function formatTimeForInput(date) {
  const d = new Date(date);
  const hours = String(d.getHours()).padStart(2, '0');
  const minutes = String(d.getMinutes()).padStart(2, '0');
  return hours + ':' + minutes;
}

export function readFileAsDataURL(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

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

export function getAgeString(birthdate) {
  if (!birthdate) return '';
  const birth = new Date(birthdate);
  const now = new Date();
  const diffMs = now - birth;
  const years = Math.floor(diffMs / (1000 * 60 * 60 * 24 * 365.25));
  const months = Math.floor((diffMs % (1000 * 60 * 60 * 24 * 365.25)) / (1000 * 60 * 60 * 24 * 30.44));
  if (years > 0) {
    return years + ' ' + (years === 1 ? 'anno' : 'anni') + (months > 0 ? ' e ' + months + ' ' + (months === 1 ? 'mese' : 'mesi') : '');
  } else if (months > 0) {
    return months + ' ' + (months === 1 ? 'mese' : 'mesi');
  } else {
    const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    return days + ' ' + (days === 1 ? 'giorno' : 'giorni');
  }
}
