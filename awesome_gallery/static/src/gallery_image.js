/** @odoo-module **/
import { Component } from "@odoo/owl";
import { GalleryModel } from "./gallery_model";
import { url } from "@web/core/utils/urls";
import { useService } from "@web/core/utils/hooks";

export class GalleryImage extends Component {
    static template = "awesome_gallery.GalleryImage";
    static props = {
        record: Object,
        model: GalleryModel,
    };

    setup() {
        this.action = useService("action");
    }

    get imageUrl() {
        const imagePath = url("/web/image", {
            id: this.props.record.id,
            model: this.props.model.resModel,
            field: this.props.model.imageField,
        });
        return imagePath;
    }

    onImageClick(resId) {
        debugger;
        this.action.switchView("form", { resId });
        // this.action.doAction({
        //     type: "ir.actions.act_window",
        //     res_model: this.props.model.resModel,
        //     res_id: this.props.record.id,
        //     views: [[false, "form"]],
        //     target: "current",
        // });
    }
}
