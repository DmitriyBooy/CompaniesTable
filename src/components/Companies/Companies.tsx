import {useAppDispatch, useAppSelector} from '../../app/hooks'
import {
  changeCompanyParams,
  pickAllCompanies,
  pickCompany,
} from '../../store/slices/CompanySlice'

import {
  companiesRequest,
  createCompany,
  removeCompanies,
} from '../../store/thunks/Companies'

import React, {useEffect, useState} from 'react'
import CustomTable from '../Table/CustomTable'
import AddCompany from '../AddEntityInputs/AddCompany'
import {Modal} from 'antd'

export default React.memo(function Companies() {
  const items = useAppSelector((state) => state.companies.companies)
  const dispatch = useAppDispatch()
  const {isLoading, loadIsPossible} = useAppSelector((state) => ({
    isLoading: state.companies.isLoading,
    loadIsPossible: state.companies.loadIsPossible,
  }))

  useEffect(() => {
    if (items.length === 0 && !isLoading) {
      dispatch(companiesRequest({offset: items.length, limit: 50}))
    }
  }, [dispatch])

  const selected = useAppSelector((state) => state.companies.selectedCompanyId, (left, right) => left.length === right.length)

  const onTableScroll = (e: React.UIEvent<HTMLTableSectionElement, UIEvent>) => {
    if (!isLoading) {
      const scrollHeight = e.currentTarget.scrollHeight
      const scrollBottomPosition = e.currentTarget.scrollTop + e.currentTarget.clientHeight

      if (scrollHeight - scrollBottomPosition === 0 && loadIsPossible) {
        dispatch(companiesRequest({offset: items.length, limit: 20}))
      }
    }
  }

  const fieldOrder = [
    { title: 'Название', field: 'name', editable: true },
    { title: 'Кол-во сотрудников', field: 'workersCount', editable: false },
    { title: 'Адрес', field: 'address', editable: true },
  ]

  const [removeIsOpen, isOpenChange] = useState<boolean>(false)

  const okHandler = () => {
    dispatch(removeCompanies(selected))
    isOpenChange(false)
    if (loadIsPossible) {
      dispatch(companiesRequest({offset: 0, limit: 50}))
    }
  }

  return(
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
      <CustomTable
        data={items}
        pickFn={(id: number) => dispatch(pickCompany(id))}
        pickAll={() => dispatch(pickAllCompanies())}
        selected={selected}
        fieldOrder={fieldOrder}
        onScrollFn={onTableScroll}
        changeFieldFn={(changes, id) => dispatch(changeCompanyParams({changes, id}))}
      />

      <AddCompany
        createFn={(c) => dispatch(createCompany(c))}
        removeButtonDisabled={!selected.length}
        handleRemove={() => isOpenChange(true)}
      />

      <Modal
        open={removeIsOpen}
        closable={false}
        onOk={okHandler}
        onCancel={() => isOpenChange(false)}
        centered
        okText='Да'
        cancelText='Нет'
        okButtonProps={{ type: 'primary', danger: true }}
      >
        Вы уверены, что хотите удаление компании из списка?
      </Modal>
    </div>
  )
})
