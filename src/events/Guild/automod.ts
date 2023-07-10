import ms from "ms";
import { client } from "../..";
import { Event } from "../../class/Builders";
import { embed } from "../../func";
import { ipRegex, wait } from "aqify.js";

const swears = ["fucck", "4r5e", "5h1t", "5hit", "a55", "anal", "anus", "ar5e", "arrse", "arse", "ass", "ass-fucker", "asses", "assfucker", "assfukka", "asshole", "assholes", "asswhole", "a_s_s", "b!tch", "b00bs", "b17ch", "b1tch", "ballbag", "balls", "ballsack", "bastard", "beastial", "beastiality", "bellend", "bestial", "bestiality", "bi+ch", "biatch", "bitch", "bitcher", "bitchers", "bitches", "bitchin", "bitching", "bloody", "blow job", "blowjob", "blowjobs", "boiolas", "bollock", "bollok", "boner", "boob", "boobs", "booobs", "boooobs", "booooobs", "booooooobs", "breasts", "buceta", "bugger", "bum", "bunny fucker", "butt", "butthole", "buttmuch", "buttplug", "c0ck", "c0cksucker", "carpet muncher", "cawk", "chink", "cipa", "cl1t", "clit", "clitoris", "clits", "cnut", "cock", "cock-sucker", "cockface", "cockhead", "cockmunch", "cockmuncher", "cocks", "cocksuck", "cocksucked", "cocksucker", "cocksucking", "cocksucks", "cocksuka", "cocksukka", "cok", "cokmuncher", "coksucka", "coon", "cox", "crap", "cum", "cummer", "cumming", "cums", "cumshot", "cunilingus", "cunillingus", "cunnilingus", "cunt", "cuntlick", "cuntlicker", "cuntlicking", "cunts", "cyalis", "cyberfuc", "cyberfuck", "cyberfucked", "cyberfucker", "cyberfuckers", "cyberfucking", "d1ck", "dick", "dickhead", "dildo", "dildos", "dink", "dinks", "dirsa", "dlck", "dog-fucker", "doggin", "dogging", "donkeyribber", "doosh", "duche", "dyke", "ejaculate", "ejaculated", "ejaculates", "ejaculating", "ejaculatings", "ejaculation", "ejakulate", "f u c k", "f u c k e r", "fag", "fagging", "faggitt", "faggot", "faggs", "fagot", "fagots", "fags", "fanny", "fannyflaps", "fannyfucker", "fanyy", "fatass", "fcuk", "fcuker", "fcuking", "feck", "fecker", "felching", "fellate", "fellatio", "fingerfuck", "fingerfucked", "fingerfucker", "fingerfuckers", "fingerfucking", "fingerfucks", "fistfuck", "fistfucked", "fistfucker", "fistfuckers", "fistfucking", "fistfuckings", "fistfucks", "flange", "fook", "fooker", "fuck", "fucka", "fucked", "fucker", "fuckers", "fuckhead", "fuckheads", "fuckin", "fucking", "fuckings", "fuckingshitmotherfucker", "fuckme", "fucks", "fuckwhit", "fuckwit", "fudge packer", "fudgepacker", "fuk", "fuker", "fukker", "fukkin", "fuks", "fukwhit", "fukwit", "fux", "fux0r", "f_u_c_k", "gangbang", "gangbanged", "gangbangs", "gaylord", "gaysex", "goatse", "God", "god-dam", "god-damned", "goddamn", "goddamned", "hardcoresex", "heshe", "hoar", "hoare", "hoer", "homo", "hore", "horniest", "horny", "hotsex", "jack-off", "jackoff", "jap", "jerk-off", "jism", "jiz", "jizm", "jizz", "kawk", "knob", "knobead", "knobed", "knobend", "knobhead", "knobjocky", "knobjokey", "kock", "kondum", "kondums", "kum", "kummer", "kumming", "kums", "kunilingus", "l3i+ch", "l3itch", "labia", "lust", "lusting", "m0f0", "m0fo", "m45terbate", "ma5terb8", "ma5terbate", "masochist", "master-bate", "masterb8", "masterbat*", "masterbat3", "masterbate", "masterbation", "masterbations", "masturbate", "mo-fo", "mof0", "mofo", "mothafuck", "mothafucka", "mothafuckas", "mothafuckaz", "mothafucked", "mothafucker", "mothafuckers", "mothafuckin", "mothafucking", "mothafuckings", "mothafucks", "mother fucker", "motherfuck", "motherfucked", "motherfucker", "motherfuckers", "motherfuckin", "motherfucking", "motherfuckings", "motherfuckka", "motherfucks", "muff", "mutha", "muthafecker", "muthafuckker", "muther", "mutherfucker", "n1gga", "n1gger", "nazi", "nigg3r", "nigg4h", "nigga", "niggah", "niggas", "niggaz", "nigger", "niggers", "nob", "nob jokey", "nobhead", "nobjocky", "nobjokey", "numbnuts", "nutsack", "orgasim", "orgasims", "orgasm", "orgasms", "p0rn", "pawn", "pecker", "penis", "penisfucker", "phonesex", "phuck", "phuk", "phuked", "phuking", "phukked", "phukking", "phuks", "phuq", "pigfucker", "pimpis", "piss", "pissed", "pisser", "pissers", "pisses", "pissflaps", "pissin", "pissing", "pissoff", "poop", "porn", "porno", "pornography", "pornos", "prick", "pricks", "pron", "pube", "pusse", "pussi", "pussies", "pussy", "pussys", "rectum", "retard", "rimjaw", "rimming", "s hit", "s.o.b.", "sadist", "schlong", "screwing", "scroat", "scrote", "scrotum", "semen", "sex", "sh!+", "sh!t", "sh1t", "shag", "shagger", "shaggin", "shagging", "shemale", "shi+", "shit", "shitdick", "shite", "shited", "shitey", "shitfuck", "shitfull", "shithead", "shiting", "shitings", "shits", "shitted", "shitter", "shitters", "shitting", "shittings", "shitty", "skank", "slut", "sluts", "smegma", "smut", "snatch", "son-of-a-bitch", "spac", "spunk", "s_h_i_t", "t1tt1e5", "t1tties", "teets", "teez", "testical", "testicle", "tit", "titfuck", "tits", "titt", "tittie5", "tittiefucker", "titties", "tittyfuck", "tittywank", "titwank", "tosser", "turd", "tw4t", "twat", "twathead", "twatty", "twunt", "twunter", "v14gra", "v1gra", "vagina", "viagra", "vulva", "w00se", "wang", "wank", "wanker", "wanky", "whoar", "whore", "willies", "willy", "xrated", "xxx"];

