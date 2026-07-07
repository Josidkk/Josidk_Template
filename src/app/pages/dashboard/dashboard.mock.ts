// MOCK — reemplazar por un servicio HTTP.

export const MOCK_BAR_CHART_DATA = {
  labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
  datasets: [
    {
      data: [45, 52, 38, 65, 48, 72, 58, 85, 62, 78, 68, 92],
      backgroundColor: 'rgba(15, 15, 14, 0.85)',
      borderRadius: 6,
      barThickness: 20,
    },
    {
      data: [35, 42, 28, 55, 38, 62, 48, 75, 52, 68, 58, 82],
      backgroundColor: 'rgba(201, 197, 188, 0.5)',
      borderRadius: 6,
      barThickness: 20,
    }
  ],
};

export const MOCK_DOUGHNUT_CHART_DATA = {
  labels: ['América', 'Asia', 'Europa'],
  datasets: [
    {
      data: [1650, 350, 458],
      backgroundColor: ['#0F0F0E', '#E9A23B', '#4ECDC4'],
      borderWidth: 3,
      borderColor: '#FDFAF5',
    },
  ],
};
