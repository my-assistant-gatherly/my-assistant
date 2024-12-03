const initialState = {
  events: [],
  reminders: [],
  agenda: [],
  loading: false,
  error: null
};

const eventsReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'SET_EVENTS':
      return { ...state, events: action.payload };

    case 'SET_REMINDERS':
      return { ...state, reminders: action.payload };

    case 'SET_AGENDA':
      return { ...state, agenda: action.payload };

    case 'SET_LOADING':
      return { ...state, loading: action.payload };

    case 'SET_ERROR':
      return { ...state, error: action.payload };

    default:
      return state;
  }
};

export default eventsReducer;
