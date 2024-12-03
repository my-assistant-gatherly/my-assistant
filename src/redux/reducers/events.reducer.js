const eventsReducer = (
    state = { events: [], loading: false, error: null },
    action
  ) => {
    switch (action.type) {
     
      case 'SET_EVENT':
        
        return { ...state, events: [...state.events, action.payload] };
  
      case 'SET_LOADING':
        return { ...state, loading: action.payload };
  
      case 'SET_ERROR':
        return { ...state, error: action.payload };
  
      default:
        return state;
    }
  };
  
  export default eventsReducer;
  