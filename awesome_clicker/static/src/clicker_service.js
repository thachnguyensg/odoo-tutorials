/** @odoo-module **/
import { registry } from "@web/core/registry";
import { reactive } from "@odoo/owl";

const clickerState = {
    start(env) {
        const state = reactive({ count: 0 });

        return {
            state,
            increment(inc) {
                state.count += inc;
            },
        };
    },
};

registry.category("services").add("awesome_clicker.clickerState", clickerState);
