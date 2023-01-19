const { google } = require("googleapis");
const oauth2 = google.oauth2("v2");

const SCOPES = "email https://www.googleapis.com/auth/calendar";

// const GOOGLE_PRIVATE_KEY = process.env.google_private_key.replace(
//   /\\n/gm,
//   "\n"
// );
// const GOOGLE_CLIENT_EMAIL = process.env.google_client_email;
// const GOOGLE_PROJECT_NUMBER = process.env.google_project_number;
// const GOOGLE_CALENDAR_ID = process.env.google_calendar_id;

// const jwtClient = new google.auth.JWT(
//   GOOGLE_CLIENT_EMAIL,
//   null,
//   GOOGLE_PRIVATE_KEY,
//   SCOPES
// );

// const calendar = google.calendar({
//   version: "v3",
//   project: GOOGLE_PROJECT_NUMBER,
//   auth: jwtClient
// });

const client_id = process.env.google_client_id;
const client_secret = process.env.google_client_secret;
const client_redirect = "https://s8mii5.sse.codesandbox.io/oauthcallback";

const oauth2Client = new google.auth.OAuth2(
  client_id,
  client_secret,
  client_redirect
);

module.exports = {
  // getEvents: (req, res) => {
  //   calendar.events.list(
  //     {
  //       calendarId: GOOGLE_CALENDAR_ID,
  //       timeMin: new Date().toISOString(),
  //       maxResults: 10,
  //       singleEvents: true,
  //       orderBy: "startTime"
  //     },
  //     (error, result) => {
  //       if (error) {
  //         // res.send(JSON.stringify({ error: error }));
  //         res.json({ error });
  //       } else {
  //         if (result.data.items.length) {
  //           // res.send(JSON.stringify({ events: result.data.items }));
  //           res.json({ events: result });
  //         } else {
  //           // res.send(JSON.stringify({ message: "No upcoming events found." }));
  //           res.json({ message: "No upcoming events found." });
  //         }
  //       }
  //     }
  //   );
  // },

  // createEvent: (req, res) => {
  //   const event = {
  //     summary: "Reservasi Kunjungan Klinik",
  //     location: "Klinik Rumah Sayang Bunda",
  //     description: "test",
  //     start: {
  //       dateTime: "2022-11-13T05:00:00-07:00",
  //       timeZone: "Asia/Jakarta"
  //     },
  //     end: {
  //       dateTime: "2022-11-13T05:30:00-07:00",
  //       timeZone: "Asia/Jakarta"
  //     },
  //     attendees: [],
  //     reminders: {
  //       useDefault: false,
  //       overrides: [
  //         { method: "popup", minutes: 60 },
  //         { method: "popup", minutes: 30 }
  //       ]
  //     }
  //   };

  //   const auth = new google.auth.GoogleAuth({
  //     keyFile: "./googleKeyFile.json",
  //     scopes: "https://www.googleapis.com/auth/calendar"
  //   });

  //   auth.getClient().then((auth) => {
  //     calendar.events.insert(
  //       {
  //         auth: auth,
  //         calendarId: GOOGLE_CALENDAR_ID,
  //         resource: event
  //       },
  //       function (err, event) {
  //         if (err) {
  //           console.log(
  //             "There was an error contacting the Calendar service: " + err
  //           );
  //           return;
  //         }
  //         console.log("Event created: %s", event.data);
  //         res.json({
  //           message: "Event successfully created!",
  //           data: event
  //         });
  //       }
  //     );
  //   });
  // },

  // getGoogleAuth: (req, next) => {
  //   const auth = new google.auth.GoogleAuth({
  //     keyFile: "../googleKeyFile.json",
  //     scopes: "https://www.googleapis.com/auth/calendar"
  //   });

  //   req.auth = auth;

  //   next();
  // },

  // getCalendar: (req, next) => {
  //   req.calendar = calendar;
  //   next;
  // },

  // with oauth -----------------------

  getConnectionUrl: () => {
    return oauth2Client.generateAuthUrl({
      access_type: "offline",
      scope: SCOPES,
      prompt: "consent"
    });
  },

  getToken: async (code) => {
    const { tokens } = await oauth2Client.getToken(code);
    return tokens;
  },

  getOAuth2Client: (tokens) => {
    const REFRESH_TOKEN = tokens.refresh_token;
    oauth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });
    return oauth2Client;
  },

  getUserDetail: async (tokens) => {
    // const { tokens } = await oauth2Client.getToken(code);
    console.log(tokens);
    oauth2Client.setCredentials(tokens);
    const usr_info = await oauth2.userinfo.get({ auth: oauth2Client });
    return usr_info;
  },

  getUserInfo: (oauth2Client) => {
    const profile = google.oauth2({
      auth: oauth2Client,
      version: "v2"
    });

    profile.userinfo.get((res) => {
      return res.data; // name, email, profile picture
    });
  },

  getEventWithOauth: () => {
    const calendar = google.calendar({ version: "v3", oauth2Client });
    calendar.events.list(
      {
        calendarId: "primary",
        timeMin: new Date().toISOString(),
        singleEvents: true,
        orderBy: "startTime"
      },
      (err, res) => {
        if (err) return console.log("Error : " + err);
        const events = res.data.items;
        if (events.length) {
          console.log("Upcoming events : ");
          events.map((event, i) => {
            const start = event.start.dateTime || event.start.date;
            console.log("${start} - ${event.summary}");
          });
        } else {
          console.log("No upcoming events found");
        }
      }
    );
  }
};
