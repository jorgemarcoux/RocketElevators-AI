/* *
 * This sample demonstrates handling intents from an Alexa skill using the Alexa Skills Kit SDK (v2).
 * Please visit https://alexa.design/cookbook for additional examples on implementing slots, dialog management,
 * session persistence, api calls, and more.
 * */
const Alexa = require('ask-sdk-core');
var http = require('https');

const LaunchRequestHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'LaunchRequest';
    },
    handle(handlerInput) {
        const speakOutput = 'Welcome to Rocket Elevators, how may I help you today?';
        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};
const GetRocketInfoHandler = {
     canHandle(handlerInput) {
    return (
         handlerInput.requestEnvelope.request.type === "IntentRequest" &&
         handlerInput.requestEnvelope.request.intent.name ===
        'whatIsGoingOn'
        );
    },
    async handle(handlerInput) {
        let speech = "";
        const allElevators = await getRemoteData("https://codeboxx-alexa.azurewebsites.net/api/Elevator");
        const totalElevators =  Object.keys(JSON.parse(allElevators)).length;
        const allBuildings = await getRemoteData ("https://codeboxx-alexa.azurewebsites.net/api/Building");
        const totalBuildings =  Object.keys(JSON.parse(allBuildings)).length;
        const allCustomers = await getRemoteData ("https://codeboxx-alexa.azurewebsites.net/api/Customer");
        const totalCustomers =  Object.keys(JSON.parse(allCustomers)).length;
        const allElevatorsNotRunning = await getRemoteData ("https://codeboxx-alexa.azurewebsites.net/api/Elevator/Active");
        const totalElevatorsNotRunning =  Object.keys(JSON.parse(allElevatorsNotRunning)).length;
        const allBatteries = await getRemoteData ("https://codeboxx-alexa.azurewebsites.net/api/Battery");
        const totalBatteries =  Object.keys(JSON.parse(allBatteries)).length;
        const allCities = await getRemoteData ("https://codeboxx-alexa.azurewebsites.net/api/Address/Amount");
        const totalCities =  Object.keys(JSON.parse(allCities)).length;
        const allQuotes = await getRemoteData ("https://codeboxx-alexa.azurewebsites.net/api/Quote");
        const totalQuotes =  Object.keys(JSON.parse(allQuotes)).length;
        const allLeads = await getRemoteData ("https://codeboxx-alexa.azurewebsites.net/api/Lead/All");
        const totalLeads =  Object.keys(JSON.parse(allLeads)).length;
        speech = `Greetings, There are currently ${totalElevators} elevators deployed in the ${totalBuildings} buildings
        of your ${totalCustomers} Customers. Currently, ${totalElevatorsNotRunning} elevators are not in Running Status and are being 
        serviced. ${totalBatteries} batteries are deployed across ${totalCities} cities. On another note you currently have ${totalQuotes}
        quotes awaiting processing. You also have ${totalLeads} leads in your contact requests`;
        return handlerInput.responseBuilder
          .speak(speech)
          .reprompt(speech)
          .getResponse();
    }
};

const GetElevatorStatus ={
    canHandle(handlerInput) {
      return (
          handlerInput.requestEnvelope.request.type === "IntentRequest" &&
          handlerInput.requestEnvelope.request.intent.name === "getElevatorStatus"
          );  
    },
    async handle(handlerInput) {
        const id = handlerInput.requestEnvelope.request.intent.slots.id.value;
        let speech = "";
        
        const elevatorStatus = await getRemoteData ("https://codeboxx-alexa.azurewebsites.net/api/Elevator/" + id);
        const totalElevatorStatus = JSON.parse(elevatorStatus).status;
        const totalElevatorId = JSON.parse(elevatorStatus).id;
        
        
        speech = `The current status of the elevator ${id} is ${totalElevatorStatus}`;
        return handlerInput.responseBuilder
          .speak(speech)
          .reprompt(speech)
          .getResponse();
        
    }
};

