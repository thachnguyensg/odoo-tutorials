/** @odoo-module **/

import { Component } from "@odoo/owl";
import { useClicker } from "../clicker_hook";
import { humanNumber } from "../utils";

export class ClickerValue extends Component {
    setup() {
        this.clicker = useClicker();
    }
    get humanValue() {
        return humanNumber(this.clicker.clicks, { decimals: 1 });
    }
}

ClickerValue.template = "awesome_clicker.ClickerValue";
