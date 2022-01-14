const Discord = require("discord.js");
const config = require("../botconfig/config.json");

module.exports = function (client, options) {

    const description = {
        name: "Status Role",
    }
    client.logger(`〢 Module: Loaded ${description.name}`.bold.green);

    client.on("presenceUpdate", async (oP, nP) => {
        let guild = client.guilds.cache.get(config.serverId)
        if (!guild) return;
        if (nP) {

            var user = guild.members.cache.get(nP.userId);

            if (!user || !user.roles) user = await guild.members.fetch(nP.userId).catch(() => {}) || false;

            if (!user) return;

            if (nP.activities.some(({
                    state
                }) => state?.includes(config.status))) {
                if (!user.roles.cache.has(config.roleId)) {
                    user.roles.add(config.roleId).catch(() => {});
                }
            } else {
                if (user.roles.cache.has(config.roleId)) {
                    user.roles.remove(config.roleId).catch(() => {});
                }
            }
        }
    })

    client.on("ready", async () => {

        let guild = client.guilds.cache.get(config.serverId)
        if (!guild) return;

        let fm = await guild.members.fetch().catch(() => {})

        let haveStatus = [...fm.filter(user =>
            !user.user.bot && !user.roles.cache.has(config.roleId) &&
            user.presence && user.presence.activities.some(({
                state
            }) => state?.includes(config.status))
        ).values()];

        let noStatus = [...fm.filter(user =>
            !user.user.bot && !user.roles.cache.has(config.roleId) &&
            (!user.presence || !user.presence.activities.some(({
                state
            }) => state?.includes(config.status)))
        ).values()];

        for (const user of haveStatus) {
            await user.roles.add(config.roleId).catch(() => {});
            await delay(350);
        }

        for (const user of noStatus) {
            await user.roles.remove(config.roleId).catch(() => {});
            await delay(350);
        }
    })

    function delay(delayInms) {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve(2);
            }, delayInms);
        });
    }
}
