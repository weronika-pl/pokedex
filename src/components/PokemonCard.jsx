import React from 'react'

export default class Pokemon extends React.Component{
    render(){
        return(
            <div className="card grass">
                <img
                    className="card-img-top" 
                    src="https://vignette.wikia.nocookie.net/pokemony/images/4/43/Bulbasaur.png/revision/latest/scale-to-width-down/350?cb=20150824101614&path-prefix=pl" 
                    alt="Card image cap" 
                />
                <div className="card-body">
                    <h5 className="card-title">Bulbasaur</h5>
                    <div className='types'>
                        <div className='type grass2'>Grass</div><div className='type poison2'>Poison</div>
                    </div>
                </div>
            </div>
        )
    }
}