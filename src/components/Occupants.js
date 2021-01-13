import React from 'react';
import {Modal,ModalHeader,ModalBody,ModalFooter} from 'reactstrap';
import axios from 'axios';



export class Occupants extends React.Component {
  
    constructor(props) {
    super(props);

    this.state = { 
        //domain : "http://127.0.0.1:8000",
       domain : 'https://58qianw22h.execute-api.ap-south-1.amazonaws.com/production',
        host_id : null,
        property_id : null,
        estimated_revenue : null,
		total_revenue : null,
		total_expense : null,
        filled_capacity : null,
        modalDeleteTenant : false,
        modalDeleteTenantIndex : null,  //index to delete the tenant in tenantDetails array
       
        modalSearchTenantId : false, // to search the tenant using his ID
        modalAdd : false,   //to add new tenant.
        modalTenantSquare : false,
        modalTenantSquareIndex : null,  //index of the tenant
        modalTenantSettle : false,
        modalTenantSettleIndex : null,

        tenantSearchId : "",
        tenantFormDetails :{
            name : "",
            email : "",
            number : "",
            room_no : "",
            rent : 0,
            rent_pay_date : 1
        },
        tenantSettleDetails : {
            date : "",
            amount : 0,
        },
        tenantDetails : [],
        makingPostRequest : false
       
    }
    
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleInputTenantSettle = this.handleInputTenantSettle.bind(this);
    this.handleInputTenantSearchId = this.handleInputTenantSearchId.bind(this);
    
}

componentDidMount(){
    console.log("Component did mount callled");
    if(this.props.details!=null){
        
        console.log("Inside componentDidMount ");
        this.setState({
            property_id : this.props.details["property_id"],
            host_id : this.props.details["host_id"],
            estimated_revenue : this.props.details["estimated_revenue"],
            filled_capacity : this.props.details["filled_capacity"],
			total_revenue : this.props.details["total_revenue"],
			total_expense : this.props.details["total_expense"],

        })

        
        axios.post(this.state.domain+'/tenant/get',{tenant_id : this.props.details["host_id"]+this.props.details["property_id"]})
        .then(response=>{
         
          if(response.data.status === 'Success'){
            
            let tenantDetails = response.data.data;
            let a = []
            tenantDetails.forEach(x => {
					let dues = 0;
				x["tenant_dues"].forEach(s=>{
					dues += s["dues"];
				})
			
              a.push({...x,email : {isEditMode : false, value : x["email"]},
              name : {isEditMode : false, value : x["name"]},
              number : {isEditMode : false, value : x["number"]},
              rent : {isEditMode : false, value : x["rent"]},
              room_no : {isEditMode : false, value : x["room_no"]},
			  dues : dues})
            })
            
            
           
            this.setState({
                tenantDetails : a
            })
            
          }
        })
    }
    
}

componentDidUpdate(prevProps){
    
    console.log("componentDidUpdate");
    console.log(this.state["total_revenue"], this.state["total_expense"]);
        console.log(this.props.details.total_revenue, this.props.details.total_expense);
    if( (this.state["total_revenue"] !== this.props.details["total_revenue"] || this.state["total_expense"] !== this.props.details["total_expense"]) && (this.state["property_id"] === this.props.details["property_id"])){
        console.log("revenue CHECKING");
        

        this.setState({
            total_revenue : this.props.details["total_revenue"],
            total_expense : this.props.details["total_expense"]
        })
    }


    if(this.state["property_id"] !== this.props.details["property_id"]){
        console.log("CHANGING PROPERTY");
        console.log("total_revenue", this.props.details['total_revenue'], prevProps.details.total_revenue, prevProps.details);

        this.setState({
            property_id : this.props.details["property_id"],
            host_id : this.props.details["host_id"],
            estimated_revenue : this.props.details["estimated_revenue"],
            filled_capacity : this.props.details["filled_capacity"],
			total_revenue : this.props.details["total_revenue"],
			total_expense : this.props.details["total_expense"],
			tenantDetails : []
        })

        const tenantUrl = this.state.domain+'/tenant/get';
        axios.post(tenantUrl,{tenant_id : this.props.details["host_id"]+this.props.details["property_id"]})
        .then(response=>{
         
          if(response.data.status === 'Success'){
            
            let tenantDetails = response.data.data;
            let a = []
            tenantDetails.forEach(x => {
				let dues = 0;
				x["tenant_dues"].forEach(s=>{
					dues += s["dues"];
				})
				
              a.push({...x,email : {isEditMode : false, value : x["email"]},
              name : {isEditMode : false, value : x["name"]},
              number : {isEditMode : false, value : x["number"]},
              rent : {isEditMode : false, value : x["rent"]},
              room_no : {isEditMode : false, value : x["room_no"]},
			  dues: dues})
            })
            
            
            
            this.setState({
                tenantDetails : a
            })
            
          }
        })
    }
}

tenantSquare = (index) => {

        this.setState({
            makingPostRequest : true
        })

		let selectedTenantDetails = this.state.tenantDetails[index];
		let description = "Squaring rent of tenant name : " + selectedTenantDetails["name"]["value"];
		
		
			let transaction_id = this.state.host_id + this.state.property_id;
			let timestamp = new Date().getTime();
			
			let date = new Date()
			date = date.toLocaleDateString('en-GB');
			date = date.split("/");
			date = date[2]+"-"+date[1]+"-"+date[0];
			let type = 'INCOME';
			let amount = selectedTenantDetails["dues"];
			let catagory = 'Rent';
			let source = selectedTenantDetails["name"]["value"];
			let host_id = this.state.host_id;
			let property_id = this.state.property_id;
			let total_revenue = this.state.total_revenue + amount;
			let total_expense = this.state.total_expense;

          
		
		   let params = {
            transaction_id : transaction_id,
            timestamp : timestamp,
            date : date,
            type : type,
            amount : amount,
            catagory : catagory,
            source : source,
            host_id : host_id,
            description : description,
            property_id : property_id,
            total_revenue : total_revenue,
            total_expense : total_expense
        }
		
		
		const url = this.state.domain;
		
		axios.post(url+'/transaction/post',params)
        .then(response => {
            if(response.data.status === 'Success'){
                console.log("Successful transaction");
            
        }
		})
        .catch(err=>{
            console.log("Error in transaction ",err);
        })
		
		axios.post(url+'/transaction/square',{tenant_id : selectedTenantDetails["tenant_id"], timestamp : selectedTenantDetails["timestamp"]})
		.then(response => {
			if(response.data.status === 'Success'){
				
                let changeParams = {
                type : "INCOME",
                amount : this.state.tenantDetails[index]["dues"]
                }
            
            this.props.changePropertyDetails(changeParams);
            this.toggleModalTenantSquare();
            this.setState(prevState=>{
                let a = [...prevState.tenantDetails];
                a[index]["tenant_dues"].forEach(element=>{
                    element.paid_amount += element.dues;    //making all the dues to zero and paid amount to paid amount += dues
                    element.dues = 0
                });
               
                a[index]["dues"] = 0;
                return ({
                        
                        tenantDetails : a,
                        makingPostRequest : false

                })
            })
			}
		})
		.catch(err=>{
			console.log("Tenant Square not successfull error is  ",err);
		})
		
		

	}


handleInputTenantSearchId(event) {
    const value = event.target.value;
    console.log(value);
    this.setState({
        tenantSearchId : value
    })
}

handleInputChange(event) {  //for the tenant add form
        
        const target = event.target;
        const value = target.value;
        const name = target.name;
    
        this.setState((prevState)=>{
            
            let a = {...prevState.tenantFormDetails};
            a[name] = value;
            console.log(a[name]);
            return(
                {
                    tenantFormDetails : a
                }
            )
        });
      }

handleInputTenantSettle(event) {
        
        const target = event.target;
        console.log(target.type, target.name)
        const value = target.type === "number" ? parseInt(target.value) : target.value;
        const name = target.name;
    
        this.setState((prevState)=>{
            console.log(prevState)
            let a = {...prevState.tenantSettleDetails};
            a[name] = value;
            return(
                {
                    tenantSettleDetails : a
                }
            )

        });
        
      }     

tenantSettle = () => {
  
    let a = this.state.tenantSettleDetails;

    if (a["date"] === ""){
        alert("Date not selected");
        return false;
    }

    let indexOfTenant = this.state.modalTenantSettleIndex;
    let tenantDuesIndex = this.state.tenantDetails[indexOfTenant]["tenant_dues"].findIndex(element => element["month"] === a["date"]);

    console.log(tenantDuesIndex);

    if (a["amount"] > this.state.tenantDetails[indexOfTenant]["tenant_dues"][tenantDuesIndex]["dues"]){
        alert("Amount has exceeded dues for the chosen month");
        return false;
    }
    if (a["amount"] <= 0 || a["amount"] === "" || isNaN(a["amount"])){
        alert("Amount cannot be negative or zero");
        return false;
    }
    
    let Settledate = a["date"]
    if(a["amount"] === this.state.tenantDetails[indexOfTenant]["tenant_dues"][tenantDuesIndex]["dues"]) Settledate = ""; 

   
    let selectedTenantDetails = this.state.tenantDetails[indexOfTenant];
        let description = "Settling rent of tenant name : " + selectedTenantDetails["name"]["value"];

            let transaction_id = this.state.host_id + this.state.property_id;
            let timestamp = new Date().getTime();
            
            let date = new Date()
            date = date.toLocaleDateString('en-GB');
            date = date.split("/");
            date = date[2]+"-"+date[1]+"-"+date[0];
            let type = 'INCOME';
            let amount = a["amount"];
            let catagory = 'Part Payment';
            let source = selectedTenantDetails["name"]["value"];
            let host_id = this.state.host_id;
            let property_id = this.state.property_id;
            let total_revenue = this.state.total_revenue + amount;
            let total_expense = this.state.total_expense;

            let params = {
            transaction_id : transaction_id,
            timestamp : timestamp,
            date : date,
            type : type,
            amount : amount,
            catagory : catagory,
            source : source,
            host_id : host_id,
            description : description,
            property_id : property_id,
            total_revenue : total_revenue,
            total_expense : total_expense
        }

        
        
        axios.post(this.state.domain+'/transaction/post',params)
        .then(response => {
            if(response.data.status === 'Success'){
                console.log("Successful transaction");
            
        }
        })
        .catch(err=>{
            console.log("Error in transaction ",err);
        })

        axios.post(this.state.domain+'/transaction/settle', {
            tenant_id : selectedTenantDetails["tenant_id"],
            timestamp : selectedTenantDetails["timestamp"],
            amount : a["amount"],
            index_of_dues : tenantDuesIndex
        })
        .then(response => {
            if(response.data.status === 'Success'){
                console.log("Successful settlement");
            
        }
        })
        .catch(err=>{
            console.log("Error in settlement ",err);
        })
        


    let changeParams = {
            type : "INCOME",
            amount : a["amount"]
        }
        
    this.props.changePropertyDetails(changeParams);


    let b = [...this.state.tenantDetails];
        b[indexOfTenant]["dues"] -= a["amount"];
        b[indexOfTenant]["tenant_dues"][tenantDuesIndex]["dues"] -= a["amount"];
        b[indexOfTenant]["tenant_dues"][tenantDuesIndex]["paid_amount"] += a["amount"];

    this.setState({
        tenantSettleDetails : {
            date : Settledate,
            amount : 0,
        },
        
        tenantDetails : b,
        

    });

    console.log("After settle state is ",this.state);


     

}


tenantAddForm = () => {
        
        
        let a = {...this.state.tenantFormDetails};
        
        if (a["name"].length === 0) a["name"] = "No Name";
        if (a["email"].length === 0) a["email"] = "No Email";
        if (a["number"].length === 0) a["number"] = "No Number";
        if (a["room_no"].length === 0) a["room_no"] = "No Room No";
        if (parseInt(a["rent_pay_date"]) <= 0 || parseInt(a['rent_pay_date']) >= 16 ){
            alert("Rent pay date should be from 1st to 15th of a month");
            return false;
        }
        if (parseInt(a["rent"]) <=0){
            alert("Rent cannot be zero or negative");
            return false;
        }

        this.setState({
            makingPostRequest : true
        });


        const name = a["name"];
        const email = a["email"];
        const number = a["number"];
        const room_no = a["room_no"];
        const rent = parseInt(a["rent"]); 
        const rent_pay_date = parseInt(a["rent_pay_date"]);
        const url = this.state.domain+'/tenant/add';
        const timestamp = new Date().getTime();
        this.setState({
            tenantFormDetails :{
                name : "",
                email : "",
                number : "",
                room_no : "",
                rent : 0,
                rent_pay_date : 1
            }
        })
		
		let month = new Date()
		month = month.toLocaleDateString('en-GB');
		month = month.slice(3);
		
        let params = {
            name : name,
            email : email,
            number : number,
            room_no : room_no,
            rent : rent,
            rent_pay_date : rent_pay_date,
            timestamp : timestamp,
            host_id : this.state.host_id,
            property_id : this.state.property_id,
            incremented_revenue : parseInt(this.state.estimated_revenue) + parseInt(rent),
            incremented_filled_capacity : parseInt(this.state.filled_capacity) + parseInt(1),
			month : month
            
            }
            
        
        axios.post(url,params)
        .then(response => {
            if(response.data.status === 'Success'){
                
                this.props.changePropertyDetails({rent : rent, type : "add_tenant"});

                this.setState(prevState=>{
                    let params = {
                        dues : rent,
                        has_paid : false,
                        tenant_dues : [{month : month, rent : rent,paid_amount : 0, dues : rent}],
                        tenant_id : this.state.host_id + this.state.property_id,
                        timestamp : timestamp,
                        host_id : this.state.host_id,
                        property_id : this.state.property_id,
                        name : {isEditMode : false, value : name},
                        email : {isEditMode : false, value : email},
                        number : {isEditMode : false, value : number},
                        room_no : {isEditMode : false, value : room_no},
                        rent : {isEditMode : false, value : rent},
                    }
                    
                    let a = [...prevState.tenantDetails];
                    a.push(params);
                    
                    return ({
                        tenantDetails : a,
                        filled_capacity: this.state.filled_capacity + 1,
                        estimated_revenue : parseInt(this.state.estimated_revenue) + parseInt(rent),
                        makingPostRequest : false
                    })
                })

                this.toggleModalAdd();
                
            }
        })
        .catch(err=>{
            console.log("Error in Axiois Post request /tenant/add:  " ,err);
        })
        
        
    }

tenantDelete(index){
       
        this.setState({
            makingPostRequest : true
        });

        console.log("Delete called", index)
        const delTenantUrl = this.state.domain+'/tenant/delete';
        let tenant_id = this.state.tenantDetails[index]["tenant_id"];
        let timestamp = this.state.tenantDetails[index]["timestamp"];
        let host_id = this.state.host_id;
        let property_id = this.state.property_id;
        let decremented_revenue = parseInt(this.state.estimated_revenue) - parseInt(this.state.tenantDetails[index]["rent"]["value"]);
        let decremented_filled_capacity = parseInt(this.state.filled_capacity) - 1;
        

       if(tenant_id !== undefined && timestamp !== undefined && host_id!== undefined){
        let params = {
            tenant_id : tenant_id,
            timestamp : timestamp,
            host_id : host_id,
            property_id : property_id,
            decremented_revenue : decremented_revenue,
            decremented_filled_capacity : decremented_filled_capacity
        }
       

        axios.post(delTenantUrl,params)
        .then(response => {
            if(response.data.status === 'Success'){
                console.log("Deletion Successful");
                this.props.changePropertyDetails({rent : parseInt(this.state.tenantDetails[index]["rent"]["value"]), 
                    property_id:property_id,type : "delete"});

                this.toggleModalDeleteTenant();

                this.setState(prevState=>{
                    let a = [...prevState.tenantDetails];
                    a.splice(index,1);
                    return ({
                        
                        estimated_revenue : decremented_revenue,
                        filled_capacity : decremented_filled_capacity,
                        tenantDetails : a,
                        makingPostRequest : false
                    })
                })

                
                
            }
        }).catch(err=>{
            console.log("Error in Axiois Post request /tenant/delete:  " ,err);
        })
       }


    }
    

changeEditMode = (index,criteria) =>{
        
        console.log(index,this.state.tenantDetails[index][criteria]);
           this.setState((prevState)=>{
               let a = [...prevState.tenantDetails];
               a[index][criteria].isEditMode = !a[index][criteria].isEditMode;
               return {
                 tenantDetails : a
               }

           })
            console.log(index,this.state.tenantDetails[index][criteria]);
        
    }

editTenantDeatils(index,criteria,params){
        const urlEdit = this.state.domain+'/tenant/edit/';
        if(criteria === 'rent'){
            console.log("Inside rent change", params);
            let prevRent = parseInt(this.state.tenantDetails[index]["rent"].value);
            //deltaRent is the net change in rent--> final_rent - intial_rent
            let deltaRent = parseInt(this.refs[index+criteria].value) - parseInt(prevRent);
            console.log("Prev rent ",prevRent);
            console.log("change in  Rent ", deltaRent);
            let changeParams = {
                type : 'rent_change',
                rent : deltaRent
            }
           
            this.props.changePropertyDetails(changeParams);
            params[criteria] = parseInt(this.refs[index+criteria].value);
            params["revenue"] = parseInt(this.state.estimated_revenue) + parseInt(deltaRent);
            params["host_id"] = this.state.host_id;
            params["property_id"] = this.state.property_id;

            this.setState((prevState)=>{
                        let a = [...prevState.tenantDetails];
                        a[index][criteria].isEditMode = !a[index][criteria].isEditMode;
                        a[index][criteria].value = this.refs[index+criteria].value;
        
                        return{
                            estimated_revenue : params["revenue"],
                            tenantDetails : a,
        
                        }
                    })
            
    
            axios.post(urlEdit+criteria,params)
            .then(response=>{
                if(response.data.status === 'Success'){
                    console.log(criteria," changed successful");
                    
                }
            }).catch(err=>{
                console.log("Error changing Name");
            })

        }

        else{
        params[criteria] = this.refs[index+criteria].value;

         this.setState((prevState)=>{
                    let a = [...prevState.tenantDetails];
                    a[index][criteria].isEditMode = !a[index][criteria].isEditMode;
                    a[index][criteria].value = this.refs[index+criteria].value
    
                    return{
                        tenantDetails : a,
    
                    }
                })

        axios.post(urlEdit+criteria,params)
        .then(response=>{
            if(response.data.status === 'Success'){
                console.log(criteria," changed successful");
               
            }
        }).catch(err=>{
            console.log("Error changing Name");
        })
        }
    }

