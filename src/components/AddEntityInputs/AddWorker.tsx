import {useState} from 'react'
import {Input, Button} from 'antd'

type AddCompanyProps = {
  createFn: (args: { firstName: string, lastName: string, post: string }) => void
  handleRemove: () => void
  removeButtonDisabled: boolean
}

const AddWorker = ({createFn, handleRemove, removeButtonDisabled}: AddCompanyProps) => {
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [post, setPost] = useState('')

  return (
    <div style={{display: 'flex', flexDirection: 'column', gap: '0.25rem'}}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.25rem' }}>
        <Input
          placeholder='Имя'
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
        />

        <Input
          placeholder='Фамилия'
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
        />

        <Input
          placeholder='Фамилия'
          value={post}
          onChange={(e) => setPost(e.target.value)}
        />
      </div>

      <Button
        onClick={() => createFn({firstName, lastName, post})}
        disabled={!(firstName && lastName && post)}
      >
        Добавить
      </Button>

      <Button
        onClick={handleRemove}
        disabled={removeButtonDisabled}
        style={removeButtonDisabled ? {} : { background: 'rgba(255,0,0, 0.7)', color: 'white' }}
      >
        Удалить выделенных сотрудников
      </Button>
    </div>
  )
}

export default AddWorker