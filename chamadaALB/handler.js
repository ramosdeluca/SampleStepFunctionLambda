'use strict';

const AWS = require('aws-sdk')
const stepfunctions = new AWS.StepFunctions();

AWS.config.update({
  region: process.env.AWS_REGION
})
//const uuid = require('uuid/v4')
const { v4: uuidv4 } = require('uuid');

module.exports.chamadaALB = (event, context, callback) => {
  console.log("EVENT: \n" + JSON.stringify(event, null, 2));
  const body = JSON.parse(event.body);
  console.log("transactionChoice ---> " + body.transactionChoice);
  console.log("transactionType ---> " + body.transactionType);
//const id = uuid()
  const newUUID = uuidv4();

  //  return {
//    isBase64Encoded: false,
//    statusCode: 200,
//    headers:{
//      "Set-cookie": "cookies",
//      "Content-Type": "application/json"
//    },
//    body: JSON.stringify({message: 'Chamada do ALB realizada com sucesso ! Seu id :' + newUUID})
//  }

  console.log(' vai iniciar executeStepFunction');

  callStepFunction(body).then(result => {
    let message = 'Step function foi iniciada - TransactionChoice :' + 
                  body.transactionChoice +  ' TransactionType : ' 
                  + body.transactionType + ' ID : ' + newUUID;
    if (!result) {
      message = 'Step function não foi executada.';
    }

    const response = {
      statusCode: 200,
      body: JSON.stringify({ message })
    };

    callback(null, response);
  });

};


function callStepFunction(body) {
  console.log('callStepFunction');

  const stateMachineName = 'TesteChice'; // Nome da step function.
  console.log('Fetching the list of available workflows');
  console.log("transactionChoice ---> " + body.transactionChoice);
  console.log("transactionType ---> " + body.transactionType);
  
  return stepfunctions
    .listStateMachines({})
    .promise()
    .then(listStateMachines => {
      console.log('Searching for the step function', listStateMachines);

      for (var i = 0; i < listStateMachines.stateMachines.length; i++) {
        const item = listStateMachines.stateMachines[i];

        if (item.name.indexOf(stateMachineName) >= 0) {
          console.log('Found the step function', item);

          var params = {
            stateMachineArn: item.stateMachineArn,
            input: JSON.stringify({ transactionChoice: body.transactionChoice,
                                    transactionType: body.transactionType})
          };

          console.log('Start execution');
          return stepfunctions.startExecution(params).promise().then(() => {
            return true;
          });
        }
      }
    })
    .catch(error => {
      return false;
    });
}