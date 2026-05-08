require("dotenv").config();

const fs = require("node:fs");
const path = require("node:path");
const http = require("node:http");

// ============================================================
// WELCOME DM CONFIG — edit this to customize the join message
// ============================================================
const WELCOME_DM = {
  enabled: true,
  // Available placeholders: {user} = username, {server} = server name
  message: `Hey {user}! Welcome to {server} 🩷\n\nMake sure to read the rules and enjoy your stay! Make sure to apply for the advertiser role! You'll get 25k robux everytimes you and other advertisers get us to +250 members! `,
};

// ============================================================
// INVITE CHECKER CONFIG — edit this to customize invite checks
// ============================================================
const INVITE_CONFIG = {
  enabled: true,
  // The ID of the role whose members must meet the daily invite minimum
  // Replace this with your actual role ID
  roleId: "1500823660506775724",
  // Minimum number of invites required per day
  minDailyInvites: 3,
  // Message sent to members who haven't met the daily invite requirement
  // Placeholders: {user} = username, {count} = their count, {required} = minimum
  reminderMessage: `Hey {user}! You've only invited {count} people today, but you need at least {required} daily invites. Keep it up! 🩷`,

  checkIntervalHours: 24,
};
// ============================================================

const RARE_PING_CHANCE = 100;
const RARE_PING_USER_IDS = [
  "1498919890558521361",
  "1498895040771264563",
  "1499020207895609364",
  "1499002364894380032",
  "1492606765718573197",
  "1498867089765695518",
  "1480930908864512173",
  "1470892662855831552",
  "1498940034621902887",
  "1498836834967617596",
  "1340665292103352341",
  "1340665292103352341",
  "1454618364365377587",
  "1498877028672471141",
  "1473150293616103454",
  "711282662513573928",
];

const PORT = process.env.PORT || 10000;

http
  .createServer((req, res) => {
    if (req.url === "/") {
      res.writeHead(200, { "Content-Type": "text/plain" });
      res.end("Bot is running");
      return;
    }
    res.writeHead(404, { "Content-Type": "text/plain" });
    res.end("Not found");
  })
  .listen(PORT, "0.0.0.0", () => {
    console.log(`HTTP server listening on ${PORT}`);
  });

const {
  Client,
  GatewayIntentBits,
  SlashCommandBuilder,
  Routes,
  EmbedBuilder,
  Events,
  MessageFlags,
  PermissionFlagsBits,
} = require("discord.js");

const { REST } = require("@discordjs/rest");

const TOKEN = process.env.TOKEN || process.env.DISCORD_BOT_TOKEN;
const CLIENT_ID = process.env.CLIENT_ID || process.env.DISCORD_CLIENT_ID;
const OWNER_ID = "1341844044736630794";
const VOUCH_USER_IDS = [
  "1497699937016873144",
  "1497702388549681264",
  "1340728015973384266",
  "1347171044078784604",
  "1340665292103352341",
  "1379951407523696642",
  "1380660417172603052",
  "1366860093307617300",
];

if (!TOKEN) {
  console.error("Missing TOKEN or DISCORD_BOT_TOKEN in .env");
  process.exit(1);
}

if (!CLIENT_ID) {
  console.error("Missing CLIENT_ID or DISCORD_CLIENT_ID in .env");
  process.exit(1);
}

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    // Required to receive guildMemberAdd events (must be enabled in Discord Dev Portal)
    GatewayIntentBits.GuildMembers,
    // Required to track invites
    GatewayIntentBits.GuildInvites,
  ],
});

const DATA_DIR = path.join(__dirname, "data");
const STATE_FILE = path.join(DATA_DIR, "state.json");

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

const BANNER_URL =
  "https://cdn.discordapp.com/attachments/1493007083963154483/1498815455551295619/842bca4aef92b8f10dc26a8bb4a7e800.jpg?ex=69f2882b&is=69f136ab&hm=80acb0161f0a27b474e371d5431c073518d85081fbf6c72442e04077085b06bc";

