import React from 'react'
import { Link } from 'react-router-dom';

export default class PokemonCard extends React.Component{
    render(){
        return(
            <div className={`card ${this.props.mainType}`}>
                <Link to={'pokemon/' + this.props.id + '/' + this.props.mainType}>
                <img
                    className="card-img-top" 
                    src={ `https://pokeres.bastionbot.org/images/pokemon/${this.props.id}.png` }
                    alt={this.props.name} 
                />
                </Link>
                <div className="card-body">
                    <h5 className="card-title">{this.props.name[0].toUpperCase().concat(this.props.name.slice(1))}</h5>
                    <div className='types'>
                        {this.props.types.map(type =>
                            <div className={`type ${type}2`}>{type}</div>
                        )}
                    </div>
                </div>
            </div>
        )
    }
}