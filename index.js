// See https://github.com/dialogflow/dialogflow-fulfillment-nodejs
// for Dialogflow fulfillment library docs, samples, and to report issues
'use strict';
 
const axios = require('axios');
const functions = require('firebase-functions');
const {WebhookClient} = require('dialogflow-fulfillment');
const {Card, Suggestion} = require('dialogflow-fulfillment');
 
process.env.DEBUG = 'dialogflow:debug'; // enables lib debugging statements
 
exports.dialogflowFirebaseFulfillment = functions.https.onRequest((request, response) => {
  const agent = new WebhookClient({ request, response });
  console.log('Dialogflow Request headers: ' + JSON.stringify(request.headers));
  console.log('Dialogflow Request body: ' + JSON.stringify(request.body));
 
  function welcome(agent) {
    agent.add(`Welcome to my agent!`);
  }
 
  function fallback(agent) {
    agent.add(`I didn't understand`);
    agent.add(`I'm sorry, can you try again?`);
  }
  
  function elevatorstatusHandler(agent) {
    const idnumber = agent.parameters.idnumber;  
    return axios.get(`https://rest-api-week13.azurewebsites.net/api/elevator/${idnumber}`)
    .then((result) => {
      console.log(result.data.status);
      agent.add('Elevator # ' + agent.parameters.idnumber + ' status: '+ result.data.status); 
    });
  }
  
  function elevatorHandler(){
  return axios.get(`https://rest-api-week13.azurewebsites.net/api/elevator/Amount`);
  }
  
  function buildingHandler(){
  return axios.get(`https://rest-api-week13.azurewebsites.net/api/building`);
  }
  
  function customerHandler(){
  return axios.get(`https://rest-api-week13.azurewebsites.net/api/customer`);
  }
  
  function elevatornotrunningHandler(){
  return axios.get(`https://rest-api-week13.azurewebsites.net/api/elevator/Inactive/Amount`);
  }
  
  function batteryHandler(){
  return axios.get(`https://rest-api-week13.azurewebsites.net/api/battery/amount`);
  }
  
  function cityHandler(){
  return axios.get(`https://rest-api-week13.azurewebsites.net/api/address/amount`);
  }
  
  function quoteHandler(){
  return axios.get(`https://rest-api-week13.azurewebsites.net/api/quote/amount`);
  }
  
  function leadHandler(){
  return axios.get(`https://rest-api-week13.azurewebsites.net/api/lead/amount`);
  }
  
  function initialbrief(agent) {
    return axios.all([elevatorHandler(), buildingHandler(), customerHandler(), elevatornotrunningHandler(), batteryHandler(), cityHandler(), quoteHandler(), leadHandler()])
    .then(axios.spread(function (elevator, building, customer, elevatornotrunning, battery, city, quote, lead) {
      const elevatorval = elevator.data.amount;
      const buildingval = building.data.length;
      const customerval = customer.data.length;
      const elevatornr = elevatornotrunning.data.amount;
      const batteryval = battery.data.amount;
      const cityval = city.data.length;
      const quoteval = quote.data.amount;
      const leadval = lead.data.amount;
      
      agent.add(`Greetings! There are ${elevatorval} elevators deployed in the ${buildingval} buildings of your ${customerval} customers. Currently, ${elevatornr} elevators are not in Running Status and are being serviced. ${batteryval} Batteries are deployed across ${cityval} cities. On another note you currently have ${quoteval} quotes awaiting processing. You also have ${leadval} leads in your contact requests.`);
     }));
  }
  
  function buildingintervention(agent){
    return axios.get(`https://rest-api-week13.azurewebsites.net/api/building/intervention`)
    .then((result) => {
      console.log(result.data.length);
      agent.add('There are' + result.data.length + ' buildings need interventions.'); 
    });
  }
  
   function columnstatus(agent) {
    const columnid = agent.parameters.number;  
    return axios.get(`https://rest-api-week13.azurewebsites.net/api/Column/${columnid}`)
    .then((result) => {
      console.log(result.data.status);
      agent.add('Column id ' + agent.parameters.number + ' status: '+ result.data.status); 
    });
   }   
  
  function fulladdress(agent){
    const addressid = agent.parameters.addressid;  
    return axios.get(`https://rest-api-week13.azurewebsites.net/api/address/${addressid}`)
    .then((result) => {
      console.log(result.data.number_and_street);
      agent.add('Full address of address id ' + agent.parameters.addressid + ' is street ' + result.data.number_and_street + ' , Appartment: ' + result.data.suite_or_apartment + ' , City: ' + result.data.city + ' , Postal Code: ' + result.data.postal_code + ' , Country: ' + result.data.country); 
    });
  }
  
  function batterystatus(agent){
  	const batteryid = agent.parameters.batteryid;  
    return axios.get(`https://rest-api-week13.azurewebsites.net/api/battery/${batteryid}`)
    .then((result) => {
      console.log(result.data.battery_status);
      agent.add('Battery id ' + agent.parameters.batteryid + ' status: '+ result.data.battery_status); 
    });
  }
     
  
  
  // Run the proper function handler based on the matched Dialogflow intent name
  let intentMap = new Map();
  intentMap.set('Default Welcome Intent', welcome);
  intentMap.set('Default Fallback Intent', fallback);
  intentMap.set('Elevators', elevatorstatusHandler);
  intentMap.set('Initial brief', initialbrief);
  intentMap.set('BuildingIntervention', buildingintervention);
  intentMap.set('ColumnStatus', columnstatus);
  intentMap.set('fulladdress', fulladdress);
  intentMap.set('batterystatus', batterystatus);
  //intentMap.set('Change Elevator Status', changeElevatorStatus);  
  agent.handleRequest(intentMap);
});
