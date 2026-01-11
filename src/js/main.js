/**
 * Poo-Poo Dog Tracker - Main Application
 * Copyright (c) 2024-2025 Giampietro Leonoro & Monica Amato. All Rights Reserved.
 */

import '../css/styles.css';
import 'leaflet/dist/leaflet.css';
import 'leaflet.markercluster/dist/MarkerCluster.css';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';

import { MapService } from './services/MapService.js';
import { DataService } from './services/DataService.js';
import { NotificationService } from './services/NotificationService.js';
import { ChartService } from './services/ChartService.js';
import { ExportService } from './services/ExportService.js';
import { UIManager } from './services/UIManager.js';

import { COPYRIGHT } from './utils/constants.js';
import { debounce } from './utils/helpers.js';

/**
 * Main PoopTracker Application Class
 */
class PoopTracker {
  constructor() {
    // Initialize services
    this.notificationService = new NotificationService();
    this.dataService = new DataService();
    this.mapService = new MapService(this.notificationService);
    this.chartService = new ChartService();
    this.exportService = new ExportService();
    this.uiManager = new UIManager();

    // Pending poop data
    this.pendingPoopData = null;

    // Display copyright
    this.displayCopyright();
  }

  /**
   * Initialize application
   */
  async init() {
    try {
      console.log('🚀 Initializing Poo-Poo Dog Tracker...');

      // Load data
      this.dataService.loadAll();

      // Initialize map
      this.mapService.initMap('map');

      // Load map settings
      const mapSettings = this.dataService.getMapSettings();
      this.mapService.setMapSettings(mapSettings);

      // Initialize GPS if enabled
      if (this.dataService.isGPSEnabled()) {
        await this.mapService.initGeolocation();
      }

      // Initialize UI
      this.uiManager.init();

      // Setup UI callbacks
      this.setupUICallbacks();

      // Setup map callbacks
      this.setupMapCallbacks();

      // Setup button event listeners
      this.setupButtonListeners();

      // Update UI
      this.updateAllUI();

      // Show welcome message if first time
      if (this.dataService.isFirstTime && !this.dataService.dogProfile.name) {
        setTimeout(() => {
          this.uiManager.openModal('dogProfileModal');
          this.notificationService.showInfo('👋 Benvenuto! Inserisci i dati del tuo cane per iniziare');
        }, 1000);
      }

      // Load existing poop markers
      const poops = this.dataService.getAllPoops();
      this.mapService.updatePoopMarkers(poops);

      // Update dog marker
      this.updateDogMarker();

      console.log('✅ Application initialized successfully!');
    } catch (error) {
      console.error('❌ Error initializing application:', error);
      this.notificationService.showError('Errore durante l\'inizializzazione dell\'app');
    }
  }

  /**
   * Display copyright in console
   */
  displayCopyright() {
    console.log(
      `%c© ${COPYRIGHT.year} ${COPYRIGHT.authors.join(' & ')}`,
      'font-size: 14px; font-weight: bold; color: #f093fb; text-shadow: 1px 1px 2px black;'
    );
    console.log(
      `%c${COPYRIGHT.rights}`,
      'font-size: 12px; color: #667eea;'
    );
    console.log(
      '%cUnauthorized use, reproduction or distribution is prohibited.',
      'font-size: 10px; color: #ff6b6b;'
    );
  }

  // ========== UI CALLBACKS ==========

  setupUICallbacks() {
    // Dog Profile
    this.uiManager.onSaveDogProfile = (data) => this.saveDogProfile(data);

    // Dog Photo
    this.uiManager.onSaveDogPhoto = (photoDataUrl) => this.saveDogPhoto(photoDataUrl);
    this.uiManager.onRemoveDogPhoto = () => this.removeDogPhoto();

    // Poop Details
    this.uiManager.onSavePoop = (data) => this.savePoopWithDetails(data);

    // Filters
    this.uiManager.onApplyFilters = (filters) => this.applyFilters(filters);

    // Export
    this.uiManager.onExportPDF = () => this.exportPDF();
    this.uiManager.onExportBackup = () => this.exportBackup();
    this.uiManager.onImportBackup = (backupData) => this.importBackup(backupData);

    // Settings
    this.uiManager.onGPSToggle = (enabled) => this.toggleGPS(enabled);
    this.uiManager.onRequestGPS = () => this.requestGPS();
    this.uiManager.onClearAllData = () => this.clearAllData();

    // Delete poop (global function)
    window.deletePoop = (poopId) => this.deletePoop(poopId);
  }

