import {createSelector, createSlice, PayloadAction} from '@reduxjs/toolkit'
import {RootState} from '../store'
import {
  companiesRequest,
  createCompany,
  removeCompanies,
} from '../thunks/Companies'
import {
  workerCreate,
  workersRemove,
} from '../thunks/Workers'

export type CompanyType = {
  id: number
  name: string
  address: string
  workersCount: number
}

export interface CompanyState {
  companies: Array<CompanyType>
  selectedCompanyId: Array<number>
  selectedWorkers: Array<Worker>
  isLoading: boolean
  loadIsPossible: boolean
}

const initialState: CompanyState = {
  companies: [],
  selectedCompanyId: [],
  selectedWorkers: [],
  isLoading: false,
  loadIsPossible: true,
}

export const companySlice = createSlice({
  name: 'Company',
  initialState,
  reducers: {
    pickCompany: (state: CompanyState, {payload}: PayloadAction<number>) => {
      if (state.selectedCompanyId.includes(payload)) {
        state.selectedCompanyId.splice(state.selectedCompanyId.indexOf(payload), 1)
      } else {
        state.selectedCompanyId.push(payload)
      }
    },
    pickAllCompanies: (state: CompanyState) => {
      const selected = state.selectedCompanyId
      const total = state.companies

      if (selected.length === total.length) {
        state.selectedCompanyId = []
      } else {
        state.selectedCompanyId = state.companies.map((c) => c.id)
      }
    },
    changeCompanyParams: (state: CompanyState, {payload}: PayloadAction<{ id: number, changes: { [key: string]: string } }>) => {
      const index = state.companies.findIndex((c) => c.id === payload.id)

      if (index !== -1) {
        state.companies.splice(index, 1, Object.assign(state.companies[index], payload.changes))
      }
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(companiesRequest.pending, (state: CompanyState) => {
        state.isLoading = true
      })
      .addCase(companiesRequest.fulfilled, (state: CompanyState, {payload}) => {
        state.companies.push(...payload)

        state.isLoading = false
        state.loadIsPossible = payload.length > 19
      })
      .addCase(createCompany.fulfilled, (state: CompanyState, {payload}) => {
        state.companies.unshift(payload)
      })
      .addCase(removeCompanies.fulfilled, (state: CompanyState, {payload}) => {
        state.selectedCompanyId = []
        state.companies = state.companies.filter((c) => !payload.includes(c.id))
      })
      .addCase(workersRemove.fulfilled, (state: CompanyState, {payload}) => {
        const company = state.companies.find(({id}) => id === state.selectedCompanyId[0])

        if (company) {
          company.workersCount -= payload.length
        }
      })
      .addCase(workerCreate.fulfilled, (state: CompanyState, {payload}) => {
        const company = state.companies.find(({id}) => id === payload.companyId)

        if (company) {
          company.workersCount++
        }
      })
  },
})

const selectedCompanies = (state: RootState) => state.companies.selectedCompanyId
const totalCompanies = (state: RootState) => state.companies.companies

export const selectedCompany = createSelector(
  [selectedCompanies, totalCompanies],
  (selectedCompanies, totalCompanies) => selectedCompanies.length === 1 ? totalCompanies.find((c) => c.id === selectedCompanies[0]) : null
)

export const {
  pickCompany,
  pickAllCompanies,
  changeCompanyParams,
} = companySlice.actions

export default companySlice.reducer