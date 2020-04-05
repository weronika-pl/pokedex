import React from 'react'
import Pokedex from './pokedex.jpg'
import { Link } from 'react-router-dom';

export default class HomePage extends React.Component{
    render(){
        return <Link to='/main'><img src={Pokedex} className='pokedex' alt=''/></Link>
    }
}