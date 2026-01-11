/**
 * Poo-Poo Dog Tracker - Achievements Service
 * Copyright (c) 2024-2025 Giampietro Leonoro & Monica Amato. All Rights Reserved.
 */

export class AchievementsService {
  constructor() {
    // Grid configuration: 1000m x 1000m quadrants
    this.GRID_SIZE_METERS = 1000;
    this.COMPLETION_THRESHOLD = 20; // poops needed to complete a quadrant

    // Points system
    this.POINTS_PER_QUADRANT = 100;

    // Badges configuration
    this.BADGES = {
      explorer: { threshold: 5, name: 'Esploratore Urbano', icon: '🗺️', points: 500 },
      adventurer: { threshold: 10, name: 'Avventuriero', icon: '🎒', points: 1000 },
      conqueror: { threshold: 20, name: 'Conquistatore della Città', icon: '👑', points: 2000 },
      nomad: { threshold: 50, name: 'Nomade delle Cacche', icon: '🌍', points: 5000 }
    };
  }

  /**
   * Calculate grid cell ID from coordinates
   * @param {number} lat - Latitude
   * @param {number} lng - Longitude
   * @returns {string} Grid cell ID (e.g., "41_12")
   */
  getGridCell(lat, lng) {
    // Convert meters to degrees (approximate)
    // At equator: 1 degree latitude ≈ 111,320 meters
    // 1000m ≈ 0.009 degrees
    const gridSizeDegrees = this.GRID_SIZE_METERS / 111320;

    // Calculate grid cell indices
    const cellLat = Math.floor(lat / gridSizeDegrees);
    const cellLng = Math.floor(lng / gridSizeDegrees);

    return `${cellLat}_${cellLng}`;
  }

  /**
   * Get grid cell bounds
   * @param {string} cellId - Grid cell ID
   * @returns {Object} Bounds with north, south, east, west
   */
  getGridCellBounds(cellId) {
    const [cellLat, cellLng] = cellId.split('_').map(Number);
    const gridSizeDegrees = this.GRID_SIZE_METERS / 111320;

    return {
      south: cellLat * gridSizeDegrees,
      north: (cellLat + 1) * gridSizeDegrees,
      west: cellLng * gridSizeDegrees,
      east: (cellLng + 1) * gridSizeDegrees
    };
  }

  /**
   * Get grid cell center coordinates
   * @param {string} cellId - Grid cell ID
   * @returns {Object} Center coordinates {lat, lng}
   */
  getGridCellCenter(cellId) {
    const bounds = this.getGridCellBounds(cellId);
    return {
      lat: (bounds.north + bounds.south) / 2,
      lng: (bounds.east + bounds.west) / 2
    };
  }

  /**
   * Calculate quadrants from poops array
   * @param {Array} poops - Array of poop objects
   * @returns {Object} Quadrants data { cellId: { count, poops: [] } }
   */
  calculateQuadrants(poops) {
    const quadrants = {};

    poops.forEach(poop => {
      // Skip manual poops without GPS
      if (!poop.lat || !poop.lng) return;

      const cellId = this.getGridCell(poop.lat, poop.lng);

      if (!quadrants[cellId]) {
        quadrants[cellId] = {
          cellId,
          count: 0,
          poops: [],
          completed: false
        };
      }

      quadrants[cellId].count++;
      quadrants[cellId].poops.push(poop);

      // Check if quadrant is completed
      if (quadrants[cellId].count >= this.COMPLETION_THRESHOLD) {
        quadrants[cellId].completed = true;
      }
    });

    return quadrants;
  }

  /**
   * Calculate total points from quadrants
   * @param {Object} quadrants - Quadrants data
   * @returns {number} Total points
   */
  calculatePoints(quadrants) {
    let totalPoints = 0;

    Object.values(quadrants).forEach(quadrant => {
      if (quadrant.completed) {
        totalPoints += this.POINTS_PER_QUADRANT;
      }
    });

    return totalPoints;
  }

