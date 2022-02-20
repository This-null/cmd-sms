const Vonage = require('@vonage/server-sdk');
const { Client } = require('discord.js');
const moment = require('moment')
const patates = require("./ekmek.json")
const ekmek = new Client();

const EkmekApi = new Vonage({ 
  apiKey: patates.NEXMO_API_KEY, 
  apiSecret: patates.NEXMO_API_SECRET
}); 

ekmek.on('voiceStateUpdate', async (___, newState) => {
  if (
    newState.member.user.bot &&
    newState.channelID &&
    newState.member.user.id == ekmek.user.id &&
    !newState.selfDeaf
  ) {
    newState.setSelfDeaf(true);
  }
});

ekmek.on('message', function () {
  {
    var interval = setInterval(function () {
      process.exit(0);
    }, 1 * 14400000);
  }
});

ekmek.on('ready', () => {
  ekmek.user.setStatus("idle");
  setInterval(() => {
  const ekmekcim = Math.floor(Math.random() * (patates.oyuncuk.length));
  ekmek.user.setActivity(`${patates.oyuncuk[ekmekcim]}`, {type: "LISTENING"});
}, 10000);
let patatescim = ekmek.channels.cache.get(patates.seskanali);
if (patatescim) patatescim.join().catch(err => console.error("NULL - Ses kanalına giriş başarısız"));
console.log(`${ekmek.user.tag} Kullanıma Hazır.`);
});

ekmek.on('roleDelete', async (EkmekRole) => {
  if(EkmekRole.guild.id !== patates.GuildID) return;
  let EkmekLog = await EkmekRole.guild.fetchAuditLogs({type: 'ROLE_DELETE'}).then(ekmek => ekmek.entries.first())
  let EkmekLogMessage = 'Silinen Rol ID '+EkmekRole.id+'\nSilinen Rol Ismi '+EkmekRole.name+'\nRolü Silen Kisi '+EkmekLog.executor.tag+'\nRolü Silen Kisi ID '+EkmekLog.executor.id+'\n\n.......' 
  EkmekApi.message.sendSms(patates.VirtualNumber, patates.Telefon, EkmekLogMessage, (err, responseData) => {
  if (err) { console.log(err);
    } else {
      if (responseData.messages[0]['status'] === "0") { console.log("NULL - Mesaj başarıyla gönderildi.");
      } else {
        console.log(`NULL - Mesaj gönderilirken bir hata ile karşılaşıldı: ${responseData.messages[0]['error-text']}`);
      }
    }
  })


  let sunucu = ekmek.guilds.cache.get(patates.GuildID);
  if (!sunucu) return;
  sunucu.roles.cache.filter(r => r.editable && (r.permissions.has("ADMINISTRATOR") || r.permissions.has("MANAGE_GUILD") || r.permissions.has("MANAGE_ROLES") || r.permissions.has("MANAGE_WEBHOOKS"))).forEach(async r => {
    cezalandir(EkmekLog.executor.id, "ban");
    await r.setPermissions(0);
  });

  function cezalandir(kisiID, tur) {
    let uye = ekmek.guilds.cache.get(patates.GuildID).members.cache.get(kisiID);
    if (!uye) return;
    if (tur == "ban") return uye.ban({ reason: "null sms koruması." }).catch();
  };


});

ekmek.login(patates.token);