    updateComponentValue = (index,criteria) => {
        let params = {
            tenant_id : this.state.host_id + this.state.property_id,
            timestamp : this.state.tenantDetails[index]["timestamp"]
        }
        this.editTenantDeatils(index,criteria,params)   
              
    }
    

    renderEditView = (value,index,criteria) => {
        return (
            <div>
                <input className='form-control' style={{fontSize : '12px'}} type="text" defaultValue={value} ref={index+criteria} />
                <button className="btn btn-sm btn-danger py-0 mt-2" onClick={()=>this.changeEditMode(index,criteria)}><span className="fa fa-times"></span></button>&ensp;
                <button className="btn btn-sm btn-success py-0 mt-2" onClick={()=>this.updateComponentValue(index,criteria)}><span className="fa fa-check"></span></button>
            </div> 
        )
    }

    renderDefaultView = (value,index,criteria) => {
        return (
            <div className="d-inline" onDoubleClick={()=>this.changeEditMode(index,criteria)}>
            {value}
        </div>
        )
    }


    toggleModalAdd = () => {
        this.setState({modalAdd :!this.state.modalAdd});
    }
    toggleModalSearchTenantId = () => {
        this.setState({
            modalSearchTenantId : !this.state.modalSearchTenantId
        })
    }
    toggleModalDeleteTenant = (index = null) => { // Not null when the modal opens for that particular tenant. Null when user cancels the deletion. 
        
        this.setState({
            modalDeleteTenant :!this.state.modalDeleteTenant,
            modalDeleteTenantIndex : index
        });
    }

