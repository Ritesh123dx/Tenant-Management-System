import React,{useState} from 'react';
import {Modal} from 'reactstrap';
import axios from 'axios';

export default function Transaction({domain,host_id, host_name, property_id, total_expense, total_revenue,changePropertyDetails}) {
    

    const [date, setDate] = useState("");
    const [amount, setAmount] = useState("");
    const [type, setType] = useState("INCOME");
    const [catagory, setCatagory] = useState("Electricity");
    const [description, setDescription] = useState("");

    const [modalTransaction, setModalTransaction] = useState(false);
	
	const [loading,setLoading] = useState(false);


    const addTransaction = () => {
		
        console.log(amount, typeof(amount))
        let numRegEx = /^[1-9]\d*$/g;
        if(date.length === 0){
            alert("Please select a date");
            return false;
        }
       
        else if(!numRegEx.test(amount) || amount === "" || isNaN(amount)){
            alert("Amount not selected");
            return false;
        }
        else if(description.length > 400){
            alert("Total characters in description should not exceed 400");
            return false
        }

        setLoading(true);

        let describe = description.trim()
        if (describe === "") describe = "No description";
        console.log(describe, typeof(describe));
        console.log(date, typeof(date));
        console.log(amount, typeof(amount));
        console.log(type, typeof(type));
        console.log(catagory, typeof(catagory));
        let timestamp = new Date().getTime();
        let transaction_id = host_id + property_id;
        let source = host_name;
        if(type === 'INCOME'){
            total_revenue += amount;
        }
        else{
            total_expense += amount;
        }
        
        
        let params = {
            transaction_id : transaction_id,
            timestamp : timestamp,
            date : date,
            type : type,
            amount : amount,
            catagory : catagory,
            source : source,
            host_id : host_id,
            description : describe,
            property_id : property_id,
            total_revenue : total_revenue,
            total_expense : total_expense
        }
        axios.post(domain+'/transaction/post',params)
        .then(response => {
            if(response.data.status === 'Success'){
                console.log("Successful transaction");
                setDate("");
                setAmount("");
                setDescription("");
                if(type === 'INCOME')
					setType("INCOME");
				else if(type ==='EXPENSE')
						setType("EXPENSE");


                 let changeParams = {
                    type : type,
                    amount : amount
                }
                changePropertyDetails(changeParams);    
				
				setLoading(false);
				setModalTransaction(!modalTransaction);
            }
        })
        .catch(err=>{
            console.log("Error in transaction ",err);
        })
        
        

    }
    
    return (
        <div className="card shadow p-2 mt-3 py-3">
            <h5 className="ml-3">Add Transaction</h5>
            <hr />
            
                <div className="form-group row">
                <div className="col-6">
                    <select className="form-control" onChange={e => setType(e.target.value)}>
                        <option value="INCOME">INCOME</option>
                        <option value="EXPENSE">EXPENSE</option>
                        
                    </select>
                    </div>
                    
                    <div className="col-6">
                    <select className="form-control" onChange={e => setCatagory(e.target.value)}>
                        <option value="Electricity" defaultValue>Electricity</option>
                        <option value="Labour">Labour</option>
                        <option value="Water">Water</option>
                        <option value="Repairs">Repairs</option>
                        <option value="Food">Food</option>
                        <option value="Sale">Sale</option>
                        <option value="Other">Other</option>
                    </select>
                    </div>
                    
                    <div className="col-6 mt-3">
                    <input type="date" className="form-control"
                    value={date}
                    onChange={e => setDate(e.target.value)}/>
                    </div>
                    <div className="col-6 mt-3">
                    
                        <input type='number' min='0' className="form-control" placeholder="Amount"
                        value={amount}
                        onChange={e => setAmount(parseInt(e.target.value))}/>
                    </div>

                    <div className="col-12 mt-3">
                        <input type='text' className="form-control" placeholder="Description"
                        value={description}
                        onChange={e => setDescription(e.target.value)}/>
                    </div>
                    
                </div>
                <div className="col-12 text-center">
                    <button onClick={()=>setModalTransaction(!modalTransaction)} className="btn btn-primary shadow px-4">Add</button>
                </div>
                
            

        <Modal isOpen={modalTransaction} className="modal-dialog modal-dialog-centered" >
  
           
                <div className="row p-3">
                <div className="col-12 text-center">
				{loading === false ? <React.Fragment>
					 <button className="btn btn-primary" onClick={()=>{ addTransaction();}}>Confirm Transaction</button>{' '}
					<button className="btn btn-primary" onClick={()=>setModalTransaction(!modalTransaction)}>Cancel</button></React.Fragment>
				: "Adding Transaction......"}
                </div>
                </div>
                
           
      </Modal>
        </div>
    )
}
