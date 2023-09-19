import {Image} from '@nextui-org/react'
import React from 'react'
import classNames from 'classnames'

const CardFooterContent = ({src, title, content, variant}) => {
  return (
    <div
      className={classNames('w-full items-center flex flex-col', {
        'border-x-2': variant === 'middle',
        '': variant === 'none',
      })}
    >
      <h6>{title}</h6>
      <div className='flex items-center'>
        <Image className='h-10' src={src} />
        {content}
      </div>
    </div>
  )
}

export default CardFooterContent
