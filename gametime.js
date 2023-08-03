/**
  * @license
  * Copyright (c) 2021 Parking-Master / (Gametime.js)
  * Licensed under the MIT License (https://mit-license.org)
  * More license and copyright information at https://github.com/Parking-Master/Gametime.js/blob/main/LICENSE
*/
function setCookie(e, n, t) {
  let i = "";
  if (t) {
  let o = new Date;
  o.setTime(o.getTime() + 24 * t * 60 * 60 * 1e3), i = "; expires=" + o.toUTCString()
  }
  document.cookie = e + "=" + (n || "") + i + "; path=/"
}
function getCookie(cname) {
  let name = cname + "=";
  let decodedCookie = decodeURIComponent(document.cookie);
  let ca = decodedCookie.split(';');
  for (let i = 0; i < ca.length; i++) {
  let c = ca[i];
  while (c.charAt(0) == ' ') {
  c = c.substring(1);
  }
  if (c.indexOf(name) == 0) {
  return c.substring(name.length, c.length);
  }
  }
  return null;
}
window.pubnub = undefined;
window.ms = Date.now();
window.addEventListener("load", () => {
  ms = Date.now() - ms;
});
window.addEventListener("beforeunload", (() => {
  setCookie("pubnub-time-token", `${(new Date).getTime()}0000`, 10)
})), window.gametime = {}, gametime.onconnect = null, gametime.ondisconnect = null, window.gametime.events = [], window.gametime.events.functions = [], gametime.connected = !1, gametime.set = function(e, n, t) {
  return function(e, n, t) {
    if ("key" == e) {
      let e = n,
      u = t;
      let i = document.createElement("script");
      i.src = "https://cdn.pubnub.com/sdk/javascript/pubnub.4.21.7.min.js", document.body.appendChild(i);
      let o = setInterval((function() {
        if ("undefined" != typeof PubNub) {
          clearInterval(o);
          const n = PubNub.generateUUID();
          pubnub = new PubNub({
            publishKey: e,
            subscribeKey: u,
            uuid: n
          }), gametime.user = {}, gametime.user.id = n;
          pubnub.addListener({
            message: function(e) {
              new Function("(" + decodeURIComponent(e.message) + ")();")()
            },
            presence: function(e) {
              console.log(e.uuid)
            }
          }), setTimeout((function() {
            let f = ((ms.toFixed(0) - 0) / (ms*1.5));
            console.info("%cGametime.js connecting in " + f.toFixed(0) + " second(s)...", "font-family: Arial, helvetica, sans-serif;");
            delete ms;
            const e = encodeURIComponent('function(){console.info("%cGametime.js successfully connected!","font-family: Arial, helvetica, sans-serif;");}');
            pubnub.publish({
              channel: gametime.channel,
              message: e
            }, (function(e, n) {
            if (e.error) {
              gametime.connected = !1;
              throw new Error("An error occurred while trying to establish a connection with Gametime.js.\nMake sure the Publish/Subscribe keys are correct and that you are on the right channel.")
            } else {
            gametime.connected = !0;
            if (typeof gametime.onconnect == "function") {
              gametime.onconnect();
            }
            gametime.didConnect();
            }
            }))
          }), 3e3)
        }
      }), 250)
    } else "channel" == e ? (void 0 === pubnub ? setTimeout((function() {
      pubnub.subscribe({
        channels: [n],
        timetoken: getCookie("pubnub-time-token"),
        message: function(e) {
        if ("unsubscribe" == e.type) return pubnub.unsubscribe({
          channel: e.channel
        })
        },
        withPresence: !0
      })
    }), 900) : pubnub.subscribe({
      channels: n,
      withPresence: !0
    }), window.gametime.channel = n) : "join-max-length" == e ? gametime.join.maxLength = "string" == typeof n ? parseFloat(n, 0) : n : "join-min-length" == e && (gametime.join.minLength = "string" == typeof n ? parseFloat(n, 0) : n)
  }(e, n, t)
}, gametime.make = function(e) {
  let n
  return n = e, void window.gametime.events.push(n);
}, gametime.on = function(e, n) {
  return function(e, n) {
    if (!(window.gametime.events.indexOf(e) > -1)) throw new ReferenceError('Event "' + e.toString() + '" not found');
    let t = document.createElement("script"),
    i = (n = n.toString()).split("{")[0],
    o = n.toString().split("{")[0].split("(").pop().split(")").shift(),
    u = n.substring(n.indexOf('{') + 1);
    o = o || "undefined";
    n = i + "{pubnub.publish({channel:'" + gametime.channel + "',message:'" + (encodeURIComponent(i) + "{var " + o + ' = "ncmmmasptr__ + ' + o + ' + ncmmmasptr__";' + encodeURIComponent(u)).replace(/\'/g, "\\'").replace(/ncmmmasptr__/g, "'") + "'});}", t.textContent = "gametime.events.functions." + e + " = " + n + ";", document.body.appendChild(t)
  }(e, n)
}, gametime.recursion = 0, gametime.run = function(e, n) {
  return function(e, n) {
    n && void 0 !== n || (n = [""]);
    for (let t = [], i = 0; i < n.length; i++) t.push('"' + n[i] + '"'), new Function("gametime.events.functions." + e + "(" + t + ")")()
  }(e, n)
}, window.gametime.join = {}, gametime.join.maxLength = 2, gametime.join.minLength = 2, gametime.disconnect = function() {
  gametime.connected = !1, pubnub.publish({
    channel: "control",
    message: {
      command: "unsubscribe",
      channel: gametime.channel
    }
  });
  pubnub.disconnect();
}
window.addEventListener("load", function() {
  window.gametime.connectedPlayers = 0;
  window.willBeAutoHost = false;
  window.isHost = false;
  window.Guest = false;
  window.gametime.idList = [];
  gametime.make("collectId");
  gametime.make("renderScene");
  gametime.make("isGuest");
  gametime.on("isGuest", () => {
    !isHost && (gametime.user.position = 2, isGuest = true, isHost = false);
  });
  gametime.on("renderScene", function() {
    gametime.connectedPlayers += 1;
    setTimeout(() => {
      if (gametime.connectedPlayers == 1) {
        willBeAutoHost = true;
      }
    }, 0);
  });
  gametime.on("collectId", (id) => {
    gametime.idList.push(id);
    gametime.idList = [... new Set(gametime.idList)];
  });
  window.gametime.didConnect = function() {
    gametime.run("collectId", [gametime.user.id]);
    gametime.run("renderScene");
    setInterval(() => {
      gametime.user.position = (gametime.idList[0] == gametime.user.id) ? 1 : 2;
    });
    if (willBeAutoHost) {
      isHost = true;
      isGuest = false;
    } else {
      isHost = false;
      isGuest = true;
    }
    gametime.run("isGuest");
  };
});
