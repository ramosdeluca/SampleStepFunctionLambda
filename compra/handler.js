'use strict';

const AWS = require('aws-sdk')
AWS.config.update({
  region: process.env.AWS_REGION
})
//const uuid = require('uuid/v4')
//const uuid = require('uuid')
const { v4: uuidv4 } = require('uuid');

module.exports.compra = async (event) => {
  console.log("EVENT: \n" + JSON.stringify(event, null, 2))
  const transaction = JSON.parse(event.transactionType)
  //const id = uuid()
  const newUUID = uuidv4();
  return {
    statusCode: 200,
    body: JSON.stringify({message: 'Sua compra foi efetuada com sucesso ! Seu id :' + newUUID + ' Transaction: ' + transaction })
  }

};
