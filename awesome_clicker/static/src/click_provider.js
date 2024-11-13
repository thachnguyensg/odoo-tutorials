/** @odoo-module **/
import { registry } from "@web/core/registry";

const clickProvider = registry.category("command_provider");
clickProvider.add("clicker", {
    provide: (env, options) => {
        return [
            {
                name: "Buy 1 click bot",
                action() {
                    env.services["awesome_clicker.clickerState"].buyBot("clickbot");
                },
            },
            {
                name: "Open Clicker Game",
                action() {
                    env.services.action.doAction({
                        type: "ir.actions.client",
                        tag: "awesome_clicker.ClickerClientAction",
                        target: "new",
                        name: "Clicker Game",
                    });
                },
            },
        ];
    },
});
