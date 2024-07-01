/** @odoo-module */

import { registry } from "@web/core/registry";
import { reactive } from "@odoo/owl";

const statisticsService = {
    dependencies: ["rpc"],
    start(env, { rpc }) {
        const statistic = reactive({ isReady: false });
        async function loadData() {
            const upd = await rpc("/awesome_dashboard/statistics");
            Object.assign(statistic, upd, { isReady: true });
        }
        setInterval(loadData, 10000);
        return statistic;
    },
};

registry.category("services").add("awesome_dashboard.statistics", statisticsService);