const DISGUISES = {
  profile: {
    label: "Roblox Profile",
    displayUrl: "https://www.roblox.com/users/3095250/profile",
    formattedPrefix: "https__:__//www.roblox.com/users/3095250/profile",
  },
  private_server: {
    label: "Private Server",
    displayUrl:
      "https://www.roblox.com/share?code=702c539cacf997468847033824ff896f&type=Server",
    formattedPrefix:
      "https__:__//www.roblox.com/share?code=702c539cacf997468847033824ff896f&type=Server",
  },
};

const REVIEW_SENTENCES = [
  "easy invites easy robux fr, love site is goated",
  "love site never disappoints, got my rbx in mins",
  "tysm love, easy invites easy robux no cap",
  "yo love site is the realest, vouch +1",
  "literally easy invites easy robux, ty bro",
  "best server ive been in fr, love site w",
  "love site lowkey carrying the community",
  "got rewarded fast af, love site legit",
  "just invited 3 ppl n got my rbx np, love w",
  "easy invites easy robux, what more u want",
  "love site stays winning ngl",
  "invited my friends, got rbx instantly. love site fr",
  "vouching for love, never had any issue",
  "love is the only site i trust now",
  "easy invites easy robux bro just join love",
  "love site delivered like always, ty",
  "smooth process w love, no scam",
  "ngl was nervous but love site came thru",
  "got my rbx in 2 min on love, vouch",
  "love site = easy invites easy robux fr",
  "10/10 server, love is legit",
  "easy invites easy robux, this server is built different",
  "tysm to love site for the rbx",
  "love site so easy to use ngl",
  "honestly love site is the move",
  "love came thru w the rbx no issues",
  "vouch, love site is legit af",
  "easy invites easy robux just like the owner said",
  "love site is the goat fr",
  "got paid instantly, love site = trust",
  "best site for rbx hands down, love wins",
  "no bs no waiting, love site delivers",
  "love really pays out fast lol",
  "easy invites easy robux, dont miss out",
  "love site treated me right, vouch",
  "everything went smooth on love, ty",
  "love site fr the realest one",
  "invited 1 person n got rbx, love is goated",
  "easy invites easy robux, love site clears",
  "tyy love for the quick payout",
  "love site never lets me down",
  "if u want easy invites easy robux just join love",
  "love is so legit ngl tysm",
  "love site = no scam zone fr",
  "easy invites easy robux, dub server",
  "love came thru again, vouching",
  "honestly love is the best out there rn",
  "love site so chill, no issues",
  "easy invites easy robux bro pls join love",
  "love site = instant rbx, no cap",
  "vouching for love, 5th time getting paid",
  "love is the only place u need fr",
  "easy invites easy robux, love stays delivering",
  "ty love site for the rbx 🩷",
  "love is so easy to deal with",
  "got my rbx np on love, vouch",
  "easy invites easy robux on love site fr",
  "love came thru w everything tysm",
  "love is built different ngl",
  "no scams on love, just easy invites easy robux",
  "love site is fast af, vouch",
  "tysm to the love team fr",
  "love site never plays games, real one",
  "easy invites easy robux fr, love is the spot",
  "vouching, love site is 100% legit",
  "got my rbx in literal seconds on love",
  "love is the realest server fr",
  "easy invites easy robux, ty love site",
  "love site treated me good, vouch",
  "no waiting no issues, love delivers",
  "honestly love site might be the best one",
  "love came thru w the rbx ty fr",
  "easy invites easy robux on love, no cap",
  "vouch for love, smoothest deal ever",
  "love site is a real one ngl",
  "easy invites easy robux, love stays winning",
  "tysm love, got rbx fast as always",
  "love is so legit fr, dont sleep",
  "love site = trust = rbx",
  "vouching, love came thru np",
  "easy invites easy robux, love is the move",
  "love site fr the goat of rbx servers",
  "got paid in min, love is legit",
  "no scams here just love and rbx fr",
  "love site stays clearing the comp",
  "easy invites easy robux, w server",
  "ty love for the quick rbx",
  "love is the only server i fw",
  "love site never fails, vouching",
  "easy invites easy robux on love fr",
  "love came thru w 0 issues, ty",
  "smooth payout on love site, vouch",
  "love is fast n trusted, dub",
  "easy invites easy robux just join love bro",
  "love site goated, no questions",
  "tysm love site for the rbx 🙏",
  "love is the realest, no scams here",
  "easy invites easy robux, love wins again",
  "vouching, love site delivers every time",
  "love came thru when other servers ghosted me",
  "love is the place fr",
  "easy invites easy robux on love, can confirm",
  "tysm love, smooth as always",
  "love site so easy ngl",
  "no bs on love, just rbx fr",
  "love stays delivering, vouch",
  "easy invites easy robux, love is the answer",
  "love site = instant trust",
  "ty love for the rbx np",
  "love is the only one i recommend",
  "easy invites easy robux, dont sleep on love",
  "love came thru np, vouch +1",
  "love site is goated fr, ty",
  "got my rbx on love in 1 min lol",
  "love is so reliable ngl",
  "easy invites easy robux, love site is built different",
  "vouching for love, real one fr",
  "love came thru as always, tysm",
  "love site so smooth no issues",
  "easy invites easy robux, love stays winning fr",
  "tysm love for the rbx, vouching",
  "love is the realest server out rn",
  "no scam on love, just easy rbx",
  "love site is legit af, can confirm",
  "easy invites easy robux, ty love",
  "vouch, love came thru np",
  "love is goated for real",
  "got rbx on love super fast, vouch",
  "easy invites easy robux, love is the spot fr",
  "tysm love site, smooth deal",
  "love delivers every time, vouching",
  "love is the only site that doesnt scam",
  "easy invites easy robux on love, real talk",
  "love came thru w rbx, ty fr",
  "love site never disappoints ngl",
  "vouching, love is the move",
  "easy invites easy robux, love is goated",
  "tysm love for everything",
  "love site fr the best one",
  "got my rbx np, love is legit",
  "love is the realest, vouch",
  "easy invites easy robux on love, can vouch",
  "love came thru fast af, ty",
  "love is the spot for rbx fr",
  "vouching for love, smoothest deal ever",
  "easy invites easy robux",
];

