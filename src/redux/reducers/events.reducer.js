const eventsReducer = (state = [], action) => {
    
    if (action.type === 'SET_EVENTS') {
        console.log('SET_EVENTS payload:', action.payload);
        return action.payload;

    }
        return state;
        
    }

export default eventsReducer;