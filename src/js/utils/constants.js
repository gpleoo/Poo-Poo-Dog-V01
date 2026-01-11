/**
 * Poo-Poo Dog Tracker - Constants
 * Copyright (c) 2024-2025 Giampietro Leonoro & Monica Amato. All Rights Reserved.
 */

export const COPYRIGHT = {
  authors: ['Giampietro Leonoro', 'Monica Amato'],
  year: '2024-2025',
  rights: 'All Rights Reserved',
  protected: true,
  version: '2.0.0'
};

export const MAP_CONFIG = {
  defaultCenter: [45.4642, 9.1900],
  defaultZoom: 13,
  maxZoom: 19,
  tileLayerUrl: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
  clusterRadius: 80
};

export const GPS_CONFIG = {
  enableHighAccuracy: true,
  timeout: 10000,
  maximumAge: 0,
  updateThrottle: 1000
};

export const POOP_TYPES = {
  healthy: { label: '✅ Sana (Normale)', color: '#8B4513', icon: 'poop-happy' },
  soft: { label: '⚠️ Morbida', color: '#D2B48C', icon: 'poop-sad' },
  diarrhea: { label: '💧 Diarrea', color: '#D2B48C', icon: 'poop-sad' },
  hard: { label: '🪨 Dura/Stitica', color: '#3D2817', icon: 'poop-hard' },
  blood: { label: '🩸 Presenza di Sangue', color: '#FF4444', icon: 'poop-sick' },
  mucus: { label: '🫧 Presenza di Muco', color: '#FF4444', icon: 'poop-sick' }
};

export const POOP_SIZES = {
  small: 'Piccola',
  medium: 'Media',
  large: 'Grande'
};

export const POOP_COLORS = {
  normal: 'Marrone Normale',
  light: 'Chiaro',
  dark: 'Scuro',
  green: 'Verdastro',
  yellow: 'Giallastro',
  red: 'Rossastro'
};

export const POOP_SMELLS = {
  normal: 'Normale',
  strong: 'Molto Forte',
  unusual: 'Insolito'
};

export const FILTER_PERIODS = {
  all: 'Tutte',
  today: 'Oggi',
  yesterday: 'Ieri',
  week: 'Ultima Settimana',
  month: 'Ultimo Mese'
};

export const STORAGE_KEYS = {
  poops: 'poop-tracker-poops',
  dogPhoto: 'poop-tracker-dog-photo',
  dogProfile: 'poop-tracker-dog-profile',
  savedNotes: 'poop-tracker-saved-notes',
  foodHistory: 'poop-tracker-food-history',
  gpsEnabled: 'poop-tracker-gps-enabled',
  mapSettings: 'poop-tracker-map-settings',
  firstTime: 'poop-tracker-first-time'
};

export const CHART_COLORS = {
  healthy: '#4CAF50',
  soft: '#FF9800',
  diarrhea: '#F44336',
  hard: '#795548',
  blood: '#E91E63',
  mucus: '#9C27B0'
};

export const REMINDER_DAYS_BEFORE = 7; // Giorni prima della scadenza per mostrare promemoria

export const TOAST_DURATION = 3000; // Durata toast in ms
