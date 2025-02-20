export const PHOTO_STRIP_TEMPLATES = [
  {
    id: 'classic',
    name: 'Classic',
    background: 'white',
    styles: {
      container: 'bg-white rounded-lg shadow-lg',
      photo: 'rounded-none', 
      background: '#ffffff'
    }
  },
  {
    id: 'vintage',
    name: 'Vintage',
    background: 'sepia',
    styles: {
      container: 'bg-[#f5e6d3] rounded-lg shadow-lg',
      photo: 'rounded-none sepia brightness-95 contrast-105',
      background: '#f5e6d3'
    }
  },
  {
    id: 'modern',
    name: 'Modern',
    background: 'gradient',
    styles: {
      container: 'bg-gradient-to-b from-rose-100 to-teal-100 rounded-lg shadow-lg',
      photo: 'rounded-none shadow-sm',
      background: '#fff1f2'
    }
  }
];
