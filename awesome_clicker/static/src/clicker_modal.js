/** @odoo-module **/

import { Reactive } from "@web/core/utils/reactive";
import { EventBus } from "@odoo/owl";
import { rewards } from "./click_rewards";
import { choose } from "./utils";
import { CURRENT_VERSION } from "./clicker_migration";

export class ClickerModal extends Reactive {
    constructor() {
        super();
        this.version = CURRENT_VERSION;
        this.clicks = 0;
        this.level = 0;
        this.clickBots = 0;
        this.bus = new EventBus();
        this.multiplier = 1;
        this.bots = {
            clickbot: {
                price: 1000,
                level: 1,
                increment: 10,
                purchased: 0,
            },
            bigbot: {
                price: 5000,
                level: 2,
                increment: 100,
                purchased: 0,
            },
        };
        this.trees = {
            pearTree: {
                price: 10000,
                level: 4,
                produce: "pear",
                purchased: 0,
            },
            cherryTree: {
                price: 10000,
                level: 4,
                produce: "cherry",
                purchased: 0,
            },
        };
        this.fruits = {
            pear: 0,
            cherry: 0,
        };
        setInterval(() => {
            for (let bot in this.bots) {
                this.increment(
                    this.bots[bot].increment * this.bots[bot].purchased * this.multiplier
                );
            }
        }, 10000);

        setInterval(() => {
            for (let tree in this.trees) {
                if (this.trees[tree].purchased > 0) {
                    this.fruits[this.trees[tree].produce] += 1;
                }
            }
        }, 30000);
    }

    toJSON() {
        const json = Object.assign({}, this);
        delete json["bus"];
        return json;
    }

    static fromJson(json) {
        return Object.assign(new ClickerModal(), json);
    }

    get getMilestone() {
        return [
            { clicks: 1000, unlock: "clickbots" },
            { clicks: 5000, unlock: "bigbot" },
            { clicks: 10000, unlock: "power multiplier" },
            { clicks: 15000, unlock: "tree" },
        ];
    }

    increment(inc) {
        this.clicks += inc;
        if (this.getMilestone[this.level] && this.clicks >= this.getMilestone[this.level].clicks) {
            this.bus.trigger("MILESTONE", this.getMilestone[this.level]);
            this.level++;
        }
    }

    buyBot(botName) {
        console.log("buyBot", botName);
        if (Object.keys(this.bots).indexOf(botName) === -1) {
            throw new Error(`Bot ${botName} does not exist`);
        }
        if (this.clicks < this.bots[botName].price) {
            return false;
        }
        this.clicks -= this.bots[botName].price;
        this.bots[botName].purchased++;
    }

    hasBot() {
        return this.bots.clickbot.purchased > 0 || this.bots.bigbot.purchased > 0;
    }

    getMultiplierPrice() {
        return this.getMilestone[2].clicks;
    }

    buyMultiplier() {
        if (this.clicks < this.getMultiplierPrice()) {
            return false;
        }
        this.clicks -= this.getMultiplierPrice();
        this.multiplier++;
    }

    getReward() {
        console.log("getReward");
        const rewardsByLevel = rewards.filter((reward) => {
            if (reward.minLevel && this.level < reward.minLevel) {
                return false;
            }
            if (reward.maxLevel && this.level > reward.maxLevel) {
                return false;
            }
            return true;
        });
        console.log("rewardsByLevel", rewardsByLevel);

        const reward = choose(rewardsByLevel);
        console.log("reward", reward);
        this.bus.trigger("REWARD", reward);
        return reward;
    }

    buyTree(tree) {
        if (Object.keys(this.trees).indexOf(tree) === -1) {
            throw new Error(`Tree ${tree} does not exist`);
        }
        if (this.clicks < this.trees[tree].price) {
            return false;
        }
        this.clicks -= this.trees[tree].price;
        this.trees[tree].purchased++;
    }

    hasTree() {
        return this.trees.pearTree.purchased > 0 || this.trees.cherryTree.purchased > 0;
    }
}
