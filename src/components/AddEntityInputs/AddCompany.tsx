import {useState} from 'react'
import {Input, Button} from 'antd'

type AddCompanyProps = {
  createFn: (args: { name: string, address: string }) => void
  handleRemove: () => void
  removeButtonDisabled: boolean
}

const AddCompany = ({createFn, handleRemove, removeButtonDisabled}: AddCompanyProps) => {
  const [name, setName] = useState('')
  const [address, setAddress] = useState('')

  return (
    <div style={{display: 'flex', flexDirection: 'column', gap: '0.25rem'}}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.25rem' }}>
        <Input
          placeholder='Название компании'
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <Input
          placeholder='Адрес'
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        />
      </div>

      <Button
        onClick={() => createFn({name, address})}
        disabled={!(name && address)}
      >
        Добавить
      </Button>

      <Button
        onClick={handleRemove}
        disabled={removeButtonDisabled}
        style={removeButtonDisabled ? {} : { background: 'rgba(255,0,0, 0.7)', color: 'white' }}
      >
        Удалить выделенные компании
      </Button>
    </div>
  )
}

export default AddCompany