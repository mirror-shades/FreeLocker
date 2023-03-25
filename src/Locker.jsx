import { useState } from 'react'

const Locker = ({ onsubmit }) => {
  const [selection, setSelection] = useState('')
  const [type, setType] = useState('')
  const [token, setToken] = useState('')
  const [amount, setAmount] = useState('')
  const [length, setLength] = useState('')

  const onSubmit = (e) => {
    e.preventDefault()

    if (!amount) {
      alert('Value empty')
      return
    }

    onsubmit({ selection, type, token, amount, length })

    setSelection('')
    setType('')
    setToken('')
    setAmount('')
    setLength('')
  }
  if(selection === '') {
    return (
      <form className='add-form' onSubmit={onSubmit}>
          <div className='form-control'>
          <br/>
          <select
            type='selection'
            styles={{ option: (base) => ({ backgroundColor: 'blue' }) }}
            value={selection}
            onChange={(e) => setSelection(e.target.value)}>
            <option value="">Choose Fee Method</option>
          <option value="1">1% of locked token</option>
          <option value="2">0.1 ETH</option>
          </select>
          </div>
          </form>
    )
  }
  else if(selection === "1") {
    return (
      <form className='add-form' onSubmit={onSubmit}>
      <div className='form-control'>
      <br/>
      <select
      type='selection'
      value={selection}
      onChange={(e) => setSelection(e.target.value)}>
      <option value="1">1% of locked token</option>
      <option value="2">0.1 ETH</option>
      </select>
      <br/>
       <input
      type='amount'
      placeholder='Amount to lock'
      value={amount}
      onChange={(e) => {
        setType(1);
        setAmount(e.target.value);
      }}
      /><br/>
       <input
      type='length'
      placeholder='Days to lock'
      value={length}
      onChange={(e) => {
        setLength(e.target.value);
      }}
      />
      </div>
      <input type='submit' value='Lock' />
      <p>1% of the tokens locked will be taken as a fee</p>
      </form>
      )
  } else if(selection === "2") {
    return (
        <form className='add-form' onSubmit={onSubmit}>
        <div className='form-control'>
        <br/>
        <select
        type='selection'
        value={selection}
        onChange={(e) => setSelection(e.target.value)}>
        <option value="1">1% of locked token</option>
        <option value="2">0.1 ETH</option>
        </select><br />
         <input
        type='amount'
        placeholder='Amount to lock'
        value={amount}
        onChange={(e) => {
          setType(2);
          setAmount(e.target.value);
        }}
        /><br/>
         <input
        type='length'
        placeholder='Days to lock'
        value={length}
        onChange={(e) => {
          setLength(e.target.value);
        }}
        />
        </div>
        <input type='submit' value='Lock' />
      <p>0.1 ETH will be taken as a fee</p>
      </form>
      )
  }
}

export default Locker