import React, { useState } from 'react'
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import axios from 'axios';



export default function BuildingDetails({domain, details }) {

  const [modal, setModal] = useState(false);  //modal for all transaction button
  const [modalDataTransaction, setModalDataTransaction] = useState(null);
  const [modalTransactionKeys, setModalTrasactionKeys] = useState(null);

  const [broadcastModal, setBroadcastModal] = useState(false); //modal for broadcasting
  const [broadcastTitle, setBroadcastTitle] = useState("");
  const [broadcastDescription, setBroadcastDescription] = useState("");
  const [broadcastImage, setBroadcastImage] = useState("");



  const displayInfo= i => { //This is for displaying dates in the transaction modal
    let monthKeys = {
      "01": "January", "02": "February", "03": "March", "04": "April", "05": "May", "06": "June", "07": "July",
      "08": "August", "09": "September", "10": "October", "11": "November", "12": "December"
    }
    
      //i is '2020-07'
      console.log("Value of i ",i);
      console.log("Modal Data", modalDataTransaction);
      console.log("Modal Value ",modalDataTransaction[i]);
      let year = i.slice(0, 4);
      let month = monthKeys[i.slice(5)];
	  let total_expense = 0;
	  let total_revenue = 0
	  modalDataTransaction[i].forEach(element=>{
		  if(element.type === 'EXPENSE')
			total_expense += element.amount;
			else if(element.type === 'INCOME')
				total_revenue += element.amount
				
	  })
      
      
    
    return  [month,year,total_revenue,total_expense];
  }

  const toggleModal = () => {   //This function is for the transaction modal.
    setModal(!modal);
    const url = domain;
    let host_id = details.host_id;
    let property_id = details.property_id;
    let transaction_id = host_id + property_id;
    let params = {
      transaction_id: transaction_id
    }
    axios.post(url + '/transaction/get', params)
      .then(response => {
        if (response.data.status === 'Success') {
          console.log("Response data transactions ", response.data.data);
          let data = response.data.data;
          let keys = Object.keys(data);
          console.log(Object.keys(data).length, keys.length)
          setModalTrasactionKeys(keys);
          setModalDataTransaction(data);
        }
      })
      .catch(err => {
        console.log("Error in transaction get ", err);
      })
  }

  const toggleBroadcastModal = () => {
    setBroadcastModal(!broadcastModal);
  }

 
  const broadcastMessage = () => {
    let title = broadcastTitle.trim();
    let message = broadcastDescription.trim();
    message = message.replace(/\n/g, " "); //remove all new lines.
    console.log("Title :", title);
    console.log("Message :", message);
    console.log(broadcastImage)
  }


  if (details != null) {
    
    const filled_capacity = details["filled_capacity"];
    const total_capacity = details["total_capacity"];
    const estimated_revenue = details["estimated_revenue"];
    const total_revenue = details["total_revenue"];
    const total_expense = details["total_expense"];

    var num = (filled_capacity / total_capacity) * 100;
    num = num + "%";

    let displayTransactionData = "";
    if(modalTransactionKeys !== null && modalDataTransaction !== null && modalTransactionKeys.length === Object.keys(modalDataTransaction).length){
       displayTransactionData = modalTransactionKeys.map(key=>{
		   let a = displayInfo(key)
		  return  (<div key={key} className="mb-5 mt-3"><h6 className="text-center"><span className="px-4 py-2 rounded" style={{backgroundColor:'#afadad'}}> {a[0]} {a[1]}</span><span className="fa fa-circle text-success mr-2 ml-5" style={{fontSize : '10px'}}></span>INR {a[2]}  <span className="fa fa-circle text-danger mx-2" style={{fontSize : '10px'}}></span>INR {a[3]}
        <span className="fa fa-circle text-info mx-2" style={{fontSize : '10px'}}></span>INR {a[2] - a[3]}
        </h6>
			  {modalDataTransaction[key].map(element=>{
			
			if(element.type === 'INCOME'){
          return (
		  <div key={element.timestamp} className="row p-2 mt-3 bg-light shadow" style={{borderLeft:'15px solid #28a745'}}>
  <div className="col-3 text-success">{element.catagory} </div>
  <div className="col-3">{element.source} </div>
  <div className="col-3">{element.day} {a[0]}</div>
  <div className="col-3"><span className="px-2 py-1 rounded" style={{backgroundColor:'#afadad'}}> INR {element.amount}</span> </div>
</div>
          //<p className="bg-light p-2  rounded shadow"  key={element.timestamp}>{element.day} {a[0]} {element.catagory} {element.amount}</p>
          )
			  }
			  else if(element.type==='EXPENSE'){
				  return (
				   <div key={element.timestamp} className="row p-2 mt-3 bg-light shadow " style={{borderLeft:'15px solid #dc3545'}}>
  <div className="col-3 text-danger">{element.catagory} </div>
  <div className="col-3">{element.source} </div>
  <div className="col-3">{element.day} {a[0]}</div>
  <div className="col-3"><span className="px-2 py-1 rounded" style={{backgroundColor:'#afadad'}}> INR {element.amount}</span> </div>
</div>
				  )
			  }
			  })}
		  </div> )
        
      })
	  
    }
  
    return (
      <React.Fragment>
        <Modal isOpen={modal} toggle={toggleModal} className="modal-lg">
		 
          <ModalHeader toggle={toggleModal}> </ModalHeader>
		  <h4 className="text-center mt-3">All Transactions</h4>
		
          
          <ModalBody className="container px-5">
            {modalDataTransaction === null ? "Loading..." : displayTransactionData}
          </ModalBody>
          <ModalFooter>
            <button onClick={toggleModal} className="btn btn-primary">Cancel</button>
          </ModalFooter>
        </Modal>
        

        <Modal isOpen={broadcastModal} toggle={toggleBroadcastModal} className="modal-lg">
     
          <ModalHeader toggle={toggleBroadcastModal}>Notify All Tenants </ModalHeader>
      
    
          
          <ModalBody className="container px-5">
            <div className="row text-center">
              <div className="col-12 col-sm-12 col-md-5">
                <div className="form-group">
                  <label htmlFor="file-upload" className="btn btn-primary">
                      Add Image
                  </label>
                    <input id="file-upload" type="file" accept="image/*" className="" onChange={e => setBroadcastImage(URL.createObjectURL(e.target.files[0]))}/>
                </div>
                
                  <img src={broadcastImage} className="img-fluid rounded w-50"/>
               
                
              </div>
              <div className="col-12 col-sm-12 col-md-7">
                  <div className="form-group">
                    <input type="text" className="form-control" placeholder="Enter Title" style={{fontWeight:'bolder'}}
                    value={broadcastTitle}
                    onChange={e => setBroadcastTitle(e.target.value)}/>
                    <textarea className="form-control mt-5 mb-5" placeholder="Enter Description" rows="5"
                    value={broadcastDescription}
                    onChange={e => setBroadcastDescription(e.target.value)}></textarea>
                </div>
              </div>
              <button className="btn btn-primary px-3 shadow m-auto" onClick={broadcastMessage}>Broadcast</button>
            </div>
          </ModalBody>
          
        </Modal>

        <div className="shadow card p-3 rounded">
          <p>{filled_capacity}/{total_capacity}</p>
          <div className="progress mx-5">
            <div className="progress-bar" role="progressbar" style={{ width: num }}></div>
          </div>
          <p className="mt-2">Capacity</p>
          <hr />
          <div className="row no-gutters">
            <div className="col-12 col-sm-5">
              <p>{estimated_revenue}<br />
          Rent expected this month (INR)</p>
            </div>
            <div className="col-12 col-sm-7">
              <p>Graph Section</p>
            </div>
          </div>
          <hr />
          <div className="row no-gutters">
            <div className="col-12 col-sm-5">
              <p>{total_revenue}<br />
          Total Revenue Received (INR)</p>
            </div>
            <div className="col-12 col-sm-5 offset-sm-2">
              <p>{total_expense}<br />
          Total Expenditure Made (INR)</p>
            </div>
          </div>
          <hr />
          
            <div className="form-group">
              <label htmlFor="exampleFormControlTextarea1"><b className="text-primary">Broadcast</b> <p>This message will be sent to all occupants.</p></label>
              <textarea className="form-control" id="exampleFormControlTextarea1" rows="3"></textarea>
            </div>
            <div className="form-group">
              <button className="btn btn-primary shadow" onClick={toggleBroadcastModal}>Broadcast</button>
            </div>
            
          
          <hr />
          <button className="btn btn-outline-primary mx-5 shadow" onClick={toggleModal}>All Transactions</button>


        </div>
      </React.Fragment>
    )
  }
  else {
    return (null)
  }




}