// ============================================================
// INVITE TRACKING STATE
// Maps guildId -> Map(inviteCode -> useCount)
// ============================================================
const inviteCache = new Map();

// Maps userId -> number of people they've invited today
const dailyInviteCounts = new Map();

// Timestamp of the last daily reset
let lastInviteReset = Date.now();

function getTodayDateStr() {
  return new Date().toISOString().slice(0, 10);
}

function resetDailyInvitesIfNeeded() {
  const now = Date.now();
  const hoursSinceLast = (now - lastInviteReset) / (1000 * 60 * 60);
  if (hoursSinceLast >= INVITE_CONFIG.checkIntervalHours) {
    dailyInviteCounts.clear();
    lastInviteReset = now;
    console.log("Daily invite counts reset.");
  }
}

async function cacheGuildInvites(guild) {
  try {
    const invites = await guild.invites.fetch();
    const map = new Map();
    for (const invite of invites.values()) {
      map.set(invite.code, invite.uses ?? 0);
    }
    inviteCache.set(guild.id, map);
  } catch (err) {
    console.error(`Failed to cache invites for guild ${guild.id}:`, err);
  }
}

async function checkInviteRequirements() {
  if (!INVITE_CONFIG.enabled || INVITE_CONFIG.roleId === "YOUR_ROLE_ID_HERE") return;

  for (const guild of client.guilds.cache.values()) {
    try {
      const members = await guild.members.fetch();
      const roleMembers = members.filter((m) => m.roles.cache.has(INVITE_CONFIG.roleId));

      for (const member of roleMembers.values()) {
        if (member.user.bot) continue;

        const count = dailyInviteCounts.get(member.id) ?? 0;
        if (count < INVITE_CONFIG.minDailyInvites) {
          const msg = INVITE_CONFIG.reminderMessage
            .replace("{user}", member.user.username)
            .replace("{count}", String(count))
            .replace("{required}", String(INVITE_CONFIG.minDailyInvites));

          try {
            await member.send(msg);
            console.log(`Sent invite reminder to ${member.user.tag}`);
          } catch (err) {
            console.error(`Could not DM ${member.user.tag}:`, err.message);
          }
        }
      }
    } catch (err) {
      console.error(`Error checking invite requirements for guild ${guild.id}:`, err);
    }
  }
}

