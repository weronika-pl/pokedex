import React from 'react';
import PokemonCard from './PokemonCard'
import Navbar from './Navbar';
import axios from 'axios';
import Pokeball from './pokeball.gif'

export default class PokemonList extends React.Component{
    state = {
        url: 'https://pokeapi.co/api/v2/pokemon?offset=0&limit=807"',
        pokemonList: null,
    }

    async componentDidMount(){
        const respond = await axios.get(this.state.url)
        this.timerId = setTimeout(()=> this.setState({pokemonList: respond.data['results']}), 3000)
    }

    componentWillUnmount(){
        clearTimeout(this.timerId)
    }

    render(){
        return(
            <React.Fragment>
            <Navbar />
            <div className="card-deck">
                {this.state.pokemonList 
                    ? this.state.pokemonList.map(pokemon => 
                            <PokemonCard
                                key={pokemon.name}
                                id={pokemon.url.split('/')[pokemon.url.split('/').length - 2]}
                                name={pokemon.name}
                                url={pokemon.url}
                            />
                        )
                    : <div className='pokeball'>
                        <img className='loading' src={Pokeball} alt=''/>
                    </div>
                }
            </div>
            </React.Fragment>
        )
    }
}