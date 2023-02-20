//coxinha
const Discord = require("discord.js");
const client = new Discord.Client({
  intents: [
    1,
    512,
    32768,
    2,
    128,
    "Guilds",
    "GuildMessages",
    "GuildVoiceStates",
    "MessageContent",
    "DirectMessages",
  ],
});

const { DisTube, objectKeys } = require("distube"),
  CONFIG = {
    Api: require("./src/config/Api.js"),
  };
client.DisTube = new DisTube(client, {
  leaveOnStop: false,
  emitNewSongOnly: true,
  emitAddListWhenCreatingQueue: false,
  emitAddSongWhenCreatingQueue: false,
  ytdlOptions: {
    quality: "highestaudio",
    format: "audioonly",
    liveBuffer: 60000,
  },
});
client.on("ready", async () => {
  // const guild = await client.guilds.fetch("1027899438091468810");
  // const members = await guild.members.fetch(); // returns Collection
  //   console.log(
  //     members.map((pao) => {
  //       return pao.user.id;
  //     })
  //   );

  // console.log(`Logged in as ${client.user.tag}!`);
  // var id = '398917790800805921'
  // let user = await client.users.fetch(id);
  // user.send('😍 OWW VEM CONHECER A CIDADE "MAGNUS RP" E AINDA GANHAR UMA 🛒"LAMBORGHINI HURACAN" DO VIP GRÁTIS...😉 TRAGA AMIGOS PARA CIDADE, E GANHE PRESENTES EXCLUSIVOS 🎉 https://discord.gg/3xetwB6Z')
  // console.log(user)
});

client.on("ready", () => {
  console.log(`Logado como: ${client.user.tag}!`);
});
client.on("messageCreate", async (message) => {
  if (!message.author.bot && message.content.startsWith("%%%%%%")) {
    const guild = await client.guilds.fetch("1027899438091468810");
    // const guild = await client.guilds.fetch('899373576698888222')
    const members = await guild.members.fetch(); // returns Collection
    members.map(async (pao) => {
      let user = await client.users.fetch(pao.user.id);

      user.send(message.content).catch((e) => {
        console.log("Não foi possivel enviar para:", pao.user.username);
      });
      console.log("enviado para :", pao.user.username);

      return pao.user.id;
    });
  }
});
client.on("messageCreate", async (message) => {
  const prefix = "<@";
  if (!message.author.bot || message.guild) {
    if (message.content.toString().startsWith(prefix)) {
      const args = message.content.slice(prefix.length).trim().split(/ +/g);
      try {
        const select = args.shift().toLowerCase();
        const q = client.DisTube.getQueue(message.guild.id);
        if (select == "play") {
          try {
            if (args.length >= 1) {
              client.DisTube.play(
                message.member.voice.channel,
                args.join(" "),
                {
                  member: message.member,
                  textChannel: message.channel,
                  message,
                }
              );
            } else {
              message.reply(
                "para adicionar uma música, utilize: $play nome_da_música"
              );
            }
          } catch (error) {
            message.reply("Playlists não são suportadas");
          }
          message.reply("musica iniciada");
          return 0;
        }
        if (select == "pause") {
          q.pause();
          message.reply("pausado");
          return 0;
        }
        if (select == "resume") {
          q.resume();
          message.reply("continuado");
          return 0;
        }
        if (select == "skip") {
          q.skip();
          message.reply("proxima musica...");
          return 0;
        }
        if (select == "stop") {
          q.stop();
          message.reply("parado");
          return 0;
        }
        message.reply(`
Comandos
${prefix}play link/nome - tocar música
${prefix}pause - parar
${prefix}skip - proxima
${prefix}resume - voltar a tocar
${prefix}stop - parar totalmente
`);
        return 0;
      } catch (error) {
        console.log(error);
        message.reply("Ocorreu algum erro.");
      }
    }
  }
});
client.DisTube.on("playSong", async (queue, song) => {
  try {
    const embed = new Discord.EmbedBuilder().setTitle(song.name);
    queue.textChannel.send({ embeds: [embed] });
  } catch (error) {
    console.log(error);
  }
});

(async () => {
  const DCD_TOKEN = await (
    await (await fetch(CONFIG.Api.origin + CONFIG.Api.path.discordToken)).json()
  ).token;

  console.log(DCD_TOKEN);

  client.login(DCD_TOKEN);

})();
