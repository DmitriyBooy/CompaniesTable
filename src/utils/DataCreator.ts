import {CompanyType} from '../store/slices/CompanySlice'
import {Worker} from '../store/slices/WorkersSlice'

let COMPANIES_DATA: Array<CompanyType> = []
let WORKERS_DATA: Array<Worker> = []

const random = (min: number, max: number) => {
  return Math.round(Math.random() * (max - min) + min)
}

while (WORKERS_DATA.length < 15000) {
  WORKERS_DATA.push({
    firstName: `First-Name-${WORKERS_DATA.length + 1}`,
    lastName: `Last-Name-${WORKERS_DATA.length + 1}`,
    id: WORKERS_DATA.length + 1,
    companyId: random(1, 150),
    post: `Post-${random(1, 3)}`
  })
}

while (COMPANIES_DATA.length < 150) {
  COMPANIES_DATA.push({
    name: `Company-${COMPANIES_DATA.length + 1}`,
    id: COMPANIES_DATA.length + 1,
    address: `Company-address-${COMPANIES_DATA.length + 1}`,
    workersCount: WORKERS_DATA.filter((w) => w.companyId === COMPANIES_DATA.length + 1).length,
  })
}

export const imitationCreateCompany = (args: { name: string, address: string }): Promise<CompanyType> => {
  return new Promise((resolve) => {
    resolve({
      ...args,
      workersCount: 0,
      id: COMPANIES_DATA.length + 1,
    })
  })
}

export const imitationRemoveCompanies = (args: Array<number>): Promise<Array<number>> => {
  return new Promise((resolve) => {
    COMPANIES_DATA = COMPANIES_DATA.filter((c) => !args.includes(c.id))
    WORKERS_DATA = WORKERS_DATA.filter((w) => !args.includes(w.companyId))
    resolve(args)
  })
}

export const imitationRequestCompanies = ({offset, limit}: { offset: number, limit: number }): Promise<Array<CompanyType>> => {
  return new Promise((resolve) => {
    const newListElements: Array<CompanyType> = COMPANIES_DATA.slice(offset, offset + limit)

    resolve(newListElements)
  })
}

export const imitationRequestWorkers = ({ offset, limit, companyId }: { offset: number, limit: number, companyId: number }): Promise<Array<Worker>> => {
  return new Promise((resolve) => {
    const newListElements: Array<Worker> = WORKERS_DATA
      .filter((c) => c.companyId === companyId)
      .slice(offset, offset + limit)

    resolve(newListElements)
  })
}

export const imitationCreateWorker = (args: { firstName: string, lastName: string, post: string, companyId: number }): Promise<Worker> => {
  return new Promise((resolve) => {
    resolve({...args, id: WORKERS_DATA.length + 1})
  })
}

export const imitationWorkersRemove = (args: Array<number>): Promise<Array<number>> => {
  return new Promise((resolve) => {
    WORKERS_DATA = WORKERS_DATA.filter((w) => !args.includes(w.id))

    resolve(args)
  })
}