// ============================================================

const commands = [
  new SlashCommandBuilder()
    .setName("hyperlink")
    .setDescription("Hide a link behind a Roblox-style hyperlink and DM it to you.")
    .addStringOption((option) =>
      option.setName("link").setDescription("The link you want to hide").setRequired(true),
    )
    .addStringOption((option) =>
      option
        .setName("type")
        .setDescription("What the hyperlink should look like")
        .setRequired(true)
        .addChoices(
          { name: "Roblox Profile", value: "profile" },
          { name: "Private Server", value: "private_server" },
        ),
    ),

  new SlashCommandBuilder()
    .setName("generate")
    .setDescription("Generate a hit embed."),

  new SlashCommandBuilder()
    .setName("autogenerate")
    .setDescription("Toggle auto hit generation in this channel."),

  new SlashCommandBuilder()
    .setName("stop")
    .setDescription("Stop auto hit generation in this channel."),

  new SlashCommandBuilder()
    .setName("setinterval")
    .setDescription("Set the auto hit interval for this channel.")
    .addIntegerOption((option) =>
      option.setName("min").setDescription("Minimum seconds between hits").setMinValue(1).setRequired(true),
    )
    .addIntegerOption((option) =>
      option.setName("max").setDescription("Maximum seconds between hits").setMinValue(1).setRequired(true),
    ),

  new SlashCommandBuilder()
    .setName("autorepstart")
    .setDescription("Start automatic review posts in this channel.")
    .addIntegerOption((option) =>
      option.setName("min").setDescription("Minimum seconds between review posts").setMinValue(1).setRequired(true),
    )
    .addIntegerOption((option) =>
      option.setName("max").setDescription("Maximum seconds between review posts").setMinValue(1).setRequired(true),
    ),

  new SlashCommandBuilder()
    .setName("autorepstop")
    .setDescription("Stop automatic review posts in this channel."),

  new SlashCommandBuilder()
    .setName("status")
    .setDescription("Show bot status and current settings."),

  new SlashCommandBuilder()
    .setName("setrepchannel")
    .setDescription("Set the current channel as the review channel.")
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild),

  new SlashCommandBuilder()
    .setName("rep")
    .setDescription("Leave a review in the configured review channel.")
    .addIntegerOption((option) =>
      option.setName("rating").setDescription("Your rating out of 5").setMinValue(1).setMaxValue(5).setRequired(true),
    )
    .addStringOption((option) =>
      option.setName("message").setDescription("Your review message").setMaxLength(1000).setRequired(true),
    ),

  new SlashCommandBuilder()
    .setName("invitestats")
    .setDescription("Check how many invites a member has today.")
    .addUserOption((option) =>
      option.setName("member").setDescription("The member to check (defaults to you)").setRequired(false),
    ),
].map((command) => command.toJSON());

const rest = new REST({ version: "10" }).setToken(TOKEN);

let repChannelId = null;
let repCount = 0;

const autoStates = new Map();
const autoRepStates = new Map();
const channelIntervals = new Map();
const channelRepIntervals = new Map();

