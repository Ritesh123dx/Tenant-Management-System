import React from 'react'

export default function VisitorLog() {
    return (
        
        <div className="shadow card p-3 rounded">
            <h5 className="ml-3">Visitor Log</h5>
            <hr />
            <div className="p-1" style={{maxHeight:'50vh',overflowY:'scroll', overflowX : 'hidden'}}>
                 <div className="card shadow p-2 mt-2" style={{fontSize : '14px'}}>
                     <div className="row text-center">
                         <div className="col-6">Danit Atag</div>
                         <div className="col-6">24 Jan 2020 15:30</div>
                     </div>
                     <hr />
                     <div className="row text-center">
                         <div className="col-6"><h6><span className="badge badge-primary">+91 8697227631</span></h6></div>

                         <div className="col-6"><h6 className="d-inline mr-1"><span className="fa fa-square text-primary" style={{fontSize:'12px'}}></span></h6> Meeting H. Prasad</div>
                     </div>
                 </div>

                 <div className="card shadow p-2 mt-2" style={{fontSize : '14px'}}>
                     <div className="row text-center">
                         <div className="col-6">Danit Atag</div>
                         <div className="col-6">24 Jan 2020 15:30</div>
                     </div>
                     <hr />
                     <div className="row text-center">
                         <div className="col-6"><h6><span className="badge badge-primary">+91 8697227631</span></h6></div>

                         <div className="col-6"><h6 className="d-inline mr-1"><span className="fa fa-square text-primary" style={{fontSize:'12px'}}></span></h6> Meeting H. Prasad</div>
                     </div>
                 </div>

                 <div className="card shadow p-2 mt-2" style={{fontSize : '14px'}}>
                     <div className="row text-center">
                         <div className="col-6">Danit Atag</div>
                         <div className="col-6">24 Jan 2020 15:30</div>
                     </div>
                     <hr />
                     <div className="row text-center">
                         <div className="col-6"><h6><span className="badge badge-primary">+91 8697227631</span></h6></div>

                         <div className="col-6"><h6 className="d-inline mr-1"><span className="fa fa-square text-primary" style={{fontSize:'12px'}}></span></h6> Meeting H. Prasad</div>
                     </div>
                 </div>
            </div>
        </div>
    )
}
