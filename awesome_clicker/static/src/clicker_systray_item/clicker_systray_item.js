/** @odoo-module **/
import { registry } from "@web/core/registry";
import { Component, useState, useExternalListener } from "@odoo/owl";
import { useService } from "@web/core/utils/hooks";
import { useClicker } from "../clicker_hook";
import { ClickerValue } from "../clicker_value/clicker_value";

class ClickerSystrayItem extends Component {
    static components = { ClickerValue };
    setup() {
        this.clicker = useClicker();
        this.action = useService("action");
        useExternalListener(document.body, "click", this.handleBodyClick, { capture: true });
    }

    increment(e) {
        e.stopPropagation();
        this.clicker.increment(1000);
    }

    handleBodyClick(event) {
        // Skip if click was on the button
        if (event.target.closest(".btn")) {
            return;
        }
        this.clicker.increment(10);
    }

    openClicker() {
        this.action.doAction({
            type: "ir.actions.client",
            tag: "awesome_clicker.ClickerClientAction",
            target: "new",
            name: "Clicker Game",
        });
    }
}

ClickerSystrayItem.template = "awesome_clicker.ClickerSystrayItem";
registry
    .category("systray")
    .add("awesome_clicker.ClickerSystrayItem", { Component: ClickerSystrayItem });
