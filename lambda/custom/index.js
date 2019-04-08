/* eslint-disable  func-names */
/* eslint-disable  no-console */

const Alexa = require('ask-sdk');
const dbHelper = require('./dbHelper');

const LaunchRequestHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'LaunchRequest';
  },
  handle(handlerInput) {
    const speechText = 'Welcome to the Alexa Skills Kit, you can say hello!';
    console.log("LaunchRequestHandler");
    return handlerInput.responseBuilder
      .speak(speechText)
      .reprompt(speechText)
      .withSimpleCard('Hello World', speechText)
      .getResponse();
  },
};

const SimpleIntentHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && handlerInput.requestEnvelope.request.intent.name === 'SimpleIntent';
  },
  async handle(handlerInput) {
    const speechText = 'Hello World!';
    const attributes = handlerInput.attributesManager.getSessionAttributes();
    //const reqEnv = handlerInput.requestEnvelope;
    const slots = handlerInput.requestEnvelope.request.intent.slots;
    const fruit = handlerInput.requestEnvelope.request.intent.slots.slotA.value;
    const intent = handlerInput.requestEnvelope.request.intent;
    const userId = handlerInput.requestEnvelope.session.user.userId;
    const deviceId = handlerInput.requestEnvelope.context.System.device.deviceId;
    console.log("SimpleIntentHandler.attributes", attributes);
    console.log("handlerInput.requestEnvelope.request.intent", intent);
    console.log("slots", slots);
    console.log("fruit", fruit);
    console.log("user id: ", userId);
    console.log("deviceId", deviceId);
    //console.log("reqEnv", reqEnv);
    //console.log("SimpleIntentHandler.handlerInput.requestEnvelope.session.user.userId:", handlerInput.requestEnvelope.session.user.userId);
    //console.log("SimpleIntentHandler.handlerInput.requestEnvelope.context.system.device:", handlerInput.requestEnvelope.context.System.device);
    return await dbHelper.addFruit(fruit, userId, deviceId)
      .then((data) => {
        const speechText = `You have added the fruit ${fruit}. Good for you`;
        
        return handlerInput.responseBuilder
          .speak(speechText)
          .withSimpleCard('Hello there', speechText)
          .getResponse();
      })
      .catch((err) => {
        console.log("Error occured while saving movie", err);
        const speechText = "we cannot save your movie right now. Try again!"
        return responseBuilder
          .speak(speechText)
          .getResponse();
      })
    
  },
};

const HelpIntentHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && handlerInput.requestEnvelope.request.intent.name === 'AMAZON.HelpIntent';
  },
  handle(handlerInput) {
    const speechText = 'You can say hello to me!';

    return handlerInput.responseBuilder
      .speak(speechText)
      .reprompt(speechText)
      .withSimpleCard('Hello World', speechText)
      .getResponse();
  },
};

const CancelAndStopIntentHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && (handlerInput.requestEnvelope.request.intent.name === 'AMAZON.CancelIntent'
        || handlerInput.requestEnvelope.request.intent.name === 'AMAZON.StopIntent');
  },
  handle(handlerInput) {
    const speechText = 'Goodbye!';

    return handlerInput.responseBuilder
      .speak(speechText)
      .getResponse();
  },
};

const SessionEndedRequestHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'SessionEndedRequest';
  },
  handle(handlerInput) {
    console.log(`Session ended with reason: ${handlerInput.requestEnvelope.request.reason}`);

    return handlerInput.responseBuilder.getResponse();
  },
};

const requestInterceptor = {
  async process(handlerInput) {
    console.log("requestInterceptor");
    const userId = handlerInput.requestEnvelope.session.user.userId;
    const deviceId = handlerInput.requestEnvelope.context.System.device.deviceId;
    console.log("requestInterceptor.user id: ", userId);
    console.log("requestInterceptor.deviceId", deviceId);
    const attrs = await dbHelper.getFruit("apple", userId)
      .then((data) => {
        console.log("requestInterceptor.data", data);
      })
      .catch((err) => {
        console.log("Error occured while saving movie", err);
        return;
      })    
  }
}

const responseInterceptor = {
  process(handlerInput) {
    console.log("responseInterceptor");
    
    return;
    
  }
}

const ErrorHandler = {
  canHandle() {
    return true;
  },
  handle(handlerInput, error) {
    console.log(`Error handled: ${error.message}`);
    return handlerInput.responseBuilder
      .speak(speechText)
      .withSimpleCard('Hello World', speechText)
      .getResponse();
  },
};

const skillBuilder = Alexa.SkillBuilders.custom();

exports.handler = skillBuilder
  .addRequestHandlers(
    LaunchRequestHandler,
    SimpleIntentHandler,
    HelpIntentHandler,
    CancelAndStopIntentHandler,
    SessionEndedRequestHandler
  )
  .addErrorHandlers(ErrorHandler)
  .addRequestInterceptors(requestInterceptor)
  .addResponseInterceptors(responseInterceptor)
  .lambda();
