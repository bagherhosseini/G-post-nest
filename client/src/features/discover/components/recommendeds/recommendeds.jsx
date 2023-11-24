import React from 'react'
import './style.scss'

export default function Recommendeds() {
  return (
    <div className='recommendeds'>
        <h1>Recommended</h1>

        <div className='container'>
            <div className='recommended'>
                <div className='img' style={{background: 'url(https://bsmedia.business-standard.com/_media/bs/img/article/2022-11/25/full/1669400288-0753.jpg)'}}></div>
                <div className='info'>
                    <p className='name'>Medicine AI</p>
                    <p className='description'>Lorem ipsum dolor sit amet consectetur adipisicing elit.</p>
                </div>
            </div>
            
            <div className='recommended'>
                <div className='img' style={{background: 'url(https://www.scilifelab.se/wp-content/uploads/2023/05/PM_Capability_BG6_approved-April-2023.png)'}}></div>
                <div className='info'>
                    <p className='name'>Medicine AI</p>
                    <p className='description'>Lorem ipsum dolor sit amet consectetur adipisicing elit.</p>
                </div>
            </div>

            <div className='recommended'>
                <div className='img' style={{background: 'url(https://media.istockphoto.com/id/1365534802/photo/artificial-intelligence-in-healthcare-new-ai-applications-in-medicine.jpg?s=612x612&w=0&k=20&c=fER-h-Btq1Me74ST-QLU-CQqKvuJBM5JmH6kV0TUOB8=)'}}></div>
                <div className='info'>
                    <p className='name'>Medicine AI</p>
                    <p className='description'>Lorem ipsum dolor sit amet consectetur adipisicing elit.</p>
                </div>
            </div>

            <div className='recommended'>
                <div className='img' style={{background: 'url(https://static.scientificamerican.com/sciam/cache/file/01C9741F-6F6D-4882-8217D92370325AA7_source.jpg?w=590&h=800&3C039E98-EC8C-4FD9-A69A23883FF49235)'}}></div>
                <div className='info'>
                    <p className='name'>Medicine AI</p>
                    <p className='description'>Lorem ipsum dolor sit amet consectetur adipisicing elit.</p>
                </div>
            </div>

            <div className='recommended'>
                <div className='img' style={{background: 'url(https://media.licdn.com/dms/image/D4D12AQGo47NHpdGgXA/article-cover_image-shrink_720_1280/0/1675424449235?e=2147483647&v=beta&t=7_jcytnHJlH-CZ7lHQ5tPg20cZMvthnxE26qJDc68Sg)'}}></div>
                <div className='info'>
                    <p className='name'>Medicine AI</p>
                    <p className='description'>Lorem ipsum dolor sit amet consectetur adipisicing elit.</p>
                </div>
            </div>
        </div>
    </div>
  )
}
