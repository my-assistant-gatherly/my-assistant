import { put, takeLatest } from 'redux-saga/effects';
import axios from 'axios';

function* fetchUpcomingEvents() {
  try {
    yield put({ type: 'SET_LOADING', payload: true });
    const response = yield axios.get('/api/events/upcoming');
    yield put({ type: 'SET_EVENTS', payload: response.data });
  } catch (error) {
    console.error('Error fetching upcoming events:', error);
    yield put({ type: 'SET_ERROR', payload: 'Error fetching events' });
  } finally {
    yield put({ type: 'SET_LOADING', payload: false });
  }
}

function* fetchReminders() {
  try {
    const response = yield axios.get('/api/events/reminders');
    yield put({ type: 'SET_REMINDERS', payload: response.data });
  } catch (error) {
    console.error('Error fetching reminders:', error);
    yield put({ type: 'SET_ERROR', payload: 'Error fetching reminders' });
  }
}

function* fetchAgenda() {
  try {
    const response = yield axios.get('/api/events/agenda');
    yield put({ type: 'SET_AGENDA', payload: response.data });
  } catch (error) {
    console.error('Error fetching agenda:', error);
    yield put({ type: 'SET_ERROR', payload: 'Error fetching agenda' });
  }
}

function* eventsSaga() {
  yield takeLatest('FETCH_UPCOMING_EVENTS', fetchUpcomingEvents);
  yield takeLatest('FETCH_REMINDERS', fetchReminders);
  yield takeLatest('FETCH_AGENDA', fetchAgenda);
}

export default eventsSaga;