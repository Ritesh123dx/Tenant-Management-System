import React from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import Cookies from 'js-cookie';

import './main.css';
import '../node_modules/font-awesome/css/font-awesome.min.css';
import './mystyles.css';

import '../node_modules/jquery/dist/jquery.slim';
import '../node_modules/popper.js/dist/popper';
import '../node_modules/bootstrap/js/dist/dropdown.js';

import Testing from './Testing';
import Profile from './components/Profile';
import Nav from './components/Nav';
import BuildingDetails from './components/BuildingDetails';
import Occupants from './components/Occupants';
import VisitorLog from './components/VisitorLog';
import Transaction from './components/Transaction';




import AWS from 'aws-sdk/global'
import AWSMqttClient from 'aws-mqtt'
import CognitoCachingCredentialsProvider from 'aws-sdk'
AWS.config.region = 'ap-south-1' // your region
AWS.config.credentials =  new CognitoCachingCredentialsProvider.CognitoIdentityCredentials({
    IdentityPoolId: "ap-south-1:76313825-78ad-4b87-ae75-2faca908e65e"
});

 const client = new AWSMqttClient({
    region: AWS.config.region,
    credentials: AWS.config.credentials,
    endpoint: 'a8jyxx32q2p0a-ats.iot.ap-south-1.amazonaws.com', // NOTE: get this value with `aws iot describe-endpoint`
    expires: 600, // Sign url with expiration of 600 seconds
    clientId: 'mqtt-client-' + (Math.floor((Math.random() * 100000) + 1)) // clientId to register with MQTT broker. Need to be unique per client
    
  })
 
// Cookies.set('abc', 'XYZ');
// console.log("Cookie is ", Cookies.get('name'));
console.log("Cookie of user_id ", Cookies.get('user_id'));
console.log("Cookie of access_token ", Cookies.get('access_token'));
console.log("Cookie of refresh_token ", Cookies.get('refresh_token'));

class Index extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      host_id : null,
      access_token : null,
      refresh_token : null,
      profileVisibility : false,
	    hostData : null,
      hostPropertyIds : null,
      currentPropertyDetails : null,
      selectedHostDataIndex : null,
      domain : 'https://58qianw22h.execute-api.ap-south-1.amazonaws.com/production'
      // domain : "http://127.0.0.1:8000"
    }



  }

  changeProfileVisibility(){
    this.setState({
      profileVisibility: !this.state.profileVisibility
    });
  }

  changePropertyDetails(details){
    
    
    if(details.type === 'add_tenant'){
        this.setState((prevState) =>{
          let a = {...prevState.currentPropertyDetails};
          let host_data = [...prevState.hostData];

          host_data[this.state.selectedHostDataIndex]["filled_capacity"] += 1;
          host_data[this.state.selectedHostDataIndex]["estimated_revenue"] += parseInt(details.rent);
          
          a["filled_capacity"] +=  1;
          a["estimated_revenue"] += parseInt(details.rent);
          return {
            currentPropertyDetails : a,
            hostData : host_data
          }
        })
     }
    else if(details.type === 'delete'){
      this.setState((prevState) =>{
        let a = {...prevState.currentPropertyDetails};
        let host_data = [...prevState.hostData];

        host_data[this.state.selectedHostDataIndex]["filled_capacity"] -= 1;
        host_data[this.state.selectedHostDataIndex]["estimated_revenue"] -= parseInt(details.rent);
        a["filled_capacity"] -=  1;
        a["estimated_revenue"] -= parseInt(details.rent);
        return {
          currentPropertyDetails : a,
          hostData : host_data
        }
      })
    }
    else if(details.type === 'rent_change'){
      this.setState((prevState) =>{
        let a = {...prevState.currentPropertyDetails};
        let host_data = [...prevState.hostData];

        host_data[this.state.selectedHostDataIndex]["estimated_revenue"] += parseInt(details.rent);
      
        a["estimated_revenue"] += parseInt(details.rent);
        
        return {
          currentPropertyDetails : a,
          hostData : host_data,
        }
      })
    }
    else if(details.type === 'INCOME'){
      this.setState(prevState=>{
        let a = {...prevState.currentPropertyDetails};
        let host_data = [...prevState.hostData];

        host_data[this.state.selectedHostDataIndex]["total_revenue"] += details.amount;
        host_data[this.state.selectedHostDataIndex]["total_profit"] += details.amount;
        a["total_revenue"] += details.amount;
        a["total_profit"] += details.amount;
        return {
          currentPropertyDetails : a,
          hostData : host_data
        }
      })
    }
    else if(details.type === 'EXPENSE'){

      this.setState(prevState=>{
        let a = {...prevState.currentPropertyDetails};

        let host_data = [...prevState.hostData];
       

        host_data[this.state.selectedHostDataIndex]["total_expense"] += details.amount;
        host_data[this.state.selectedHostDataIndex]["total_profit"] -= details.amount;
        a["total_expense"] += details.amount;
        a["total_profit"] -= details.amount;

         
        return {
          currentPropertyDetails : a,
          hostData : host_data
        }

      })
    }
     
  }

  changeProperty(newPropertyId){
    
    let a = [...this.state.hostData];
    let newSeletedHostDataIndex = a.findIndex(element=>element["property_id"] === newPropertyId);
   
    this.setState({
      currentPropertyDetails : a[newSeletedHostDataIndex],
      selectedHostDataIndex : newSeletedHostDataIndex
    })
  }


