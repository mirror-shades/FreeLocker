import { useState } from 'react'

const Input = ({ onsubmit, label, placeholderText, initButton, buttonName }) => {
  const [text, setText] = useState('')
  const [active, setActive] = useState(false)

  const onSubmit = (e) => {
    e.preventDefault()

    if (!text) {
      alert('Value empty')
      return
    }

    onsubmit({ text })

    setText('')
  }

    if(active === false) {
      return(
        <form>
          <button onClick={
            () => {setActive(true)}
          }>{initButton}</button>
        </form>
      )
    } else {
      return (
        <form className='add-form' onSubmit={onSubmit}>
          <div className='form-control'>
            <label>{label}</label>
            <br/>
            <input
              type='text'
              placeholder={placeholderText}
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
          </div>
          <input type='submit' value={buttonName} />
        </form>
      )
    }
}


export default Input