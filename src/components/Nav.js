import React from 'react'

export default function Nav({onClick, hostPropertyIds, onchange, currentBuilding, hostName}) {
	
	
	const buildings = hostPropertyIds ? hostPropertyIds.map((element,index) => {
		
			return (
				 <button key={element[0]} onClick={()=>onchange(element[0]) } className="dropdown-item" type="button">{element[1]}</button>
			)
		
	}) : null
	
    return (
        <div>
            <nav className="fixed-top shadow p-3 bg-light">
                <button className="btn" onClick={()=>onClick()}>
                    <span className="fa fa-bars fa-2x"></span>
                </button>
                
                <span className="dropdown ml-sm-3">
                <button className="btn border text-primary border-primary dropdown-toggle" type="button" id="dropdownMenu1" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
				{currentBuilding}
                </button>
                <div className="dropdown-menu" aria-labelledby="dropdownMenu1">
				 {buildings}
                </div>
                </span>

                <button className="btn ml-sm-3">
                    <span className="fa fa-trash fa-2x text-primary shadow"></span>
                </button>

              
                <span className="fa fa-user fa-lg mr-sm-3 d-none d-sm-inline"  style={{marginLeft : '50%'}}>
                </span>
                <span className="d-none d-sm-inline">
                {hostName}
                </span> 
                
                
                
            </nav>
        </div>
    )
}
