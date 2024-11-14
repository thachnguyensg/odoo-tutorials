/** @odoo-module **/
import { registry } from "@web/core/registry";
import { ClickerModal } from "./clicker_modal";
import { browser } from "@web/core/browser/browser";
import { migrate } from "./clicker_migration";

const clickerState = {
    dependencies: ["action", "effect", "notification"],
    start(env, { action, effect, notification }) {
        const localStorageState = migrate(JSON.parse(browser.localStorage.getItem("clickerState")));
        const clickerModel = localStorageState
            ? ClickerModal.fromJson(localStorageState)
            : new ClickerModal();

        setInterval(() => {
            browser.localStorage.setItem("clickerState", JSON.stringify(clickerModel));
        }, 10000);

        console.log("clickerModel", clickerModel);
        const bus = clickerModel.bus;
        bus.addEventListener("MILESTONE", (ev) => {
            effect.add({
                type: "rainbow_man",
                message: `Milestone reached! You can now buy ${ev.detail.unlock}`,
            });
        });

        bus.addEventListener("REWARD", (ev) => {
            const reward = ev.detail;
            console.log("REWARD", reward);
            const closeNoti = notification.add(
                `Congrats you won a reward: "${reward.description}"`,
                {
                    type: "success",
                    sticky: true,
                    buttons: [
                        {
                            name: "Claim",
                            onClick: () => {
                                reward.apply(clickerModel);
                                closeNoti();
                                action.doAction({
                                    type: "ir.actions.client",
                                    tag: "awesome_clicker.ClickerClientAction",
                                    target: "new",
                                    name: "Clicker Game",
                                });
                            },
                        },
                    ],
                }
            );
        });

        return clickerModel;
    },
};

registry.category("services").add("awesome_clicker.clickerState", clickerState);
