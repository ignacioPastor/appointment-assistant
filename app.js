const builder = require('botbuilder');
const restify = require('restify');

const connector = new builder.ConsoleConnector().listen();
const bot = new builder.UniversalBot(connector, (session) => {
  session.send(`Hey there! I'm a virtual assistant. I can help you book an medical appointment with us. Please provide answers to the following questions`);
  session.beginDialog('setAppointment');
});

bot.dialog('setAppointment', [
  (session, args, next) => {
    builder.Prompts.text(session, 'Whats your name?');
  },
  (session, args, next) => {
    session.userData.name = args.response;
    builder.Prompts.number(session, 'Great! Whats your age?');
  },
  (session, args, next) => {
    session.userData.age = args.response;
    builder.Prompts.choice(session, 'Ok, Whats your gender?', ['Male', 'Female']);
  },
  (session, args, next) => {
    session.userData.gender = args.response.entity;
    builder.Prompts.time(session, `When would you like to have an appointment? You can say "tomorrow 10 am" or date and time in "m/d/yyyy hh:mm"`);
  },
  (session, args, next) => {
    session.userData.datetime = builder.EntityRecognizer.resolveTime([args.response]);
    session.send(`Thank you for your time. I have booked an appointment for you at ${session.userData.datetime}`);
    session.send(`Appointment Details:
      Name: ${session.userData.name}
      Age: ${session.userData.age}
      Gender: ${session.userData.gender}
    `);
  }
]);
