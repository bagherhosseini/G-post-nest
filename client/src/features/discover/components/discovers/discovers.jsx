import React from 'react'
import './style.scss'
import { useUser } from '../../../../context/userInfoContext'

export default function Discovers() {
  const { user, setUser } = useUser();
  console.log(user);
  return (
    <div className='discovers'>
      <h1>Discover</h1>
      <div className='container'>
        <div className='discover discoverPrimary' style={{background: 'url(https://freedomandsafety.com/sites/default/files/ai-medical.jpg)'}}>
          <div className='info'>
            <p className='description'>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Quam similique numquam placeat dolores ea tenetur consectetur assumenda</p>
            <div className='AiInfo'>
              <img className='aiImg' src="https://www.ibanet.org/medias/ihp-sept-2022-6.jpg?context=bWFzdGVyfHJvb3R8MTkzNjIyfGltYWdlL2pwZWd8YUdGaUwyaG1PUzg0T1RJME5UZ3hOelUyT1RVNEwybG9jQzF6WlhCMExUSXdNakl0Tmk1cWNHY3wwZjUwZWQ3ZWFkNjZjMmM4Mjk3YmE2MDcxNDVmMDlkYjM4YzBiNDc0ZjljZTcxYmU2MmU3ZmQ3MjlmZDU3ZDFi" alt=""/>
              <div>
                <p>Ai Name</p>
                <p className='moreInfo'>Lorem ipsum dolor sit, amet consectetur adipisicing elit.</p>
              </div>
            </div>
          </div>
        </div>
        <div className='discover discoverSecondary' style={{background: 'url(https://governmentciomedia.com/sites/default/files/2018-05/robot%20ai%20medicine%20health.jpg)'}}>
          <div className='info'>
            <p className='description'>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Quam similique numquam placeat dolores ea tenetur consectetur assumenda</p>
            <div className='AiInfo'>
              <img className='aiImg' src="https://www.ibanet.org/medias/ihp-sept-2022-6.jpg?context=bWFzdGVyfHJvb3R8MTkzNjIyfGltYWdlL2pwZWd8YUdGaUwyaG1PUzg0T1RJME5UZ3hOelUyT1RVNEwybG9jQzF6WlhCMExUSXdNakl0Tmk1cWNHY3wwZjUwZWQ3ZWFkNjZjMmM4Mjk3YmE2MDcxNDVmMDlkYjM4YzBiNDc0ZjljZTcxYmU2MmU3ZmQ3MjlmZDU3ZDFi" alt=""/>
              <div>
                <p>Ai Name</p>
                <p className='moreInfo'>Lorem ipsum dolor sit, amet consectetur adipisicing elit.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
