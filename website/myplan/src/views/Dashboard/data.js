const data = {
    cards: {
      0: { id: 0, content: 'Take out the garbage' },
      1: { id: 1, content: 'Watch my favorite show' },
      2: { id: 2, content: 'Charge my phone' },
      3: { id: 3, content: 'Cook dinner' },
    },
    columns: {
      0: {
        id: 0,
        title: 'To do',
        cardIds: [0,1,2,3],
      },
      1: {
        id: 1,
        title: 'Doing',
        cardIds: [],
      },
    },
    // Facilitate reordering of the columns
    columnOrder: [0,1],
  };
  
  export default data;