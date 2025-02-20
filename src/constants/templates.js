export const PHOTO_STRIP_TEMPLATES = [
  {
    id: 'classic',
    name: 'Classic',
    background: 'white',
    styles: {
      container: 'bg-white',
      photo: 'rounded-lg shadow-sm',
    }
  },
  {
    id: 'vintage',
    name: 'Vintage',
    background: 'sepia',
    styles: {
      container: 'sepia bg-amber-50',
      photo: 'rounded-lg shadow-md border border-amber-200',
    }
  },
  {
    id: 'modern',
    name: 'Modern',
    background: 'gradient',
    styles: {
      container: 'bg-gradient-to-b from-purple-100 to-pink-100',
      photo: 'rounded-lg shadow-lg ring-1 ring-black ring-opacity-5',
    }
  }
];
