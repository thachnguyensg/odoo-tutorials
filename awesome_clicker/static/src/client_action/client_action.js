/** @odoo-module **/
import { Component, useState } from "@odoo/owl";
import { registry } from "@web/core/registry";
import { useService } from "@web/core/utils/hooks";
import { useClicker } from "../clicker_hook";

export class ClickerClientAction extends Component {
    setup() {
        this.clicker = useClicker();
    }
}
ClickerClientAction.template = "awesome_clicker.ClickerClientAction";

registry.category("actions").add("awesome_clicker.ClickerClientAction", ClickerClientAction);
