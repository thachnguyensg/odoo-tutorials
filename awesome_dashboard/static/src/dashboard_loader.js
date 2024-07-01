/** @odoo-module **/

import { Component, xml } from "@odoo/owl";
import { LazyComponent } from "@web/core/assets";
import { registry } from "@web/core/registry";

class AwesomeDashboardLoader extends Component {
    static components = { LazyComponent };
    static template = xml`
    <LazyComponent bundle="'awesome_dashboard.dashboard'" Component="'AwesomeDashboard'" props="props"/>
    `;
}

registry.category("actions").add("awesome_dashboard.dashboard", AwesomeDashboardLoader);