const GetColumnStatus ={
    canHandle(handlerInput) {
      return (
          handlerInput.requestEnvelope.request.type === "IntentRequest" &&
          handlerInput.requestEnvelope.request.intent.name === "getColumnStatus"
          );  
    },
    async handle(handlerInput) {
        const id = handlerInput.requestEnvelope.request.intent.slots.id.value;
        let speech = "";
        
        const columnStatus = await getRemoteData ("https://codeboxx-alexa.azurewebsites.net/api/Column/" + id);
        const totalColumnStatus = JSON.parse(columnStatus).status;
        const totalColumnId = JSON.parse(columnStatus).id;
        
        
        speech = `The current status of the column ${id} is ${totalColumnStatus}`;
        return handlerInput.responseBuilder
          .speak(speech)
          .reprompt(speech)
          .getResponse();
        
    }
};

const GetBatteryStatus ={
    canHandle(handlerInput) {
      return (
          handlerInput.requestEnvelope.request.type === "IntentRequest" &&
          handlerInput.requestEnvelope.request.intent.name === "getBatteryStatus"
          );  
    },
    async handle(handlerInput) {
        const id = handlerInput.requestEnvelope.request.intent.slots.id.value;
        let speech = "";
        
        const batteryStatus = await getRemoteData ("https://codeboxx-alexa.azurewebsites.net/api/Battery/" + id);
        const totalBatteryStatus = JSON.parse(batteryStatus).battery_status;
        const totalBaterryId = JSON.parse(batteryStatus).id;
        
        
        speech = `The current status of the battery ${id} is ${totalBatteryStatus}`;
        return handlerInput.responseBuilder
          .speak(speech)
          .reprompt(speech)
          .getResponse();
        
    }
};


// const ChangeElevatorStatusHandler = {
//     canHandle(handlerInput){
//         return (
//             handlerInput.requestEnvelope.request.type === "IntentRequest" &&
//             handlerInput.requestEnvelope.request.intent.name === "changeElevatorStatus"
//         );
//     },
//     async handle(handlerInput){
//         const elevatorID =
//             handlerInput.requestEnvelope.request.intent.slots.id.value;
            
//         const elevatorStatus = 
//             handlerInput.requestEnvelope.request.intent.slots.status.value;
            
//         var result = await httpPutElevatorStatus(elevatorID, elevatorStatus);
        
//         let statusSpeak = result;
        
//         return handlerInput.responseBuilder
//             .speak(statusSpeak)
//             .reprompt()
//             .getResponse();
//     }
// };


// async function httpPutElevatorStatus(elevatorID, elevatorStatus) {
//     return new Promise((resolve,reject) => {
//         const putElevatorData = `{"id": "${elevatorID}","status":"${elevatorStatus}"}`
//         console.log(elevatorID,elevatorStatus);
    
//         var options = {
//             host: "https://codeboxx-alexa.azurewebsites.net", // this is the host name
//             path: `api/Elevator/${elevatorID}`, // this is the path
//             headers: {
//                 "Content-Type": "application/json",
//                 "Content-Length": Buffer.byteLength(putElevatorData)
//             },
            
//             method: "PUT"
//         };
        
//         // const options = await getRemoteData(`https://codeboxx-alexa.azurewebsites.net/api/Elevator`);
//         // const elev_options =  Object.keys(JSON.parse(options)).id;
        
//         var request = http.request(options, res => {
//             var responseString = "";
//             res.on("data", chunk =>{
//                 responseString = responseString + chunk;
//             });
//             res.on("end",() =>{
//                 console.log("Received response " + responseString);
//                 resolve(responseString);
//             });
//             res.on("error", e => {
//                 console.log("ERROR " + e);
//                 reject();
//             });
            
//         });
//         request.write(putElevatorData);
//         request.end();
//     });
// }