  /**
   * Get unlocked badges based on completed quadrants
   * @param {number} completedCount - Number of completed quadrants
   * @returns {Array} Array of unlocked badges
   */
  getUnlockedBadges(completedCount) {
    const unlocked = [];

    Object.entries(this.BADGES).forEach(([key, badge]) => {
      if (completedCount >= badge.threshold) {
        unlocked.push({
          key,
          ...badge,
          unlocked: true
        });
      }
    });

    return unlocked;
  }

  /**
   * Get next badge to unlock
   * @param {number} completedCount - Number of completed quadrants
   * @returns {Object|null} Next badge or null if all unlocked
   */
  getNextBadge(completedCount) {
    const badges = Object.entries(this.BADGES)
      .map(([key, badge]) => ({ key, ...badge }))
      .sort((a, b) => a.threshold - b.threshold);

    for (const badge of badges) {
      if (completedCount < badge.threshold) {
        return {
          ...badge,
          progress: completedCount,
          remaining: badge.threshold - completedCount
        };
      }
    }

    return null; // All badges unlocked!
  }

  /**
   * Get full achievements statistics
   * @param {Array} poops - Array of poop objects
   * @returns {Object} Complete achievements data
   */
  getAchievements(poops) {
    const quadrants = this.calculateQuadrants(poops);
    const completedQuadrants = Object.values(quadrants).filter(q => q.completed);
    const completedCount = completedQuadrants.length;
    const totalPoints = this.calculatePoints(quadrants);
    const unlockedBadges = this.getUnlockedBadges(completedCount);
    const nextBadge = this.getNextBadge(completedCount);

    // Get top quadrants by count
    const topQuadrants = Object.values(quadrants)
      .sort((a, b) => b.count - a.count)
      .slice(0, 5)
      .map(q => ({
        cellId: q.cellId,
        count: q.count,
        completed: q.completed,
        center: this.getGridCellCenter(q.cellId),
        progress: Math.min(100, (q.count / this.COMPLETION_THRESHOLD) * 100)
      }));

    return {
      totalPoints,
      totalQuadrants: Object.keys(quadrants).length,
      completedQuadrants: completedCount,
      completionRate: Object.keys(quadrants).length > 0
        ? Math.round((completedCount / Object.keys(quadrants).length) * 100)
        : 0,
      unlockedBadges,
      nextBadge,
      topQuadrants,
      quadrants // Full quadrants data for map overlay
    };
  }

  /**
   * Get color for quadrant based on poop count
   * @param {number} count - Number of poops in quadrant
   * @returns {string} CSS color
   */
  getQuadrantColor(count) {
    if (count >= this.COMPLETION_THRESHOLD) {
      return 'rgba(76, 175, 80, 0.5)'; // Green - Completed
    } else if (count >= 16) {
      return 'rgba(255, 152, 0, 0.5)'; // Orange - Almost there
    } else if (count >= 6) {
      return 'rgba(255, 235, 59, 0.5)'; // Yellow - In progress
    } else {
      return 'rgba(158, 158, 158, 0.3)'; // Gray - Started
    }
  }

  /**
   * Check if new achievement was unlocked
   * @param {number} oldCompletedCount - Previous completed count
   * @param {number} newCompletedCount - New completed count
   * @returns {Object|null} Newly unlocked badge or null
   */
  checkNewAchievement(oldCompletedCount, newCompletedCount) {
    if (newCompletedCount <= oldCompletedCount) return null;

    // Check if we crossed a badge threshold
    for (const [key, badge] of Object.entries(this.BADGES)) {
      if (oldCompletedCount < badge.threshold && newCompletedCount >= badge.threshold) {
        return {
          key,
          ...badge,
          justUnlocked: true
        };
      }
    }

    // Check if we just completed a new quadrant
    if (newCompletedCount > oldCompletedCount) {
      return {
        type: 'quadrant',
        name: 'Zona Completata!',
        icon: '🎯',
        points: this.POINTS_PER_QUADRANT
      };
    }

    return null;
  }
}
