/**
 * Poo-Poo Dog Tracker - Notification Service
 * Copyright (c) 2024-2025 Giampietro Leonoro & Monica Amato. All Rights Reserved.
 */

import { TOAST_DURATION } from '../utils/constants.js';

export class NotificationService {
  constructor() {
    this.toastElement = null;
    this.toastMessageElement = null;
    this.audioContext = null;
    this.init();
  }

  init() {
    this.toastElement = document.getElementById('infoToast');
    this.toastMessageElement = document.getElementById('toastMessage');
  }

  /**
   * Show toast notification
   */
  showToast(message, duration = TOAST_DURATION) {
    if (!this.toastElement || !this.toastMessageElement) {
      console.warn('Toast elements not found');
      return;
    }

    this.toastMessageElement.textContent = message;
    this.toastElement.classList.add('show');

    setTimeout(() => {
      this.toastElement.classList.remove('show');
    }, duration);
  }

  /**
   * Play "plop" sound effect
   */
  playPlopSound() {
    try {
      // Create AudioContext for synthetic sound
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();

      // Main oscillator for "fart" sound
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      // Configure funny "fart" sound - deeper and longer
      oscillator.type = 'sawtooth';
      oscillator.frequency.setValueAtTime(70, audioContext.currentTime);

      // Frequency variations for fart effect - lower frequencies
      oscillator.frequency.linearRampToValueAtTime(50, audioContext.currentTime + 0.08);
      oscillator.frequency.linearRampToValueAtTime(85, audioContext.currentTime + 0.18);
      oscillator.frequency.linearRampToValueAtTime(40, audioContext.currentTime + 0.32);
      oscillator.frequency.linearRampToValueAtTime(65, audioContext.currentTime + 0.5);

      // Volume envelope - extended duration
      gainNode.gain.setValueAtTime(0.6, audioContext.currentTime);
      gainNode.gain.linearRampToValueAtTime(0.55, audioContext.currentTime + 0.15);
      gainNode.gain.linearRampToValueAtTime(0.5, audioContext.currentTime + 0.3);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.55);

      // Play - extended duration to 550ms
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.55);

      // Close context after playback
      setTimeout(() => {
        audioContext.close();
      }, 600);
    } catch (error) {
      console.log('Audio not supported or error:', error);
    }
  }

  /**
   * Show success message
   */
  showSuccess(message) {
    this.showToast(`✅ ${message}`);
  }

  /**
   * Show error message
   */
  showError(message) {
    this.showToast(`❌ ${message}`, TOAST_DURATION * 1.5);
  }

  /**
   * Show warning message
   */
  showWarning(message) {
    this.showToast(`⚠️ ${message}`);
  }

  /**
   * Show info message
   */
  showInfo(message) {
    this.showToast(`ℹ️ ${message}`);
  }

  /**
   * Request notification permission (for future use)
   */
  async requestNotificationPermission() {
    if (!('Notification' in window)) {
      console.log('Browser does not support notifications');
      return false;
    }

    if (Notification.permission === 'granted') {
      return true;
    }

    if (Notification.permission !== 'denied') {
      const permission = await Notification.requestPermission();
      return permission === 'granted';
    }

    return false;
  }

  /**
   * Show browser notification
   */
  showBrowserNotification(title, options = {}) {
    if (Notification.permission === 'granted') {
      new Notification(title, {
        icon: '🐕',
        badge: '💩',
        ...options
      });
    }
  }
}
