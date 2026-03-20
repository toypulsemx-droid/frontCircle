import React, { useEffect } from 'react'
import './Styles/types.css'
import {typesPay} from '../../../Utils/imgApp'

export const Type = () => {


   

  return (
    <>
    <div className="container_types_pay">
        <span>Formas de pago</span>
        <ul className='list-types'>
        {
            typesPay?.map((types,i)=>(
                <li key={i}>
                    <img src={types.URL} alt={types.alt} />
                </li>
            ))
        }
        </ul>
    </div>
    </>
  )
}
