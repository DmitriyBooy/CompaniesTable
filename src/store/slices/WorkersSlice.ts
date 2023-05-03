import {
  createAsyncThunk,
  createSelector,
  createSlice,
  PayloadAction,
} from '@reduxjs/toolkit'

import {
  imitationCreateWorker,
  imitationRequestWorkers,
  imitationWorkersRemove,
} from '../../utils/DataCreator'

import {RootState} from '../store'
import {removeCompanies} from '../thunks/Companies'
import { workerCreate, workersRemove, workersRequest } from '../thunks/Workers'

export type Worker = {
  id: number
  firstName: string
  lastName: string
  post: string
  companyId: number
}

export interface WorkersState {
  workers: Array<Worker>
  selectedWorkers: Array<number>
  isLoading: boolean
  loadIsPossible: boolean
}

const initialState: WorkersState = {
  workers: [],
  selectedWorkers: [],
  isLoading: false,
  loadIsPossible: true
}

export const workersSlice = createSlice({
  name: 'Workers',
  initialState,
  reducers: {
    pickWorker: (state: WorkersState, {payload}: PayloadAction<number>) => {
      if (state.selectedWorkers.includes(payload)) {
        state.selectedWorkers.splice(state.selectedWorkers.indexOf(payload), 1)
      } else {
        state.selectedWorkers.push(payload)
      }
    },
    pickAll: (state: WorkersState, {payload}: PayloadAction<number>) => {
      if (state.selectedWorkers.length === state.workers.filter((w) => w.companyId === payload).length) {
        state.selectedWorkers = []
      } else {
        state.selectedWorkers = state.workers.filter((w) => w.companyId === payload).map((w) => w.id)
      }
    },
    changeWorkerParams: (state: WorkersState, {payload}: PayloadAction<{ changes: { [key: string]: any }, id: number }>) => {
      const index = state.workers.findIndex((w) => w.id === payload.id)

      if (index !== -1) {
        state.workers.splice(index, 1, Object.assign(state.workers[index], payload.changes))
      }
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(workersRequest.pending, (state) => {
        state.isLoading = true
      })
      .addCase(workersRequest.fulfilled, (state, {payload}) => {
        state.workers.push(...payload)
        state.isLoading = false
        state.loadIsPossible = payload.length > 19
      })
      .addCase(removeCompanies.fulfilled, (state: WorkersState, {payload}) => {
        state.selectedWorkers = []
        state.workers = state.workers.filter((w) => !payload.includes(w.companyId))
      })
      .addCase(workersRemove.fulfilled, (state: WorkersState, {payload}) => {
        state.selectedWorkers = []
        state.workers = state.workers.filter((w) => !payload.includes(w.id))
      })
      .addCase(workerCreate.fulfilled, (state: WorkersState, {payload}) => {
        state.workers.unshift(payload)
      })
  }
})

const selectedCompanies = (state: RootState) => state.companies.selectedCompanyId
const companies = (state: RootState) => state.companies.companies

const workers = (state: RootState) => state.workers.workers

export const workersSelectedCompany = createSelector(
  [selectedCompanies, companies, workers],
  (selectedCompanies, companies, workers) => selectedCompanies.length === 1 ? workers.filter((w) => selectedCompanies.includes(w.companyId)) : []
)

export default workersSlice.reducer

export const {
  pickWorker,
  pickAll,
  changeWorkerParams,
} = workersSlice.actions