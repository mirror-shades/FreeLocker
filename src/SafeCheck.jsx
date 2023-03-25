import { useState } from 'react'

const SafeCheck = ({ onsubmit, label, placeholderText, initButton, buttonName, owner, token, amount, length, percent }) => {
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
        <div>
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

	  <center>
          <div style={{backgroundColor:'white', display: 'inline-block', marginTop: '20px', borderRadius: '15px'}}>
          <p style={{textAlign: 'left'}}>Owner = {owner} </p>
          <p style={{textAlign: 'left'}}>Token = {token} </p>
          <p style={{textAlign: 'left'}}>Amount Locked = {amount} {percent}</p>
          <p style={{textAlign: 'left'}}>Unlock Date = {length} </p>
          </div>
          </center>
        </div>
      )
    }
}


export default SafeCheck
