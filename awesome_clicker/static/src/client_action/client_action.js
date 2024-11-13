/** @odoo-module **/
import { Component, useState } from "@odoo/owl";
import { registry } from "@web/core/registry";
import { useClicker } from "../clicker_hook";
import { Notebook } from "@web/core/notebook/notebook";
import { ClickerValue } from "../clicker_value/clicker_value";

export class ClickerClientAction extends Component {
    static components = { ClickerValue, Notebook };
    setup() {
        this.clicker = useClicker();
    }
}
ClickerClientAction.template = "awesome_clicker.ClickerClientAction";

registry.category("actions").add("awesome_clicker.ClickerClientAction", ClickerClientAction);
