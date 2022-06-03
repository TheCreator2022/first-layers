const game = {
    version: "1.0",
    timeSaved: Date.now(),
    layers: [],
    highestLayer: 0,
    highestUpdatedLayer: 0,
    automators: {
        autoMaxAll: new Automator("Auto Max All", "Automatically buys max on all Layers", () =>
        {
            for(let i = Math.max(0, game.volatility.autoMaxAll.apply().toNumber()); i < game.layers.length; i++)
            {
                game.layers[i].maxAll();
            }
        }, new DynamicLayerUpgrade(level => Math.floor(level / 3) + 1, () => null, () => "Decrease the Automator interval",
            level => Decimal.pow(10, PrestigeLayer.getPrestigeCarryOverForLayer(level.toNumber()) * [0.2, 0.5, 0.8][level.toNumber() % 3]),
            level => level.gt(0) ? Math.pow(0.8, level.toNumber() - 1) * 10 : Infinity, null, {
                getEffectDisplay: effectDisplayTemplates.automator()
            })),
        autoPrestige: new Automator("Auto Prestige", "Automatically prestiges all Layers", () =>
        {
            for(let i = 0; i < game.layers.length - 1; i++)
            {
                if(game.layers[game.layers.length - 2].canPrestige() && !game.settings.autoPrestigeHighestLayer)
                {
                    break;
                }
                if(game.layers[i].canPrestige() && !game.layers[i].isNonVolatile())
                {
                    game.layers[i].prestige();
                }
            }
        }, new DynamicLayerUpgrade(level => Math.floor(level / 2) + 2, () => null, () => "Decrease the Automator interval",
            level => Decimal.pow(10, PrestigeLayer.getPrestigeCarryOverForLayer(level.add(2).toNumber()) * (level.toNumber() % 2 === 0 ? 0.25 : 0.75)),
            level => level.gt(0) ? Math.pow(0.6, level.toNumber() - 1) * 30 : Infinity, null, {
                getEffectDisplay: effectDisplayTemplates.automator()
            })),
        autoAleph: new Automator("Auto Tasks", "Automatically Max All Task Upgrades", () =>
        {
            game.alephLayer.maxAll();
        }, new DynamicLayerUpgrade(level => level + 3, () => null, () => "Decrease the Automator interval",
            level => Decimal.pow(10, PrestigeLayer.getPrestigeCarryOverForLayer(level.add(3).toNumber()) * 0.7),
            level => level.gt(0) ? Math.pow(0.6, level.toNumber() - 1) * 60 : Infinity, null, {
                getEffectDisplay: effectDisplayTemplates.automator()
            })),
    },
    hackers: {
        autoKiller: new Hacker("Auto Upgrade Killers", "Automatically buys max on all killers", () =>
        {
            game.metaLayer.maxAll()
        }, new DynamicLayerUpgrade(level => Math.floor(level / 3) + 1, () => null, () => "Decrease the Automator interval",
            level => Decimal.pow(10, PrestigeLayer.getPrestigeCarryOverForLayer(level.toNumber()) * [0.2, 0.5, 0.8][level.toNumber() % 3]),
            level => level.gt(0) ? Math.pow(0.8, level.toNumber() - 1) * 360 : Infinity, null, {
                getEffectDisplay: effectDisplayTemplates.automator()
            }))
    },
    volatility: {
        layerVolatility: new DynamicLayerUpgrade(level => level + 1, level => level,
            function()
            {
                return "Make the next Layer non-volatile";
            }, level => Decimal.pow(10, PrestigeLayer.getPrestigeCarryOverForLayer(level.add(1).toNumber())), level => level.sub(1), null, {
                getEffectDisplay: function()
                {
                    const val1 = this.level.eq(0) ? "None" : PrestigeLayer.getNameForLayer(this.apply().toNumber());
                    const val2 = PrestigeLayer.getNameForLayer(this.getEffect(this.level.add(1)).toNumber());
                    return val1 + " → " + val2;
                }
            }),
        prestigePerSecond: new DynamicLayerUpgrade(level => Math.round(level * 1.3) + 3, level => null,
            () => "Boost the Prestige Reward you get per second",
            function(level)
            {
                const max = PrestigeLayer.getPrestigeCarryOverForLayer(Math.round(level.toNumber() * 1.3) + 3);
                return Decimal.pow(10, new Random(level.toNumber() * 10 + 10).nextDouble() * max).round();
            }, level => new Decimal(0.5 + 0.1 * level), null, {
                getEffectDisplay: effectDisplayTemplates.percentStandard(0)
            }),
        autoMaxAll: new DynamicLayerUpgrade(level => level + 2, level => level,
            function()
            {
                return "The next Layer is maxed automatically each tick";
            }, level => Decimal.pow(10, PrestigeLayer.getPrestigeCarryOverForLayer(level.add(2).toNumber()) * 0.125), level => level.sub(1), null, {
                getEffectDisplay: function()
                {
                    const val1 = this.level.eq(0) ? "None" : PrestigeLayer.getNameForLayer(this.apply().toNumber());
                    const val2 = PrestigeLayer.getNameForLayer(this.getEffect(this.level.add(1)).toNumber());
                    return val1 + " → " + val2;
                }
            }),
    },
    achievements: [
        new Achievement("sus", "start the game", "?", () => (game.layers[0] && game.layers[0].resource.gt(1)) || game.metaLayer.active),
        new Achievement("100", "What this game?", "EI - 100", () => (game.layers[0] && game.layers[0].resource.gt(100)) || game.metaLayer.active),
        new Achievement("EI I", "Reach 1e15", "EI I", () => (game.layers[0] && game.layers[0].resource.gt(1e15)) || game.metaLayer.active),
        new Achievement("EI II", "Reach 1e40", "EI II", () => (game.layers[0] && game.layers[0].resource.gt(1e40)) || game.metaLayer.active),
        new Achievement("EI III", "Reach 1e365", "EI III", () => (game.layers[0] && game.layers[0].resource.gt("1e365")) || game.metaLayer.active),
        new Achievement("EI IV", "Reach 1e720", "EI IV", () => (game.layers[0] && game.layers[0].resource.gt("1e720")) || game.metaLayer.active),
        new Achievement("EI V", "Reach 1e2022", "EI V", () => (game.layers[0] && game.layers[0].resource.gt("1e2022")) || game.metaLayer.active),
        new Achievement("EI VI", "Reach 1e60000", "EI VI", () => (game.layers[0] && game.layers[0].resource.gt("1e60000")) || game.metaLayer.active),
        new Achievement("EI VII", "Reach 1ee6", "EI VII", () => (game.layers[0] && game.layers[0].resource.gt("1ee6")) || game.metaLayer.active),
        new Achievement("EI VIII", "Reach 1e2147483647", "EI VIII", () => (game.layers[0] && game.layers[0].resource.gt("1e2147483648")) || game.metaLayer.active),
        new Achievement("EI IX", "Reach 1ee13", "EI IX", () => (game.layers[0] && game.layers[0].resource.gt("1ee13")) || game.metaLayer.active),
        new Achievement("EI X", "Reach 1ee19", "EI X", () => (game.layers[0] && game.layers[0].resource.gt("1ee19")) || game.metaLayer.active),
        new Achievement("pointy", "get epic pointy thing", "☛", () => (game.layers[1] && game.layers[1].resource.gt(1)) || game.metaLayer.active),
        new Achievement("f(t)1 I", "Reach 1000", "☛ I", () => (game.layers[1] && game.layers[1].resource.gt(1000)) || game.metaLayer.active),
        new Achievement("f(t)1 II", "Reach 1e60", "☛ II", () => (game.layers[1] && game.layers[1].resource.gt(1e60)) || game.metaLayer.active),
        new Achievement("f(t)1 III", "Reach 1e2048", "☛ III", () => (game.layers[1] && game.layers[1].resource.gt("1e2048")) || game.metaLayer.active),
        new Achievement("gun", "bang bang bang - kitchen gun guy", "🔫", () => (game.layers[2] && game.layers[2].resource.gt(1)) || game.metaLayer.active),
        new Achievement("dt I", "Reach 1e10", "🔫 I", () => (game.layers[2] && game.layers[2].resource.gt(1e10)) || game.metaLayer.active),
        new Achievement("when life gives you tasks", "turn them into useless upgrades that nobody will use", "🗡", () => (game.layers[3] && game.layers[3].resource.gt(1)) || game.metaLayer.active),
        new Achievement("WHEN THE IM-", "hey hey its the icon from the game called sussy layers", "ඞ", () => (game.layers[4] && game.layers[4].resource.gt(1)) || game.metaLayer.active),
        new Achievement("impostor circle", "what", PrestigeLayer.getNameForLayer(5), () => (game.layers[5] && game.layers[5].resource.gt(1)) || game.metaLayer.active),
        new Achievement("impostor impostor", "double impostor!??!?", PrestigeLayer.getNameForLayer(9), () => (game.layers[9] && game.layers[9].resource.gt(1)) || game.metaLayer.active),
        new Achievement("sussy mode", "you are the impostor", PrestigeLayer.getNameForLayer(23), () => game.metaLayer.active),
        new Achievement("cool", "your good at this", "👍", () => game.metaLayer.layer.gte("10000")),
        new Achievement("something", "1e38 or something i think", "idk", () => game.metaLayer.layer.gte("1e38")),
        new Achievement("10^365 days", "1e365 (365 days after year?)", "`|€/-||2", () => game.metaLayer.layer.gte("1e365")),
        new Achievement("you win", "or do you?!?!?!!", "<span class='flipped-v'>ඞ</span>", () => game.metaLayer.layer.gte(INFINITY)),
        new Achievement("Starting Out", "Reach 1 α (somehow?)", "αααααααααα", () => game.metaLayer.layer.gte(INFINITY2)),
        new Achievement("Other Times Await", "something's up", "ββββββββββ", () => game.metaLayer.layer.gte(INFINITY3)),
        new Achievement("get the impossible upgrade", "what", "winwinwinwinwin", () => game.sabotageLayer.upgrades.winPercentage.level.gte("1"))
    ],
    alephLayer: new AlephLayer(),
    sabotageLayer: new SabotageLayer(),
    restackLayer: new ReStackLayer(),
    metaLayer: new MetaLayer(),
    currentLayer: null,
    currentChallenge: null,
    notifications: [],
    timeSpent: 0,
    settings: {
        tab: "Layers",
        showAllLayers: true,
        showMinLayers: 5,
        showMaxLayers: 5,
        showLayerOrdinals: true,
        layerTickSpeed: 1,
        buyMaxAlways10: true,
        disableBuyMaxOnHighestLayer: false,
        resourceColors: true,
        resourceGlow: true,
        newsTicker: true,
        autoMaxAll: true,
        autoPrestigeHighestLayer: true,
        notifications: true,
        saveNotifications: true,
        confirmations: true,
        offlineProgress: true,
        titleStyle: 2,
        theme: "sussy.css",
        layerNames: [["○","☛","🔫","🗡","ඞ"], "</-=+x>"],
    },
};
const initialGame = functions.getSaveString();