  setupMapCallbacks() {
    // User marker click - open dog photo modal
    this.mapService.onUserMarkerClick = () => {
      this.uiManager.openModal('dogPhotoModal');
    };

    // Poop marker click
    this.mapService.onMarkerClick = (poop) => {
      console.log('Poop clicked:', poop);
    };
  }

  setupButtonListeners() {
    // Add poop button (with GPS)
    const addPoopBtn = document.getElementById('addPoopBtn');
    if (addPoopBtn) {
      addPoopBtn.addEventListener('click', () => this.addPoop());
    }

    // Add manual poop button (without GPS)
    const addManualPoopBtn = document.getElementById('addManualPoopBtn');
    if (addManualPoopBtn) {
      addManualPoopBtn.addEventListener('click', () => this.addManualPoop());
    }

    // Center map button
    const centerMapBtn = document.getElementById('centerMapBtn');
    if (centerMapBtn) {
      centerMapBtn.addEventListener('click', () => this.mapService.centerOnUser());
    }
  }

  // ========== POOP MANAGEMENT ==========

  /**
   * Add poop with GPS
   */
  addPoop() {
    let userPosition = this.mapService.getUserPosition();

    // If no GPS position, use map center as fallback
    if (!userPosition) {
      const mapCenter = this.mapService.map.getCenter();
      userPosition = {
        lat: mapCenter.lat,
        lng: mapCenter.lng
      };
      this.notificationService.showInfo('📍 GPS non disponibile - usando centro mappa');
    }

    // Play sound
    this.notificationService.playPlopSound();

    // Find free position
    const existingPoops = this.dataService.getAllPoops();
    const position = this.mapService.findNearbyFreePosition(
      userPosition.lat,
      userPosition.lng,
      existingPoops
    );

    this.pendingPoopData = {
      lat: position.lat,
      lng: position.lng,
      isManual: false
    };

    this.uiManager.openPoopDetailsModal(false);
  }

  /**
   * Add manual poop (without GPS)
   */
  addManualPoop() {
    // Play sound
    this.notificationService.playPlopSound();

    this.pendingPoopData = {
      lat: null,
      lng: null,
      isManual: true
    };

    this.uiManager.openPoopDetailsModal(true);
    this.notificationService.showInfo('📝 Inserimento manuale - specifica data e ora');
  }

  /**
   * Save poop with details
   */
  savePoopWithDetails(details) {
    if (!this.pendingPoopData) {
      this.notificationService.showError('Errore: dati mancanti');
      return;
    }

    try {
      const poopData = {
        ...this.pendingPoopData,
        ...details
      };

      // Add poop to data service
      const poop = this.dataService.addPoop(poopData);

      // Save note if requested
      if (details.saveNote && details.notes) {
        this.dataService.saveNote(details.notes);
        this.uiManager.updateSavedNotesDropdown(this.dataService.getSavedNotes());
      }

      // Add marker to map (only if not manual)
      if (!poop.isManual && poop.lat && poop.lng) {
        this.mapService.addPoopMarker(poop);
      }

      // Update UI
      this.updateAllUI();

      // Show success message
      if (poop.isManual) {
        this.notificationService.showSuccess('📝 Cacca manuale registrata!');
      } else {
        this.notificationService.showSuccess('💩 Cacca registrata con successo!');
      }

      // Close modal
      this.uiManager.closeModal('poopDetailsModal');

      // Clear pending data
      this.pendingPoopData = null;
    } catch (error) {
      console.error('Error saving poop:', error);
      this.notificationService.showError(`Errore: ${error.message}`);
    }
  }

