import RealtimeMessaging from "realtime-messaging";

const client = RealtimeMessaging.createClient();
client.setClusterUrl("https://ortc-developers.realtime.co/server/ssl/2.1/");
client.connect("FcRKO8", "Wexer3");
client.onConnected = client => {
    console.log("Realtime connected");
};

export default client;