// const HelloWorldIntentHandler = {
//     canHandle(handlerInput) {
//         return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
//             && Alexa.getIntentName(handlerInput.requestEnvelope) === 'HelloWorldIntent';
//     },
//     handle(handlerInput) {
//         const speakOutput = 'Hello World!';
//         return handlerInput.responseBuilder
//             .speak(speakOutput)
//             //.reprompt('add a reprompt if you want to keep the session open for the user to respond')
//             .getResponse();
//     }
// };
const getRemoteData = function(url) {
  return new Promise((resolve, reject) => {
    const client = url.startsWith("https") ? require("https") : require("http");
    const request = client.get(url, response => {
      if (response.statusCode < 200 || response.statusCode > 299) {
        reject(new Error("Failed with status code: " + response.statusCode));
      }
      const body = [];
      response.on("data", chunk => body.push(chunk));
      response.on("end", () => resolve(body.join("")));
    });
    request.on("error", err => reject(err));
  });
};
const HelpIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.HelpIntent';
    },
    handle(handlerInput) {
        const speakOutput = 'You can say hello to me! How can I help?';
        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};
const CancelAndStopIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && (Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.CancelIntent'
                || Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.StopIntent');
    },
    handle(handlerInput) {
        const speakOutput = 'Goodbye!';
        return handlerInput.responseBuilder
            .speak(speakOutput)
            .getResponse();
    }
};
/* *
 * FallbackIntent triggers when a customer says something that doesn't map to any intents in your skill
 * It must also be defined in the language model (if the locale supports it)
 * This handler can be safely added but will be ingnored in locales that do not support it yet 
 * */
const FallbackIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.FallbackIntent';
    },
    handle(handlerInput) {
        const speakOutput = 'Sorry, I don\'t know about that. Please try again.';
        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};
/* *
 * SessionEndedRequest notifies that a session was ended. This handler will be triggered when a currently open 
 * session is closed for one of the following reasons: 1) The user says "exit" or "quit". 2) The user does not 
 * respond or says something that does not match an intent defined in your voice model. 3) An error occurs 
 * */
const SessionEndedRequestHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'SessionEndedRequest';
    },
    handle(handlerInput) {
        console.log(`~~~~ Session ended: ${JSON.stringify(handlerInput.requestEnvelope)}`);
        // Any cleanup logic goes here.
        return handlerInput.responseBuilder.getResponse(); // notice we send an empty response
    }
};
/* *
* The intent reflector is used for interaction model testing and debugging.
 * It will simply repeat the intent the user said. You can create custom handlers for your intents 
 * by defining them above, then also adding them to the request handler chain below 
 * */
const IntentReflectorHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest';
    },
    handle(handlerInput) {
        const intentName = Alexa.getIntentName(handlerInput.requestEnvelope);
        const speakOutput = `You just triggered ${intentName}`;
        return handlerInput.responseBuilder
            .speak(speakOutput)
            //.reprompt('add a reprompt if you want to keep the session open for the user to respond')
            .getResponse();
    }
};
/**
 * Generic error handling to capture any syntax or routing errors. If you receive an error
 * stating the request handler chain is not found, you have not implemented a handler for
 * the intent being invoked or included it in the skill builder below 
 * */
const ErrorHandler = {
    canHandle() {
        return true;
    },
    handle(handlerInput, error) {
        const speakOutput = 'Sorry, I had trouble doing what you asked. Please try again.';
        console.log(`~~~~ Error handled: ${JSON.stringify(error)}`);
        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};
/**
 * This handler acts as the entry point for your skill, routing all request and response
 * payloads to the handlers above. Make sure any new handlers or interceptors you've
 * defined are included below. The order matters - they're processed top to bottom 
 * */
exports.handler = Alexa.SkillBuilders.custom()
    .addRequestHandlers(
        LaunchRequestHandler,
        GetRocketInfoHandler,
        GetElevatorStatus,
        GetColumnStatus,
        GetBatteryStatus,
        HelpIntentHandler,
        CancelAndStopIntentHandler,
        FallbackIntentHandler,
        SessionEndedRequestHandler,
        IntentReflectorHandler)
    .addErrorHandlers(
        ErrorHandler)
    .withCustomUserAgent('sample/hello-world/v1.2')
    .lambda();