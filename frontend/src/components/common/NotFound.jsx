import React from 'react'

const NotFound = ({text}) => {
  return (
    <div className='card shadow border-0 py-5 text-center'>
        <h4>{ text ? text : 'Records not found'}</h4>
        <p>We could't find any matching records. Please adjust your search or filters and try again</p>

    </div>
  )
}

export default NotFound