import React, {useEffect, useState} from 'react'
import {useAppDispatch, useAppSelector} from '../../app/hooks'
import {
  workerCreate,
  workersRequest,
  workersRemove,
} from '../../store/thunks/Workers'

import {
  workersSelectedCompany,
  pickAll,
  pickWorker,
  changeWorkerParams,
} from '../../store/slices/WorkersSlice'

import {selectedCompany} from '../../store/slices/CompanySlice'
import CustomTable from '../Table/CustomTable'
import AddWorker from '../AddEntityInputs/AddWorker'
import {Modal} from 'antd'

const Workers = () => {
  const workers = useAppSelector(workersSelectedCompany, (left, right) => left.length === right.length)
  const { isLoading, loadIsPossible } = useAppSelector((state) => ({
    isLoading: state.workers.isLoading,
    loadIsPossible: state.workers.loadIsPossible
  }))
  const company = useAppSelector(selectedCompany)
  const selected = useAppSelector((state) => state.workers.selectedWorkers)

  const dispatch = useAppDispatch()

  useEffect(() => {
    if (!isLoading && company && !workers.length) {
      dispatch(workersRequest({offset: workers.length, limit: 50, companyId: company.id}))
    }
  }, [company])

  const fieldOrder = [
    {title: 'Имя', field: 'firstName', editable: true},
    {title: 'Фамилия', field: 'lastName', editable: true},
    {title: 'Должность', field: 'post', editable: true},
  ]

  const [isOpen, isOpenChange] = useState<boolean>(false)

  const okHandler = () => {
    dispatch(workersRemove(selected))
    isOpenChange(false)

    if (loadIsPossible && company) {
      dispatch(workersRequest({offset: 0, limit: 20, companyId: company.id}))
    }
  }

  const onTableScroll = (e: React.UIEvent<HTMLTableSectionElement, UIEvent>) => {
    if (!isLoading) {
      const scrollHeight = e.currentTarget.scrollHeight
      const scrollBottomPosition = e.currentTarget.scrollTop + e.currentTarget.clientHeight

      if (scrollHeight - scrollBottomPosition === 0 && loadIsPossible && company) {
        dispatch(workersRequest({offset: workers.length, limit: 20, companyId: company.id}))
      }
    }
  }

  return (
    <>
      {
        !!company ?
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <CustomTable
              data={workers}
              selected={selected}
              pickAll={() => dispatch(pickAll(company.id))}
              pickFn={(id) => dispatch(pickWorker(id))}
              onScrollFn={onTableScroll}
              changeFieldFn={(changes, id) => dispatch(changeWorkerParams({changes, id}))}
              fieldOrder={fieldOrder}
            />

            <AddWorker
              createFn={(args) => dispatch(workerCreate({...args, companyId: company.id}))}
              handleRemove={() => isOpenChange(true)}
              removeButtonDisabled={!selected.length}
            />

            <Modal
              open={isOpen}
              closable={false}
              onOk={okHandler}
              onCancel={() => isOpenChange(false)}
              centered
              okText='Да'
              cancelText='Нет'
              okButtonProps={{ type: 'primary', danger: true }}
            >
              Вы уверены, что хотите удалить сотрудников из списка?
            </Modal>
          </div>
           : null
      }
    </>
  )
}


export default Workers