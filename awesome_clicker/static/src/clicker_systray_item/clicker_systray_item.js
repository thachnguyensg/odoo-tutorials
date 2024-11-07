/** @odoo-module **/
import { registry } from "@web/core/registry";
import { Component, useState, useExternalListener } from "@odoo/owl";

class ClickerSystrayItem extends Component {
    setup() {
        this.state = useState({ count: 0 });
        useExternalListener(document.body, "click", this.handleBodyClick, { capture: true });
    }

    increment(e) {
        e.stopPropagation();
        this.state.count += 10;
    }

    handleBodyClick(event) {
        // Skip if click was on the button
        if (event.target.closest(".btn")) {
            return;
        }

        this.state.count++;
    }
}

ClickerSystrayItem.template = "awesome_clicker.ClickerSystrayItem";
registry
    .category("systray")
    .add("awesome_clicker.ClickerSystrayItem", { Component: ClickerSystrayItem });
