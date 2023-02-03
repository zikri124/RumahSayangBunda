const {
  google
} = require("googleapis");
const oauth2 = google.oauth2("v2");

const SCOPES = "email https://www.googleapis.com/auth/calendar";

const client_id = process.env.google_client_id;
const client_secret = process.env.google_client_secret;
const client_redirect = process.env.clientRedirect;

const oauth2Client = new google.auth.OAuth2(
  client_id,
  client_secret,
  client_redirect
);

module.exports = {
  getConnectionUrl: () => {
    return oauth2Client.generateAuthUrl({
      access_type: "offline",
      scope: SCOPES,
      prompt: "consent"
    });
  },

  getToken: async (code) => {
    const {
      tokens
    } = await oauth2Client.getToken(code);
    return tokens;
  },

  getOAuth2Client: (tokens) => {
    const REFRESH_TOKEN = tokens.refresh_token;
    oauth2Client.setCredentials({
      refresh_token: REFRESH_TOKEN
    });
    return oauth2Client;
  },

  getUserDetail: async (tokens) => {
    // const { tokens } = await oauth2Client.getToken(code);
    // console.log(tokens);
    oauth2Client.setCredentials(tokens);
    const usr_info = await oauth2.userinfo.get({
      auth: oauth2Client
    });
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
    const calendar = google.calendar({
      version: "v3",
      oauth2Client
    });
    calendar.events.list({
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