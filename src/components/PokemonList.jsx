import React from 'react';
import PokemonCard from './PokemonCard'
import Navbar from './Navbar';

export default class PokemonList extends React.Component{
    render(){
        return(
            <React.Fragment>
            <Navbar />
            <div className="card-deck">
                <PokemonCard />
                <PokemonCard />
                <PokemonCard />
                <PokemonCard />
            </div>
            </React.Fragment>
        )
    }
}