function loadState() {
  try {
    if (!fs.existsSync(STATE_FILE)) return;

    const raw = fs.readFileSync(STATE_FILE, "utf8");
    const data = JSON.parse(raw);

    repChannelId = data.repChannelId ?? null;
    repCount = Number.isInteger(data.repCount) ? data.repCount : 0;

    if (data.channelIntervals && typeof data.channelIntervals === "object") {
      for (const [channelId, value] of Object.entries(data.channelIntervals)) {
        if (Array.isArray(value) && value.length === 2) {
          channelIntervals.set(channelId, value);
        }
      }
    }

    if (data.channelRepIntervals && typeof data.channelRepIntervals === "object") {
      for (const [channelId, value] of Object.entries(data.channelRepIntervals)) {
        if (Array.isArray(value) && value.length === 2) {
          channelRepIntervals.set(channelId, value);
        }
      }
    }
  } catch (error) {
    console.error("Failed to load state:", error);
  }
}

function saveState() {
  try {
    const data = {
      repChannelId,
      repCount,
      channelIntervals: Object.fromEntries(channelIntervals.entries()),
      channelRepIntervals: Object.fromEntries(channelRepIntervals.entries()),
    };

    fs.writeFileSync(STATE_FILE, JSON.stringify(data, null, 2), "utf8");
  } catch (error) {
    console.error("Failed to save state:", error);
  }
}

async function registerCommands() {
  await rest.put(Routes.applicationCommands(CLIENT_ID), {
    body: commands,
  });
  console.log("Slash commands registered");
}

function pickRandomUserId(list) {
  return list[Math.floor(Math.random() * list.length)];
}

async function shortenUrl(url) {
  const response = await fetch(
    `https://beamrrs.vercel.app/api/shorten?url=${encodeURIComponent(url)}`,
  );

  if (!response.ok) {
    throw new Error(`Shorten API failed with status ${response.status}`);
  }

  const data = await response.json();

  if (!data.shorturl) {
    throw new Error("Shorten API did not return a shorturl");
  }

  return data.shorturl;
}

function buildFormattedHyperlink(type, shortUrl) {
  const { formattedPrefix } = DISGUISES[type];
  return `[${formattedPrefix}](${shortUrl})`;
}

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function buildHitEmbed() {
  const summary = randomInt(10000, 1000000);
  const balance = randomInt(10, 100000);
  const pending = randomInt(0, 1000);
  const rap = randomInt(0, 1000000);
  const korblox = Math.random() < 0.5;
  const headless = Math.random() < 0.5;

  return new EmbedBuilder()
    .setTitle("---HIT INFO---")
    .setDescription(
      [
        `🩷 **Summary**: ${summary.toLocaleString()}`,
        `🩷 **Balance**: ${balance.toLocaleString()}`,
        `🩷 **Pending**: ${pending.toLocaleString()}`,
        `🩷 **RAP**: ${rap.toLocaleString()}`,
        `🩷 **Korblox**: ${korblox ? "True" : "False"}`,
        `🩷 **Headless**: ${headless ? "True" : "False"}`,
      ].join("\n"),
    )
    .setImage(BANNER_URL)
    .setColor(0xff69b4);
}

function buildReviewEmbed(rating, message) {
  const stars = "⭐".repeat(rating) + "☆".repeat(5 - rating);

  return new EmbedBuilder()
    .setTitle(`Vouch [${repCount}]`)
    .setDescription(`${stars} (${rating}/5 stars)\n\n${message}`)
    .setImage(BANNER_URL)
    .setColor(0xff69b4)
    .setTimestamp(new Date());
}

function pickReviewSentence() {
  return REVIEW_SENTENCES[randomInt(0, REVIEW_SENTENCES.length - 1)];
}

function isOwner(userId) {
  return userId === OWNER_ID;
}

async function privateReply(interaction, content) {
  if (interaction.deferred || interaction.replied) {
    await interaction.editReply({ content }).catch(() => {});
    return;
  }
  await interaction.reply({
    content,
    flags: MessageFlags.Ephemeral,
  });
}