export default new Event('messageCreate', (message) => {
    if (message.author.bot) return;
    if (!message.guild) return;

    const check_mute = async (warnreason?: string) => {
        const data = await client.db.automodInfraction.findMany({
            where: {
                guildId: message.guildId,
                userId: message.author.id,
            }
        });

        // If user has total of automod infractions higher or equal to 3, then this will be executed:
        if (data && data.length >= 3) {
            // Muting the user for 3 hours.
            await message.member.timeout(ms('3h'), warnreason).catch(() => { });

            await message.channel.send({
                embeds: [
                    embed(`${message.author.toString()} has been **auto-muted** with the ID: \`${message.id}\``, 'warn')
                ]
            });

            await client.db.infraction.create({
                data: {
                    id: message.id,
                    guildId: message.guildId,
                    userId: message.author.id,
                    moderatorId: client.user.id,
                    expires: null,
                    since: BigInt(Date.now()),
                    type: 'Mute',
                    reason: '[AutoMod] Reached over 3 infractions within 15 mins'
                }
            });

            await client.db.automodInfraction.deleteMany({
                where: {
                    guildId: message.guildId,
                    userId: message.author.id
                }
            });

            return 1;
        };

        return 0;
    };

    const flag_message = async (msg: string, warnreason?: string) => {
        await message.delete().catch(() => { });

        const res = await check_mute(warnreason);

        if (res === 1) return;

        // Adds a new infraction which expires after 6 hours.
        await client.db.automodInfraction.create({
            data: {
                id: message.id,
                guildId: message.guildId,
                userId: message.author.id,
                expires: Date.now() + ms('6h'),
                since: Date.now(),
                reason: warnreason || 'No reason was provided'
            }
        });

        await message.channel.send({
            content: `${message.author.toString()}, ${msg}. Further infractions will be a punishment.`
        }).then(async (sent) => {
            await wait(5000);

            await sent.delete().catch(() => { });
        }).catch(() => { });
    };

    if (swears.some((item) => message.content.split(' ').includes(item))) {
        flag_message('your message was flagged for swearing', '[AutoMod] Swearing or/and insulting');

        return;
    };

    if (ipRegex.test(message.content)) {
        flag_message('posting a real or fake IP is not allowed', '[AutoMod] Posting IP addresses');

        return;
    };

    let non_caps: number = 0;
    let caps: number = 0;

    for (let x = 0; x < message.content.length; x++) {
        if (!isNaN(parseInt(message.content[x]))) return;

        if (message.content[x].toUpperCase() === message.content[x]) {
            caps++;
        } else non_caps++;
    };

    const textCaps = (caps / message.content.length) * 100;

    if (message.content.length > 15 && textCaps > 60) {
        flag_message('you are using too much caps (' + textCaps + '%)', '[AutoMod] Using too much capitalized letters');

        return;
    };

    if ((message?.mentions?.members?.size || 0) > 2) {
        flag_message('you are not allowed to mass mention pings', '[AutoMod] Mass mention');

        return;
    };

    const lineArray = message.content.match(/\n/g);
    const number = lineArray?.length || 0;

    if (number > 4) {
        flag_message('you cannot send a message with over 4 lines', '[AutoMod] Sending a message with over 4 lines');

        return;
    };

    if ((/discord(?:\.com|app\.com|\.gg)[\/invite\/]?(?:[a-zA-Z0-9\-]{2,32})/g).test(message.content)) {
        flag_message('you are not allowed to advertise on this server', '[AutoMod] Advertising a Discord server');

        return;
    };

    if ((/(?:(?:https?|ftp|file):\/\/|www\.|ftp\.)(?:\([-A-Z0-9+&@#\/%=~_|$?!:,.]*\)|[-A-Z0-9+&@#\/%=~_|$?!:,.])*(?:\([-A-Z0-9+&@#\/%=~_|$?!:,.]*\)|[A-Z0-9+&@#\/%=~_|$])/igm).test(message.content)) {
        flag_message('you are not allowed to send links on this server', '[AutoMod] Sending website links');

        return;
    };

    const emojiRegex = message.content.match(/<a?:.+?:\d{18}>|\p{Extended_Pictographic}|<a?:.+?:\d+>/gu);

    if ((emojiRegex?.length || 0) > 5) {
        flag_message('you have used over 5 emojis in your message', '[AutoMod] Using too much emojis');

        return;
    };
});