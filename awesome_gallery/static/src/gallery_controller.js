/** @odoo-module **/
import { Component, useState, onWillStart, onWillUpdateProps } from "@odoo/owl";
import { useService } from "@web/core/utils/hooks";
import { standardViewProps } from "@web/views/standard_view_props";
import { Layout } from "@web/search/layout";
import { GalleryRenderer } from "./gallery_renderer";
import { GalleryModel } from "./gallery_model";

export class GalleryController extends Component {
    static template = "awesome_gallery.GalleryController";
    static components = { Layout, GalleryRenderer };
    static props = { ...standardViewProps };

    setup() {
        this.orm = useService("orm");
        this.model = useState(new GalleryModel(this.orm, this.props.resModel, this.props.archInfo));
        onWillStart(async () => {
            await this.model.load(this.props.domain);
        });
        onWillUpdateProps(async (newProps) => {
            if (JSON.stringify(newProps.domain) !== JSON.stringify(this.props.domain)) {
                await this.model.load(newProps.domain);
            }
        });
    }
}