    toggleModalTenantSquare = (index = null) => {
         this.setState({
            modalTenantSquare :!this.state.modalTenantSquare,
            modalTenantSquareIndex : index
        });
    }

    toggleModalTenantSettle = (index = null) => {
        this.setState({
            modalTenantSettle :!this.state.modalTenantSettle,
            modalTenantSettleIndex : index
        });
    }

    displayMonth = (i) => {
        //i is of the form "08/2020"
        let monthKeys = {
              "01": "January", "02": "February", "03": "March", "04": "April", "05": "May", "06": "June", "07": "July",
              "08": "August", "09": "September", "10": "October", "11": "November", "12": "December"
            }

            i = i.split("/")

            return monthKeys[i[0]] + " " + i[1];

    }

    render(){
        const details = this.state.tenantDetails.map((details,index) => {
            
            return(
                <div key={details.timestamp} className="card my-3 rounded shadow text-center p-3">
                <div className="row">

            <div className="px-0 col-6 col-sm-6">
                {details.name.isEditMode ?  
                    this.renderEditView(details.name.value,index,'name')
                    : 
                    this.renderDefaultView(details.name.value,index,'name')
                }
            </div>
                    <div className="col-6 col-sm-6 text-primary"><span className="fa fa-circle mr-2 mb-2"></span><span>INR {details.dues}</span> </div>
                </div>
                <hr />
                <div className="row" style={{fontSize:'14px'}}>
<div className="col-6 col-sm-4"><span className="fa fa-phone text-primary"></span><br />{details.number.isEditMode ?  
        this.renderEditView(details.number.value,index,'number')
        : 
        this.renderDefaultView(details.number.value,index,'number')
    }</div>
<div className="col-6 col-sm-5"><span className="fa fa-envelope text-primary"></span><br />{details.email.isEditMode ?  
        this.renderEditView(details.email.value,index,'email')
        : 
        this.renderDefaultView(details.email.value,index,'email')
    }</div>
<div className="col-6 col-sm-3"><span className="fa fa-bed text-primary"></span><br />{details.room_no.isEditMode ?  
        this.renderEditView(details.room_no.value,index,'room_no')
        : 
        this.renderDefaultView(details.room_no.value,index,'room_no')
    }</div>
    
                </div>
                <hr />
                <div className="row">
                    <div className="col-7"> <span className="text-primary">Rent </span>: {details.rent.isEditMode ?  
        this.renderEditView(details.rent.value,index,'rent')
        : 
        this.renderDefaultView(details.rent.value,index,'rent')
    }
  
                    </div>
                    <div className="col-5">
                        <button className="btn btn-primary shadow btn-sm">Message</button>
                    </div>
                </div>
                <hr />
                <div className="row">
                    <div className="col-4">
                       
                        <button className="px-3 btn d-inline btn-outline-primary shadow btn-sm" onClick={()=>this.toggleModalTenantSettle(index)}>Settle</button>
                    </div>
                    <div className="col-4">
                        <button className="px-3 btn btn-outline-primary shadow btn-sm" onClick={()=>this.toggleModalTenantSquare(index)}>Square</button>
                    </div>
                    <div className="col-4">
                        <button className="px-3 btn btn-outline-primary shadow btn-sm" onClick={()=>this.toggleModalDeleteTenant(index)}>Remove</button>
                    </div>
                </div>
            </div>
        
            )
        });


    const settleDetails = this.state.modalTenantSettleIndex === null ? "Loading..." : this.state.tenantDetails[this.state.modalTenantSettleIndex]

    let settleDues = 0;
    let settleName = "";
    let displaySettleInfo = "";
    let displaySettleMonth = [];
    if(this.state.modalTenantSettleIndex !== null){
        
        settleName = settleDetails["name"]["value"];

        settleDetails["tenant_dues"].forEach(element => {
            settleDues += element["dues"]
        });

        displaySettleInfo = settleDetails["tenant_dues"].map((element,index)=>{

            if(element.dues !== 0){
                displaySettleMonth.push(<option key={index} value={element.month}>{this.displayMonth(element.month)}</option>)
                
            }
            return (
                  <div key={element.month} className="row text-center mt-3 rounded py-1 shadow">
                  <div className="col-3">{this.displayMonth(element.month)} </div>
                  <div className="col-3">{element.rent}</div>
                  <div className="col-3">{element.paid_amount}</div>
                  <div className="col-3"><h5><span className="badge badge-primary badge-pill px-3">{element.dues}</span></h5></div>
                </div>
            )
        });



    }


  

    return (
        
        <div>
    {/*This modal is for searching tenant id. */}
        <Modal isOpen={this.state.modalSearchTenantId} className="modal-sm modal-dialog modal-dialog-centered" toggle={this.toggleModalSearchTenantId}>
        <ModalHeader toggle={this.toggleModalSearchTenantId}>Search Tenant</ModalHeader>
        <ModalBody>
        
            <div className="form-group row">
                <label htmlFor="name" className="col-sm-12 col-form-label">Enter unique <b>six digit tenant ID</b> code to look up tenant</label>
                <div className="col-sm-12 my-3">
                    <input type="text" name="name" className="form-control" placeholder="Six digit code"
                    value={this.state.tenantSearchId}
                    onChange={this.handleInputTenantSearchId}/>
                </div>
            </div>




            <div className="form-group row text-center">
                
                <div className="col-sm-12">
                {this.state.makingPostRequest === false ? <button className="btn btn-primary" onClick={()=>{this.tenantAddForm(); }}>Search</button> : "Adding Tenant...."
                }
                    
                </div>
            </div>

        </ModalBody>
      </Modal>

      <Modal isOpen={this.state.modalAdd} toggle={this.toggleModalAdd}>
        <ModalHeader toggle={this.toggleModalAdd}>Add Tenant</ModalHeader>
        <ModalBody>
        <form>
            




            <div className="form-group row">
                <label htmlFor="name" className="col-sm-3 col-form-label">Name : </label>
                <div className="col-sm-9">
                    <input type="text" name="name" className="form-control" placeholder="Tenant Name"
                    value={this.state.tenantFormDetails.name}
                    onChange={this.handleInputChange}/>
                </div>
            </div>
            <div className="form-group row">
                <label htmlFor="email" className="col-sm-3 col-form-label">Email : </label>
                <div className="col-sm-9">
                    <input type="text" name="email" className="form-control" placeholder="Email" 
                    value={this.state.tenantFormDetails.email}
                    onChange={this.handleInputChange} />
                </div>
            </div>
            <div className="form-group row">
                <label htmlFor="number" className="col-sm-3 col-form-label">Phone No : </label>
                <div className="col-sm-9">
                    <input type="number" name="number" className="form-control" 
                    value={this.state.tenantFormDetails.number}
                    onChange={this.handleInputChange}/>
                </div>
            </div>
            <div className="form-group row">
                <label htmlFor="room_no" className="col-sm-3 col-form-label">Room No : </label>
                <div className="col-sm-9">
                    <input type="text" name="room_no" className="form-control" placeholder="Room No" 
                    value={this.state.tenantFormDetails.room_no}
                    onChange={this.handleInputChange} />
                </div>
            </div>
            <div className="form-group row">
                <label htmlFor="rent_pay_date" className="col-sm-3 col-form-label">Pay By Date : </label>
                <div className="col-sm-9">
                    <input type="number" name="rent_pay_date" className="form-control" min="1" max="31" 
                    value={this.state.tenantFormDetails.rent_pay_date}
                    onChange={this.handleInputChange} />
                </div>
            </div>
            <div className="form-group row">
                <label htmlFor="rent" className="col-sm-3 col-form-label">Rent in INR : </label>
                <div className="col-sm-9">
                    <input type="number" min="1" name="rent" className="form-control"
                    value={this.state.tenantFormDetails.rent}
                    onChange={this.handleInputChange} />
                </div>
            </div>

        </form>
            <div className="form-group row">
                
                <div className="col-sm-9 offset-3">
                {this.state.makingPostRequest === false ? <button className="btn btn-primary" onClick={()=>{this.tenantAddForm(); }}>Submit</button> : "Adding Tenant...."
                }
                    
                </div>
            </div>

        </ModalBody>
      </Modal>

     
      <Modal className="modal-dialog modal-dialog-centered" isOpen={this.state.modalTenantSquare}> 
            <div className="row p-3">
            {this.state.makingPostRequest === false ?  <div className="col-12 text-center">
                <button className="btn btn-danger"  onClick={()=>{this.tenantSquare(this.state.modalTenantSquareIndex);}}>Confirm Square</button>{' '}
          <button className="btn btn-success"  onClick={()=>this.toggleModalTenantSquare()}>Cancel</button>
                </div> : <div className="col-12 text-center">
                Squaring Tenant ....</div>}
               
            </div>
      
      </Modal>

    <Modal isOpen={this.state.modalTenantSettle} className="modal-lg">
         
          <ModalHeader toggle={()=>this.toggleModalTenantSettle()}> </ModalHeader>
           <ModalBody className="container px-5">
            <div className="row text-center mt-3">
                <div className="offset-sm-4 col-6 col-sm-4"><h4>{settleName}</h4></div>
                <div className="col-6 col-sm-4"><h5><span className="badge badge-pill badge-primary p-2 px-4">{settleDues}</span></h5></div>
            </div>


            <div className="row text-center text-light mt-3 bg-primary rounded pt-2">
                <div className="col-3"><h5>Month</h5></div>
                <div className="col-3"><h5>Rent</h5></div>
                <div className="col-3"><h5>Paid</h5></div>
                <div className="col-3"><h5>Dues</h5></div>
            </div>

            {displaySettleInfo}
            
          </ModalBody>
          <ModalFooter>
          <div className="container">

              <div className="form-group row">
                    <div className="col-3 offset-2" >
                        <select className="form-control" name="date" onChange={this.handleInputTenantSettle}>
                            <option value="">Select Date </option>
                            {displaySettleMonth}

                            
                        </select>
                    </div>
                    <div className="col-3">
                        <input type="number" name="amount" placeholder="Amount" className="form-control"
                    value={this.state.tenantSettleDetails.amount}
                    onChange={this.handleInputTenantSettle}
                        />
                    </div>
                     <div className="col-3">
                        <button className="btn btn-primary" onClick={this.tenantSettle}>Add Custom</button>
                    </div>

                </div>

            </div>
           
          </ModalFooter>
        </Modal>


     
      <Modal className="modal-dialog modal-dialog-centered" isOpen={this.state.modalDeleteTenant}> 
            <div className="row p-3">
            {this.state.makingPostRequest === false ? <div className="col-12 text-center">
                <button className="btn btn-danger"  onClick={()=>{this.tenantDelete(this.state.modalDeleteTenantIndex);}}>Confirm Deletion</button>{' '}
          <button className="btn btn-success"  onClick={()=>this.toggleModalDeleteTenant()}>Cancel</button>
                </div> : <div className="col-12 text-center">
                Removing Tenant....</div>}
                
            </div>
      
      </Modal>




            <div className="rounded shadow d-flex pt-2">
    <h4 className="p-2 d-inline ml-2"><span className="badge badge-primary">{this.state.filled_capacity}</span></h4>
                <h5 className="p-2 d-inline">Occupants</h5>
                <button className="btn ml-auto p-2" onClick={this.toggleModalAdd}><span className="fa fa-plus-circle fa-2x text-primary"></span></button> 
            </div>
        {/*use this.toggleModalSearchTenantId to get the search ID modal box */}

           <div className="mt-3" style={{maxHeight:'105vh',overflowY:'scroll'}}>

			   {details}
                
       
            </div> 
        </div>
    )
    }
}

export default Occupants;