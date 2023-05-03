import {createAsyncThunk} from "@reduxjs/toolkit";
import {imitationCreateCompany, imitationRemoveCompanies, imitationRequestCompanies} from "../../utils/DataCreator";

export const companiesRequest = createAsyncThunk(
  'companies/imitationRequest',
  async (args: { offset: number, limit: number }) => {
    const list = await imitationRequestCompanies(args)
    return list
  }
)

export const createCompany = createAsyncThunk(
  'companies/imitationCreate',
  async (args: { name: string, address: string }) => {
    const list = await imitationCreateCompany(args)
    return list
  }
)

export const removeCompanies = createAsyncThunk(
  'companies/imitationRemove',
  async (args: Array<number>) => await imitationRemoveCompanies(args)
)