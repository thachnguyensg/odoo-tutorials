/** @odoo-module **/
import { Component, useState, onWillStart, onWillUpdateProps } from "@odoo/owl";
import { useService } from "@web/core/utils/hooks";
import { standardViewProps } from "@web/views/standard_view_props";
import { Layout } from "@web/search/layout";

export class GalleryController extends Component {
    static template = "awesome_gallery.GalleryController";
    static components = { Layout };
    static props = { ...standardViewProps };

    setup() {
        this.orm = useService("orm");
        this.images = useState({ data: [] });
        onWillStart(async () => {
            const { records } = await this.loadImages(this.props.domain);
            console.log("records", records);
            this.images.data = records || [];
        });
        onWillUpdateProps(async (newProps) => {
            if (JSON.stringify(newProps.domain) !== JSON.stringify(this.props.domain)) {
                const { records } = await this.loadImages(newProps.domain);
                this.images.data = records;
            }
        });
    }

    loadImages(domain) {
        //async function to load images
        return this.orm.webSearchRead(this.props.resModel, domain, {
            specification: {
                [this.props.archInfo.imageField]: {},
            },
            context: {
                bin_size: true,
            },
        });
    }
}
