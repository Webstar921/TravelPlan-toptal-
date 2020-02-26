import { takeLatest } from 'redux-saga/effects';
import { get, pick } from 'lodash';
import {
  GET_RECORD,
  GET_RECORDS,
  CREATE_RECORD,
  UPDATE_RECORD,
  DELETE_RECORD
} from '../modules/record';
import apiCall from '../api/apiCall';

const doGetRecord = apiCall({
  type: GET_RECORD,
  method: 'get',
  path: ({ payload }) => `/record/${payload.id}/`
})

const doGetRecords = apiCall({
  type: GET_RECORDS,
  method: 'get',
  path: () => `/record/`,
  payloadOnSuccess: (res, { payload }) => ({
    ...res,
    ...pick(get(payload, 'params', {}), ['from', 'to', 'page', 'page_size']),
  })
})

const doCreateRecord = apiCall({
  type: CREATE_RECORD,
  method: 'post',
  path: () => `/record/`
})

const doUpdateRecord = apiCall({
  type: UPDATE_RECORD,
  method: 'put',
  path: ({ payload }) => `/record/${payload.id}/`
})

const doDeleteRecord = apiCall({
  type: DELETE_RECORD,
  method: 'delete',
  path: ({ payload }) => `/record/${payload.id}`,
  payloadOnSuccess: (res, { payload }) => ({ id: payload.id })
})

export default function* rootSaga () {
  yield takeLatest(GET_RECORD, doGetRecord)
  yield takeLatest(GET_RECORDS, doGetRecords)
  yield takeLatest(CREATE_RECORD, doCreateRecord)
  yield takeLatest(UPDATE_RECORD, doUpdateRecord)
  yield takeLatest(DELETE_RECORD, doDeleteRecord)
}