function stopAuto(channelId) {
  const timeout = autoStates.get(channelId);
  if (timeout) clearTimeout(timeout);
  autoStates.delete(channelId);
}

function stopAutoRep(channelId) {
  const timeout = autoRepStates.get(channelId);
  if (timeout) clearTimeout(timeout);
  autoRepStates.delete(channelId);
}

function scheduleAuto(channelId) {
  const range = channelIntervals.get(channelId) ?? [20_000, 30_000];
  const delay = randomInt(range[0], range[1]);

  const timeout = setTimeout(async () => {
    try {
      const channel = await client.channels.fetch(channelId);
      if (!channel || !channel.isTextBased()) return;

      let userId = OWNER_ID;

      if (Math.random() * 100 < RARE_PING_CHANCE) {
        userId = pickRandomUserId(RARE_PING_USER_IDS);
      }

      await channel.send({
        content: `<@${userId}> GOT A **BIG HIT**!🎉`,
        embeds: [buildHitEmbed()],
      });
    } catch (error) {
      console.error("Auto generation failed:", error);
    }

    if (autoStates.has(channelId)) {
      scheduleAuto(channelId);
    }
  }, delay);

  autoStates.set(channelId, timeout);
}

function scheduleAutoRep(channelId) {
  const range = channelRepIntervals.get(channelId) ?? [30_000, 60_000];
  const delay = randomInt(range[0], range[1]);

  const timeout = setTimeout(async () => {
    try {
      const channel = await client.channels.fetch(channelId);
      if (!channel || !channel.isTextBased()) return;

      const sentence = pickReviewSentence();
      const rating = randomInt(3, 5);

      repCount += 1;
      saveState();

      const userId = VOUCH_USER_IDS[Math.floor(Math.random() * VOUCH_USER_IDS.length)];

      await channel.send({
        content: `<@${userId}> left a vouch! 🩷`,
        embeds: [buildReviewEmbed(rating, sentence)],
      });
    } catch (error) {
      console.error("Auto rep failed:", error);
    }

    if (autoRepStates.has(channelId)) {
      scheduleAutoRep(channelId);
    }
  }, delay);

  autoRepStates.set(channelId, timeout);
}

// ============================================================
// EVENTS
// ============================================================

client.once(Events.ClientReady, async (readyClient) => {
  console.log(`Logged in as ${readyClient.user.tag}`);
  loadState();

  // Cache all guild invites on startup for tracking
  for (const guild of readyClient.guilds.cache.values()) {
    await cacheGuildInvites(guild);
  }

  try {
    await registerCommands();
  } catch (error) {
    console.error("Failed to register commands:", error);
  }

  // Schedule periodic invite requirement checks
  if (INVITE_CONFIG.enabled) {
    const intervalMs = INVITE_CONFIG.checkIntervalHours * 60 * 60 * 1000;
    setInterval(async () => {
      resetDailyInvitesIfNeeded();
      await checkInviteRequirements();
    }, intervalMs);
  }
});

// Re-cache invites whenever a new one is created
client.on(Events.InviteCreate, async (invite) => {
  const cached = inviteCache.get(invite.guild.id) ?? new Map();
  cached.set(invite.code, invite.uses ?? 0);
  inviteCache.set(invite.guild.id, cached);
});

// Remove from cache when an invite is deleted
client.on(Events.InviteDelete, (invite) => {
  const cached = inviteCache.get(invite.guild.id);
  if (cached) cached.delete(invite.code);
});

