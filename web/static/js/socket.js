// NOTE: The contents of this file will only be executed if
// you uncomment its entry in "web/static/js/app.js".

// To use Phoenix channels, the first step is to import Socket
// and connect at the socket path in "lib/my_app/endpoint.ex":
import {Socket} from "phoenix"
import Vue from 'vue'
import MyApp from "../components/my-app.vue"
let socket = new Socket("/socket", {params: {token: window.userToken}})
socket.connect()
// Create the main component
Vue.component('my-app', MyApp)
// And create the top-level view model:
new Vue({
  el: '#app',
  data() {
    return {
      channel: null,
      messages: []
    }
  },
  mounted() {
    this.channel = socket.channel("room:lobby", {});
    this.channel.on("new_msg", payload => {
      payload.received_at = Date();
      this.messages.push(payload);
    });
    this.channel.join()
    .receive("ok", response => { console.log("Joined successfully", response) })
    .receive("error", response => { console.log("Unable to join", response) })
  },
  render(createElement) {
    return createElement(MyApp, {})
  }
});
// Now that you are connected, you can join channels with a topic:
let channel = socket.channel("topic:subtopic", {})
channel.join()
  .receive("ok", resp => { console.log("Joined successfully", resp) })
  .receive("error", resp => { console.log("Unable to join", resp) })
export default socket
