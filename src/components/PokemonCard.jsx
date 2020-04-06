import React from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom';

export default class PokemonCard extends React.Component{
    state = {
        types: []
    }

    async componentDidMount(){
        const pokemonInfoUrl = `https://pokeapi.co/api/v2/pokemon/${this.props.id}/`
        const pokemonRespond = await axios.get(pokemonInfoUrl)
        const types = pokemonRespond.data.types.map(type => type.type.name);
        this.setState({types: types})
    }

    render(){
        return(
            <div className={`card ${this.state.types[0]}`}>
                <Link to={'pokemon/' + this.props.id}></Link>
                <img
                    className="card-img-top" 
                    src={ `https://pokeres.bastionbot.org/images/pokemon/${this.props.id}.png` }
                    alt={this.props.name} 
                />
                <div className="card-body">
                    <h5 className="card-title">{this.props.name[0].toUpperCase().concat(this.props.name.slice(1))}</h5>
                    <div className='types'>
                        {this.state.types.map(type =>
                            <div className={`type ${type}2`}>{type}</div>
                        )}
                    </div>
                </div>
            </div>
        )
    }
}