mqtt = (params) => {
    console.log(params);

   
  
  if(params.type === "publish"){



    client.publish(params.topic,params.message);
    console.log("Message published/sent");


  
  }
  else if(params.type === "subscribe"){
  //     client.on('connect', () => {
    

  // })
      client.subscribe(params.topic);
    console.log("MQTT connected");

    client.on('message', (topic, message) => {
      console.log(topic, message.toString());
      let text = message.toString();
      text = JSON.parse(text);
      console.log(text)
      if (text.disconnect){
          client.end(true,()=>{
    console.log("Disconnecting MQTT");
  }); 
      }

  })
  }
  else if(params.type === "disconnect"){
    
      client.end(true,()=>{
    console.log("Disconnecting MQTT");
  }); 
    
  }
  
  
  // client.on('close', () => {
  //   // ...
  // })
  // client.on('offline', () => {
  //   // ...
  // })
  // client.end(true,()=>{
  //   console.log("Disconnecting MQTT");
  // })
    }

  componentDidMount(){
	console.log("inside index.js component did mount");

  
    const Url = this.state.domain;
    
    // const host_id = 'H'+ Cookies.get('user_id');
    const access_token = Cookies.get('acces_token');
    const refresh_token = Cookies.get('refresh_token');
    const host_id = 'H0001';

    

    //Note : host_id state has been intialized as null, setState it.
    let params = {host_id : host_id};
    axios.post(Url+'/host/get/',params)
    .then((response) => {
      console.log("Response from host/get is ",response);
      if(response.data.status === 'Success'){

        console.log("Retrival of host data : Success");
        const host_data = response.data.data;
        let hostPropertyIds = [];
        host_data.forEach(element => {
          hostPropertyIds.push([element["property_id"],element["property_name"]])
         
        }) 
        
        console.log("Host prop ids : ",hostPropertyIds)
       
       
        console.log("Host Data is ",host_data) 
        this.setState({
          host_id : host_id,
          access_token : access_token,
          refresh_token : refresh_token,
          hostData : host_data,
          currentPropertyDetails : host_data[0],
          hostPropertyIds : hostPropertyIds,
          selectedHostDataIndex : 0
          })

        console.log(this.state.hostData);
        console.log(this.state.currentPropertyDetails);

        

			
        } 
      }
      ).catch(error=>{
        console.log("Error in getting host data");
      })
      
}

addProperty = () =>{
  console.log("Add property")
}



  render(){
    if(this.state.host_id === null){
      return(<div>Loading.....</div>)
    }
    else if(this.state.host_id !== null && this.state.hostData.length === 0){
      return(<div><button className="btn btn-primary" onClick={this.addProperty}>Add Property....</button></div>)
    }

    else if(this.state.hostData != null && this.state.currentPropertyDetails != null){
      console.log("B4 passing down to Occupants",this.state.currentPropertyDetails.total_revenue);
    return(
        <div>
        
        <Profile profileVisibility={this.state.profileVisibility} onClick={this.changeProfileVisibility.bind(this)} 
		profileDetails={this.state.hostData}
		/>
        <Nav onClick={this.changeProfileVisibility.bind(this)} hostPropertyIds={this.state.hostPropertyIds}  onchange={this.changeProperty.bind(this)} 
		currentBuilding={this.state.currentPropertyDetails?this.state.currentPropertyDetails["property_name"] : null}
		hostName={this.state.currentPropertyDetails?this.state.currentPropertyDetails["host_name"] : null}
		/>
       
        <div className="container-fluid mt-5 pt-5">
        
        <div className="row">
          <div className="col-12 col-md-4 text-center">
            <BuildingDetails domain={this.state.domain} details={this.state.currentPropertyDetails}/>
          </div>
          <div className="col-12 col-md-4">
            <Occupants domain={this.state.domain} details={this.state.currentPropertyDetails} changePropertyDetails={this.changePropertyDetails.bind(this)} />
          </div>
          <div className="col-12 col-md-4">
            <VisitorLog />
            <Transaction domain={this.state.domain} host_id={this.state.currentPropertyDetails.host_id}
            host_name={this.state.currentPropertyDetails.host_name}
            property_id={this.state.currentPropertyDetails.property_id}
            total_expense={this.state.currentPropertyDetails.total_expense}
            total_revenue={this.state.currentPropertyDetails.total_revenue}
            changePropertyDetails={this.changePropertyDetails.bind(this)}
            />
          </div>
        </div>

      </div>
      </div>
    )
  }
  // else{
  //   return(
  //     <div>
  //       <h1>MQTT</h1>
  //       <button className="btn btn-primary" onClick={this.mqtt.bind(this,{
  //         type : "publish",
  //         topic : "/myTopic",
  //         message : "Sending message from Peachy"
  //       })}>Send</button>
  //       <button className="btn btn-primary" onClick={this.mqtt.bind(this,{
  //         type : "subscribe",
  //         topic : "/myTopic",
          
  //       })}>Receive</button>

  //       <button className="btn btn-primary" onClick={this.mqtt.bind(this,{
  //         type : "disconnect",
  //         topic : "/myTopic",
          
  //       })}>End</button>
  //     </div>
  //     )
  // }
}
}

ReactDOM.render(<Index />,document.getElementById("root"))


