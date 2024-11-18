/** @odoo-module **/
import { Component } from "@odoo/owl";
import { GalleryModel } from "./gallery_model";
import { url } from "@web/core/utils/urls";

export class GalleryImage extends Component {
    static template = "awesome_gallery.GalleryImage";
    static props = {
        record: Object,
        model: GalleryModel,
    };

    get imageUrl() {
        const imagePath = url("/web/image", {
            id: this.props.record.id,
            model: this.props.model.resModel,
            field: this.props.model.imageField,
        });
        return imagePath;
    }
}
