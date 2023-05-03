import s from './CustomTable.module.css'
import React from "react";

export type TableProps = {
  data: Array<{ id: number } & { [key: string]: any }>
  selected: Array<number>
  pickAll: () => void
  pickFn: (id: number) => void
  fieldOrder: Array<{ title: string, field: string, editable: boolean }>
  onScrollFn: (e: React.UIEvent<HTMLTableSectionElement, UIEvent>) => void
  changeFieldFn: (changes: { [key: string]: any }, id: number) => void
}

const CustomTable = ({data, selected, pickAll, pickFn, fieldOrder, onScrollFn, changeFieldFn}: TableProps) => {
  const change = (editable: boolean, id: number, changes: { [key: string]: any }) => {
    if (editable) changeFieldFn(changes, id)
  }

  return (
    <>
      <table
        border={1}
        cellSpacing={0}
        cellPadding={4}
        className={s.table}
      >
            <thead>
            <tr>
              <th>
                <input
                  type='checkbox'
                  checked={data.every(({id}) => selected.includes(id))}
                  onChange={pickAll}
                />
              </th>

              {
                fieldOrder.map((f) => (
                  <th key={`${f.title}-title`}>
                    {f.title}
                  </th>
                ))
              }
            </tr>
            </thead>

            <tbody
              onScroll={onScrollFn}
              className={data.length ? s.table_body : ''}
            >
            {
              data.length ? data.map((i) => (
                <tr
                  key={`field-${i.id}`}
                  className={`${s.table_row} ${selected.includes(i.id) ? s.selected : ''}`}
                >
                  <th>
                    <input
                      type='checkbox'
                      checked={selected.includes(i.id)}
                      onChange={() => pickFn(i.id)}
                    />
                  </th>

                  {
                    fieldOrder.map(({title, editable, field}) => (
                      <td
                        contentEditable={editable}
                        suppressContentEditableWarning={true}
                        onBlur={(e) => change(editable, i.id, {[field]: e.target.textContent})}
                        key={`${i.id}-${title}`}
                      >
                        {i[field]}
                      </td>
                    ))
                  }
                </tr>
              ))
              :
              <tr className={s.empty_list}>
                <td colSpan={fieldOrder.length + 1}>
                  <h1 style={{textAlign: 'center'}}>
                    Список пуст
                  </h1>
                </td>
              </tr>
            }
            </tbody>
          </table>

    </>
  )
}

// style={{
//   height: '100%',
//     display: 'flex',
//     alignItems: 'center',
//     justifyContent: 'center',
//     border: '1px solid rgba(0,0,0,0.3)'
// }}

export default CustomTable