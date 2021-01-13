import React from 'react'


export default function Profile({profileVisibility, onClick, profileDetails}) {
    const profileWidth = profileVisibility? "40%" : "0%";
    const profileTransition = profileVisibility? "0.5s":"10s";
    if(profileVisibility && profileDetails){
		let totalCapacity = 0;
		let totalRevenue = 0;
		
		profileDetails.forEach(element=>{
			totalCapacity += element["filled_capacity"];
			totalRevenue += element["total_revenue"];
		})
    return (
        
        <div className="sidenav text-center shadow" style={{width:profileWidth,transition:profileTransition}}>
            <button className="btn btn-primary closebtn py-0" onClick={()=>onClick()}>&times;</button>
					<div className="p-3 mt-3 text-muted text-center">
				<span className="fa fa-user fa-4x"></span>
		
					<h4><span className="badge badge-primary">{profileDetails[0]["host_name"]}</span></h4>
					<h4 className="pt-3"><span className="border border-primary p-2 badge">{profileDetails[0]["number"]}</span></h4>
					<h4><span className="border border-primary p-2 badge">{profileDetails[0]["email"]}</span></h4>
					</div>
					<div className="text-left row justify-content-center text-muted  ml-5" >
					<div>
					<h6><span className="fa fa-circle text-primary pt-3 mr-3"></span> {profileDetails.length} Properties</h6>
					<h6><span className="fa fa-circle text-primary mr-3"></span> {totalCapacity} Occupants</h6>
					<h6><span className="fa fa-circle text-primary mr-3"></span>INR {totalRevenue}  in Revenue</h6>
					</div>
					</div>
					<button className="btn btn-lg mt-5"><span className="fa fa-plus-circle text-primary fa-2x"></span></button>
					<h5 className="text-primary">Add property</h5>
        </div>
        
    )
    }
    else{
        return(null)
    }
}
