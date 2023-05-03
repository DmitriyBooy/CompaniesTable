import {createAsyncThunk} from '@reduxjs/toolkit'
import {
  imitationCreateWorker,
  imitationRequestWorkers,
  imitationWorkersRemove,
} from '../../utils/DataCreator'

export const workersRequest = createAsyncThunk(
  'workers/imitationRequest',
  async (args: { offset: number, limit: number, companyId: number }) => {
    const list = await imitationRequestWorkers(args)
    return list
  }
)

export const workersRemove = createAsyncThunk(
  'workers/imitationRemove',
  async (args: Array<number>) => await imitationWorkersRemove(args)
)

export const workerCreate = createAsyncThunk(
  'workers/imitationCreate',
  async (args: { firstName: string, lastName: string, post: string, companyId: number }) => await imitationCreateWorker(args)
)