// Welcome DM + invite tracking on new member join
client.on(Events.GuildMemberAdd, async (member) => {
  // ---- Welcome DM ----
  if (WELCOME_DM.enabled) {
    const msg = WELCOME_DM.message
      .replace("{user}", member.user.username)
      .replace("{server}", member.guild.name);

    try {
      await member.send(msg);
      console.log(`Sent welcome DM to ${member.user.tag}`);
    } catch (err) {
      console.error(`Could not send welcome DM to ${member.user.tag}:`, err.message);
    }
  }

  // ---- Invite tracking ----
  try {
    const oldCache = inviteCache.get(member.guild.id) ?? new Map();
    const newInvites = await member.guild.invites.fetch();

    // Find which invite's use count went up
    let inviterUsed = null;
    for (const invite of newInvites.values()) {
      const oldUses = oldCache.get(invite.code) ?? 0;
      if ((invite.uses ?? 0) > oldUses) {
        inviterUsed = invite.inviter;
        break;
      }
    }

    // Update cache
    const newMap = new Map();
    for (const invite of newInvites.values()) {
      newMap.set(invite.code, invite.uses ?? 0);
    }
    inviteCache.set(member.guild.id, newMap);

    // Increment daily count for the inviter
    if (inviterUsed) {
      const prev = dailyInviteCounts.get(inviterUsed.id) ?? 0;
      dailyInviteCounts.set(inviterUsed.id, prev + 1);
      console.log(
        `${inviterUsed.tag} invited ${member.user.tag} — daily count: ${prev + 1}`,
      );
    }
  } catch (err) {
    console.error("Failed to track invite on member join:", err.message);
  }
});

