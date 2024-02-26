import { useState } from 'react';
import { Link } from 'react-router-dom'; 
import './selector.css'
import './app.css'

export default function Selector() {


  return (
    <div className='selector-container'>
        <div className='selector '>
        <div className='options-size'>Add venues</div>
        <div className='my-venues options-size'>My venues</div>
        <div className='options-size'>Applications</div>
        </div>
    </div>
  );
}