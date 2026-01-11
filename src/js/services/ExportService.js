/**
 * Poo-Poo Dog Tracker - Export Service
 * Copyright (c) 2024-2025 Giampietro Leonoro & Monica Amato. All Rights Reserved.
 */

import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { COPYRIGHT, POOP_TYPES } from '../utils/constants.js';
import { formatDate, downloadFile } from '../utils/helpers.js';

export class ExportService {
  constructor() {
    this.defaultFont = 'helvetica';
  }

  /**
   * Export data as PDF report
   */
  async exportPDF(poops, dogProfile, filters = {}) {
    try {
      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.width;
      let y = 20;

      // Title
      doc.setFontSize(20);
      doc.setFont(this.defaultFont, 'bold');
      doc.text('🐕 Poo-Poo Dog Tracker', pageWidth / 2, y, { align: 'center' });
      y += 10;

      doc.setFontSize(16);
      doc.text('Report Salute Intestinale', pageWidth / 2, y, { align: 'center' });
      y += 15;

      // Dog info
      if (dogProfile && dogProfile.name) {
        doc.setFontSize(12);
        doc.setFont(this.defaultFont, 'normal');
        doc.text(`Cane: ${dogProfile.name}`, 20, y);
        y += 7;

        if (dogProfile.dogBreed) {
          doc.text(`Razza: ${dogProfile.dogBreed}`, 20, y);
          y += 7;
        }

        if (dogProfile.dogBirthdate) {
          const birthdate = new Date(dogProfile.dogBirthdate);
          doc.text(`Data di Nascita: ${formatDate(birthdate, { year: 'numeric', month: 'long', day: 'numeric' })}`, 20, y);
          y += 7;
        }

        if (dogProfile.dogWeight) {
          doc.text(`Peso: ${dogProfile.dogWeight} kg`, 20, y);
          y += 7;
        }

        y += 5;
      }

      // Date range
      doc.setFontSize(10);
      doc.text(`Data report: ${formatDate(new Date())}`, 20, y);
      y += 5;

      if (filters.period && filters.period !== 'all') {
        doc.text(`Periodo: ${this.getPeriodLabel(filters.period)}`, 20, y);
        y += 5;
      }

      y += 5;

      // Statistics
      doc.setFontSize(14);
      doc.setFont(this.defaultFont, 'bold');
      doc.text('📊 Statistiche Generali', 20, y);
      y += 10;

      const stats = this.calculateStats(poops);

      doc.setFontSize(11);
      doc.setFont(this.defaultFont, 'normal');
      doc.text(`Totale cacche registrate: ${stats.total}`, 25, y);
      y += 7;
      doc.text(`Cacche sane: ${stats.healthy} (${stats.healthyPercentage}%)`, 25, y);
      y += 7;
      doc.text(`Cacche con problemi: ${stats.problems} (${stats.problemsPercentage}%)`, 25, y);
      y += 12;

      // Type distribution
      doc.setFontSize(14);
      doc.setFont(this.defaultFont, 'bold');
      doc.text('📋 Distribuzione per Tipo', 20, y);
      y += 10;

      doc.setFontSize(10);
      doc.setFont(this.defaultFont, 'normal');

      Object.entries(stats.typeDistribution).forEach(([type, count]) => {
        const percentage = ((count / stats.total) * 100).toFixed(1);
        const label = POOP_TYPES[type]?.label || type;
        doc.text(`${label}: ${count} (${percentage}%)`, 25, y);
        y += 6;
      });

      y += 10;

      // Table of poops
      if (poops.length > 0) {
        doc.setFontSize(14);
        doc.setFont(this.defaultFont, 'bold');
        doc.text('📝 Elenco Dettagliato', 20, y);
        y += 10;

        const tableData = poops.map(poop => [
          formatDate(new Date(poop.timestamp), { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' }),
          POOP_TYPES[poop.type]?.label || poop.type,
          poop.size || '-',
          poop.color || '-',
          poop.food || '-',
          poop.notes ? (poop.notes.length > 30 ? poop.notes.substring(0, 30) + '...' : poop.notes) : '-'
        ]);

        doc.autoTable({
          startY: y,
          head: [['Data/Ora', 'Tipo', 'Dimensione', 'Colore', 'Cibo', 'Note']],
          body: tableData,
          theme: 'striped',
          headStyles: {
            fillColor: [102, 126, 234],
            font: this.defaultFont,
            fontStyle: 'bold'
          },
          styles: {
            font: this.defaultFont,
            fontSize: 9
          },
          columnStyles: {
            0: { cellWidth: 30 },
            1: { cellWidth: 35 },
            2: { cellWidth: 25 },
            3: { cellWidth: 25 },
            4: { cellWidth: 30 },
            5: { cellWidth: 40 }
          }
        });

        y = doc.lastAutoTable.finalY + 15;
      }

      // Health notes
      if (stats.problems > 0) {
        // Check if we need a new page
        if (y > 250) {
          doc.addPage();
          y = 20;
        }

        doc.setFontSize(14);
        doc.setFont(this.defaultFont, 'bold');
        doc.text('⚠️ Raccomandazioni', 20, y);
        y += 10;

        doc.setFontSize(10);
        doc.setFont(this.defaultFont, 'normal');

        if (stats.problemsPercentage > 30) {
          doc.text('• Elevata percentuale di problemi intestinali rilevata', 25, y);
          y += 6;
          doc.text('• Consigliamo una visita veterinaria per controllo', 25, y);
          y += 6;
        }

        if (stats.typeDistribution.blood > 0 || stats.typeDistribution.mucus > 0) {
          doc.text('• Presenza di sangue o muco - consultare veterinario', 25, y);
          y += 6;
        }

        if (stats.typeDistribution.diarrhea > 3) {
          doc.text('• Diarrea frequente - verificare alimentazione', 25, y);
          y += 6;
        }
      }

      // Footer
      const pageCount = doc.internal.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setFont(this.defaultFont, 'italic');
        doc.text(
          `© ${COPYRIGHT.year} ${COPYRIGHT.authors.join(' & ')} - Tutti i Diritti Riservati`,
          pageWidth / 2,
          doc.internal.pageSize.height - 10,
          { align: 'center' }
        );
      }

      // Save PDF
      const dogName = dogProfile?.name || 'cane';
      const filename = `report-${dogName}-${new Date().toISOString().split('T')[0]}.pdf`;
      doc.save(filename);

      return true;
    } catch (error) {
      console.error('Error exporting PDF:', error);
      throw new Error('Errore durante l\'esportazione del PDF');
    }
  }

  /**
   * Calculate statistics from poops
   */
  calculateStats(poops) {
    const total = poops.length;
    const healthy = poops.filter(p => p.type === 'healthy').length;
    const problems = total - healthy;

    const healthyPercentage = total > 0 ? ((healthy / total) * 100).toFixed(1) : 0;
    const problemsPercentage = total > 0 ? ((problems / total) * 100).toFixed(1) : 0;

    const typeDistribution = {};
    poops.forEach(poop => {
      typeDistribution[poop.type] = (typeDistribution[poop.type] || 0) + 1;
    });

    return {
      total,
      healthy,
      problems,
      healthyPercentage,
      problemsPercentage,
      typeDistribution
    };
  }

  /**
   * Get period label
   */
  getPeriodLabel(period) {
    const labels = {
      today: 'Oggi',
      yesterday: 'Ieri',
      week: 'Ultima Settimana',
      month: 'Ultimo Mese',
      all: 'Tutto il Periodo'
    };
    return labels[period] || period;
  }

  /**
   * Export backup as JSON
   */
  exportBackup(backupData, dogName = 'cane') {
    try {
      const filename = `backup-${dogName}-${new Date().toISOString().split('T')[0]}.json`;
      downloadFile(backupData, filename, 'application/json');
      return true;
    } catch (error) {
      console.error('Error exporting backup:', error);
      throw new Error('Errore durante l\'esportazione del backup');
    }
  }
}