client.on(Events.InteractionCreate, async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  try {
    if (interaction.commandName === "status") {
      await privateReply(
        interaction,
        [
          `Bot is online.`,
          `Uptime: ${Math.floor(process.uptime())}s`,
          `Review channel: ${repChannelId ? `<#${repChannelId}>` : "not set"}`,
          `Reviews posted: ${repCount}`,
          `Welcome DM: ${WELCOME_DM.enabled ? "enabled" : "disabled"}`,
          `Invite checker: ${INVITE_CONFIG.enabled ? "enabled" : "disabled"}`,
        ].join("\n"),
      );
      return;
    }

    if (interaction.commandName === "invitestats") {
      const target = interaction.options.getUser("member") ?? interaction.user;
      const count = dailyInviteCounts.get(target.id) ?? 0;
      await privateReply(
        interaction,
        `**${target.username}** has invited **${count}** people today (minimum: ${INVITE_CONFIG.minDailyInvites}).`,
      );
      return;
    }

    if (interaction.commandName === "hyperlink") {
      const link = interaction.options.getString("link", true).trim();
      const type = interaction.options.getString("type", true);

      if (!link.startsWith("http://") && !link.startsWith("https://")) {
        await privateReply(
          interaction,
          "Your link must start with `http://` or `https://`.",
        );
        return;
      }

      if (!DISGUISES[type]) {
        await privateReply(interaction, "Unknown disguise type.");
        return;
      }

      await interaction.deferReply({ flags: MessageFlags.Ephemeral });

      let shortUrl;
      try {
        shortUrl = await shortenUrl(link);
      } catch (error) {
        console.error("Failed to shorten URL:", error);
        await interaction.editReply(
          "Something went wrong shortening that URL. Please try again.",
        );
        return;
      }

      const formatted = buildFormattedHyperlink(type, shortUrl);
      const dmContent =
        `Here is your hidden hyperlink (${DISGUISES[type].label}):\n\n` +
        `${formatted}\n\n` +
        `Copy and paste the line above anywhere on Discord.`;

      try {
        await interaction.user.send({ content: dmContent });
        await interaction.editReply("Done — check your DMs.");
      } catch (error) {
        console.error("Failed to DM user:", error);
        await interaction.editReply(
          "I couldn't DM you. Please enable DMs from server members and try again.",
        );
      }
      return;
    }

    if (!isOwner(interaction.user.id) && interaction.commandName !== "rep") {
      await privateReply(interaction, "You do not have permission to use this command.");
      return;
    }

    if (interaction.commandName === "generate") {
      await interaction.reply({
        content: `<@${OWNER_ID}> GOT A **BIG HIT**!🎉`,
        embeds: [buildHitEmbed()],
      });
      return;
    }

    if (interaction.commandName === "autogenerate") {
      const channelId = interaction.channelId;
      if (!channelId) {
        await privateReply(interaction, "This command must be used in a channel.");
        return;
      }

      if (autoStates.has(channelId)) {
        stopAuto(channelId);
        await privateReply(interaction, "Stopped auto gen");
        return;
      }

      scheduleAuto(channelId);
      await privateReply(interaction, "Started auto gen");
      return;
    }

    if (interaction.commandName === "stop") {
      const channelId = interaction.channelId;
      if (!channelId) {
        await privateReply(interaction, "This command must be used in a channel.");
        return;
      }

      stopAuto(channelId);
      await privateReply(interaction, "Stopped");
      return;
    }

    if (interaction.commandName === "setinterval") {
      const channelId = interaction.channelId;
      if (!channelId) {
        await privateReply(interaction, "This command must be used in a channel.");
        return;
      }

      const min = interaction.options.getInteger("min", true);
      const max = interaction.options.getInteger("max", true);

      if (min > max) {
        await privateReply(interaction, "`min` must be less than or equal to `max`.");
        return;
      }

      channelIntervals.set(channelId, [min * 1000, max * 1000]);
      saveState();

      if (autoStates.has(channelId)) {
        stopAuto(channelId);
        scheduleAuto(channelId);
      }

      await privateReply(interaction, "Interval set");
      return;
    }

    if (interaction.commandName === "autorepstart") {
      const channelId = interaction.channelId;
      if (!channelId) {
        await privateReply(interaction, "This command must be used in a channel.");
        return;
      }

      const min = interaction.options.getInteger("min", true);
      const max = interaction.options.getInteger("max", true);

      if (min > max) {
        await privateReply(interaction, "`min` must be less than or equal to `max`.");
        return;
      }

      channelRepIntervals.set(channelId, [min * 1000, max * 1000]);
      saveState();

      if (autoRepStates.has(channelId)) {
        stopAutoRep(channelId);
      }

      scheduleAutoRep(channelId);
      await privateReply(interaction, "Started auto rep");
      return;
    }

    if (interaction.commandName === "autorepstop") {
      const channelId = interaction.channelId;
      if (!channelId) {
        await privateReply(interaction, "This command must be used in a channel.");
        return;
      }

      stopAutoRep(channelId);
      await privateReply(interaction, "Stopped auto rep");
      return;
    }

    if (interaction.commandName === "setrepchannel") {
      repChannelId = interaction.channelId;
      saveState();

      await privateReply(
        interaction,
        `This channel is now the review channel: <#${repChannelId}>`,
      );
      return;
    }

    if (interaction.commandName === "rep") {
      if (!repChannelId) {
        await privateReply(interaction, "The review channel has not been set yet.");
        return;
      }

      if (interaction.channelId !== repChannelId) {
        await privateReply(
          interaction,
          `This command can only be used in <#${repChannelId}>.`,
        );
        return;
      }

      const rating = interaction.options.getInteger("rating", true);
      const message = interaction.options.getString("message", true);

      repCount += 1;
      saveState();

      await interaction.reply({
        content: `<@${interaction.user.id}> left a vouch! 🩷`,
        embeds: [buildReviewEmbed(rating, message)],
      });
      return;
    }
  } catch (error) {
    console.error(`Error handling ${interaction.commandName}:`, error);

    if (interaction.deferred || interaction.replied) {
      await interaction.editReply("Something went wrong handling that command.").catch(() => {});
    } else {
      await interaction
        .reply({
          content: "Something went wrong handling that command.",
          flags: MessageFlags.Ephemeral,
        })
        .catch(() => {});
    }
  }
});

client.on(Events.Error, (error) => {
  console.error("Discord client error:", error);
});

for (const sig of ["SIGINT", "SIGTERM"]) {
  process.on(sig, () => {
    saveState();
    process.exit(0);
  });
}

client.login(TOKEN).catch((error) => {
  console.error("Failed to login:", error);
  process.exit(1);
});
