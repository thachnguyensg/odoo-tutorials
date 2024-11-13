/** @odoo-module **/
import { FormController } from "@web/views/form/form_controller";
import { useClicker } from "../clicker_hook";
import { patch } from "@web/core/utils/patch";

const FormControllerPatch = {
    setup() {
        console.log("SHIT");
        super.setup(...arguments);
        const clicker = useClicker();
        clicker.getReward();
    },
};

patch(FormController.prototype, FormControllerPatch);