  /**
   * Delete poop
   */
  deletePoop(poopId) {
    try {
      const poop = this.dataService.getPoopById(poopId);
      if (!poop) {
        this.notificationService.showError('Cacca non trovata');
        return;
      }

      if (!confirm('Vuoi davvero cancellare questa cacca?')) {
        return;
      }

      // Remove from data service
      this.dataService.removePoop(poopId);

      // Remove marker from map
      this.mapService.removePoopMarker(poopId);

      // Close any open popups
      this.mapService.closePopups();

      // Update UI
      this.updateAllUI();

      this.notificationService.showSuccess('🗑️ Cacca rimossa con successo!');
    } catch (error) {
      console.error('Error deleting poop:', error);
      this.notificationService.showError(`Errore: ${error.message}`);
    }
  }

  // ========== DOG PROFILE ==========

  saveDogProfile(data) {
    try {
      this.dataService.saveDogProfile(data);

      this.uiManager.updateDogName(data.name);
      this.updateDogMarker();
      this.updateReminders();

      this.notificationService.showSuccess('✅ Profilo salvato con successo!');
      this.uiManager.closeModal('dogProfileModal');
    } catch (error) {
      console.error('Error saving dog profile:', error);
      this.notificationService.showError(`Errore: ${error.message}`);
    }
  }

  saveDogPhoto(photoDataUrl) {
    try {
      this.dataService.saveDogPhoto(photoDataUrl);
      this.uiManager.updateDogPhotoPreview(photoDataUrl);
      this.updateDogMarker();

      this.notificationService.showSuccess('📸 Foto salvata!');
      this.uiManager.closeModal('dogPhotoModal');
    } catch (error) {
      console.error('Error saving dog photo:', error);
      this.notificationService.showError(`Errore: ${error.message}`);
    }
  }

  removeDogPhoto() {
    try {
      this.dataService.removeDogPhoto();
      this.uiManager.updateDogPhotoPreview(null);
      this.updateDogMarker();

      this.notificationService.showInfo('Foto rimossa');
      this.uiManager.closeModal('dogPhotoModal');
    } catch (error) {
      console.error('Error removing dog photo:', error);
      this.notificationService.showError(`Errore: ${error.message}`);
    }
  }

  updateDogMarker() {
    const dogPhoto = this.dataService.getDogPhoto();
    const dogProfile = this.dataService.getDogProfile();
    const dogName = dogProfile.name || 'il tuo cane';

    this.mapService.updateUserMarker(dogPhoto, dogName);
    this.uiManager.updateDogPhotoPreview(dogPhoto);
  }

  // ========== FILTERS & STATISTICS ==========

  applyFilters(filters) {
    try {
      const filteredPoops = this.dataService.getFilteredPoops(filters);

      // Update map markers
      this.mapService.updatePoopMarkers(filteredPoops);

      // Update statistics WITH FILTERED DATA
      const stats = this.dataService.calculateStatistics(filteredPoops);
      this.uiManager.updateStats(stats);

      // Update recent list
      this.uiManager.updateRecentPoopsList(filteredPoops);

      // Update charts
      this.updateCharts(filteredPoops);

      this.notificationService.showInfo(`Filtri applicati: ${filteredPoops.length} cacche trovate`);
    } catch (error) {
      console.error('Error applying filters:', error);
      this.notificationService.showError('Errore durante l\'applicazione dei filtri');
    }
  }

  updateCharts(poops = null) {
    const poopsData = poops || this.dataService.getAllPoops();

    if (poopsData.length > 0) {
      this.chartService.createTypeChart('typeChart', poopsData);
      this.chartService.createTimelineChart('timelineChart', poopsData, 30);
      this.chartService.createFoodChart('foodChart', poopsData);
    }
  }

  // ========== EXPORT ==========

  async exportPDF() {
    try {
      const filters = this.uiManager.getFilters();
      const poops = this.dataService.getFilteredPoops(filters);
      const dogProfile = this.dataService.getDogProfile();

      await this.exportService.exportPDF(poops, dogProfile, filters);

      this.notificationService.showSuccess('📄 PDF esportato con successo!');
    } catch (error) {
      console.error('Error exporting PDF:', error);
      this.notificationService.showError('Errore durante l\'esportazione del PDF');
    }
  }

