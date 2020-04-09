import React from 'react';

export default class Filters extends React.Component{
    render(){
        return(
            <div>
                <div className='filter'>
                    <button className="btn btn-primary red" type="button" data-toggle="collapse" data-target="#collapseExample" aria-expanded="false" aria-controls="collapseExample">
                        FILTER
                    </button>
                </div>
                <div className="collapse" id="collapseExample">
                    <div className="container">
                        <div className="row">
                            {Object.keys(this.props.types).map(type => {
                                return <button className={this.props.types[type] ? 'col-sm red' : `col-sm ${type}`} value={type} onClick={this.props.filtering}>{type}</button>
                            })}
                        </div>   
                    </div>
                </div>
            </div>
        )
    }
}