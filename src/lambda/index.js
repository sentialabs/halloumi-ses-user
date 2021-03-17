'use strict';
const crypto = require("crypto");

// Send response to the pre-signed S3 URL 
function sendResponse(event, context, responseStatus, responseData) {
 
  var responseBody = JSON.stringify({
      Status: responseStatus,
      Reason: "See the details in CloudWatch Log Stream: " + context.logStreamName,
      PhysicalResourceId: context.logStreamName,
      StackId: event.StackId,
      RequestId: event.RequestId,
      LogicalResourceId: event.LogicalResourceId,
      Data: responseData
  });
  let _responseBody = JSON.parse(responseBody);
  _responseBody.Data.password = null;  

  console.log("RESPONSE BODY:\n", _responseBody);

  var https = require("https");
  var url = require("url");

  var parsedUrl = url.parse(event.ResponseURL);
  var options = {
      hostname: parsedUrl.hostname,
      port: 443,
      path: parsedUrl.path,
      method: "PUT",
      headers: {
          "content-type": "",
          "content-length": responseBody.length
      }
  };

  console.log("SENDING RESPONSE...\n");

  var request = https.request(options, function(response) {
      console.log("STATUS: " + response.statusCode);
      console.log("HEADERS: " + JSON.stringify(response.headers));
      // Tell AWS Lambda that the function execution is done  
      context.done();
  });

  request.on("error", function(error) {
      console.log("sendResponse Error:" + error);
      // Tell AWS Lambda that the function execution is done  
      context.done();
  });

  // write data to request body
  request.write(responseBody);
  request.end();
}

let response = (event, context, message, data, err) => {
  return new Promise(() => {
    let status = 'SUCCESS';
    if (err) { console.log(event, context, err); status = 'FAILED'; } else {console.log(message);}
    if (Object.prototype.hasOwnProperty.call(event, 'RequestType')) return sendResponse(event, context, status, data);
    return status;
  });
}

let sign = (key, msg) => {
  let sign = crypto.createHmac('sha256', key);
  sign.write(msg);
  sign.end();
  return sign.read();
}

let on_create = (event, context) => {
  let key = event.ResourceProperties.SecretKey;
  let region = process.env.AWS_REGION || 'us-east-1';
              
  // The values of the following variables should always stay the same.
  let date = "11111111";
  let service = "ses";
  let terminal = "aws4_request";
  let message = "SendRawEmail";
  let version = Buffer.from('[4]');

  let hash = sign(`AWS4${key}`, date);

  hash = sign(hash, region);
  hash = sign(hash, service);
  hash = sign(hash, terminal);
  hash = sign(hash, message);
  let signatureAndVersion = Buffer.concat([version,hash], (version.length + hash.length));

  let responseData = {
    'password': signatureAndVersion.toString('base64')
  }
  response(event, context, 'Success', responseData).then(data => {
    console.log(data);
  }).catch(err => {
    console.log(err);
  });
}
let on_update = (event, context) => {
  response(event, context, 'Success').then(data => {
    console.log(data);
  }).catch(err => {
    console.log(err);
  });
}
let on_delete = (event, context) => {
  response(event, context, 'Success').then(data => {
    console.log(data);
  }).catch(err => {
    console.log(err);
  });
}

const _on_event = (event, context) => {
  /**
   * Securiting the SecretKey in the console.log
   */
  let _event = JSON.parse(JSON.stringify(event));;
  _event.ResourceProperties.SecretKey = null;
  console.log(_event);
  console.log(context);
  const request_type = event.RequestType;
  if (request_type == 'Create') { return on_create(event, context);}
  if (request_type == 'Update') { return on_update(event, context);}
  if (request_type == 'Delete') { return on_delete(event, context);}
};

exports.on_event = _on_event;