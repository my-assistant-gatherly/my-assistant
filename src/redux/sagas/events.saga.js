import { put, takeEvery, takeLatest } from 'redux-saga/effects';
import axios from 'axios';
//import eventsReducer from '../reducers/events.reducer';

function* fetchEvents(){
    try {
        //get events

        const eventsResponse = yield axios.get('/api/events');

        console.log('this is the event response', eventsResponse.data);

        // set values of the event reducer

        yield put({
            type: 'SET_EVENTS',
            payload: eventsResponse.data
        });
    } catch (error) {
        console.log('error in fetchEvent saga function', error);
    }
}

function* fetchEventsSaga(){
    yield takeEvery('FETCH_EVENTS', fetchEvents);
}

export default fetchEventsSaga;