  exportBackup() {
    try {
      const backupData = this.dataService.exportBackup();
      const dogProfile = this.dataService.getDogProfile();
      const dogName = dogProfile.name || 'cane';

      this.exportService.exportBackup(backupData, dogName);

      this.notificationService.showSuccess('💾 Backup esportato con successo!');
    } catch (error) {
      console.error('Error exporting backup:', error);
      this.notificationService.showError('Errore durante l\'esportazione del backup');
    }
  }

  importBackup(backupData) {
    try {
      this.dataService.importBackup(backupData);

      // Reload everything
      const poops = this.dataService.getAllPoops();
      this.mapService.updatePoopMarkers(poops);
      this.updateAllUI();

      this.notificationService.showSuccess('📂 Backup importato con successo!');
    } catch (error) {
      console.error('Error importing backup:', error);
      this.notificationService.showError(`Errore: ${error.message}`);
    }
  }

  // ========== SETTINGS ==========

  toggleGPS(enabled) {
    try {
      this.dataService.setGPSEnabled(enabled);
      this.mapService.setGPSEnabled(enabled);

      const status = this.mapService.getGPSStatus();
      this.uiManager.updateGPSStatus(status);

      if (enabled) {
        this.notificationService.showSuccess('GPS attivato');
      } else {
        this.notificationService.showInfo('GPS disattivato');
      }
    } catch (error) {
      console.error('Error toggling GPS:', error);
      this.notificationService.showError('Errore durante il cambio stato GPS');
    }
  }

  async requestGPS() {
    try {
      await this.mapService.initGeolocation();
      const status = this.mapService.getGPSStatus();
      this.uiManager.updateGPSStatus(status);
    } catch (error) {
      console.error('Error requesting GPS:', error);
    }
  }

  clearAllData() {
    try {
      this.dataService.clearAllData();
      this.mapService.clearAllPoopMarkers();
      this.chartService.destroyAllCharts();
      this.updateAllUI();

      this.notificationService.showSuccess('🗑️ Tutti i dati sono stati cancellati!');

      // Reload page to reset everything
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } catch (error) {
      console.error('Error clearing data:', error);
      this.notificationService.showError('Errore durante la cancellazione dei dati');
    }
  }

  // ========== UI UPDATES ==========

  updateAllUI() {
    // Update counters
    const poops = this.dataService.getAllPoops();
    this.uiManager.updatePoopCounter(poops.length);

    // Update statistics
    const stats = this.dataService.getStatistics();
    this.uiManager.updateStats(stats);

    // Update food suggestions and filters
    const foodHistory = this.dataService.getFoodHistory();
    this.uiManager.updateFoodSuggestions(foodHistory);
    this.uiManager.updateFoodFilter(foodHistory);

    // Update saved notes
    const savedNotes = this.dataService.getSavedNotes();
    this.uiManager.updateSavedNotesDropdown(savedNotes);

    // Update recent poops list
    this.uiManager.updateRecentPoopsList(poops);

    // Update charts
    this.updateCharts(poops);

    // Update dog name
    const dogProfile = this.dataService.getDogProfile();
    this.uiManager.updateDogName(dogProfile.name);

    // Update dog profile form
    this.uiManager.populateDogProfileForm(dogProfile);

    // Update reminders
    this.updateReminders();

    // Update GPS status
    const gpsStatus = this.mapService.getGPSStatus();
    this.uiManager.updateGPSStatus(gpsStatus);

    // Save map settings
    const mapSettings = this.mapService.getMapSettings();
    this.dataService.saveMapSettings(mapSettings);
  }

  updateReminders() {
    const dogProfile = this.dataService.getDogProfile();
    this.uiManager.updateReminders(dogProfile);
  }

  // ========== CLEANUP ==========

  destroy() {
    this.mapService.destroy();
    this.chartService.destroyAllCharts();
  }
}

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  const app = new PoopTracker();
  app.init();

  // Store app instance globally for debugging
  window.poopTrackerApp = app;
});
