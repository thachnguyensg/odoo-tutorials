/** @odoo-module **/
import { Component, useState, onWillStart, onWillUpdateProps } from "@odoo/owl";
import { useService } from "@web/core/utils/hooks";
import { standardViewProps } from "@web/views/standard_view_props";
import { Layout } from "@web/search/layout";
import { usePager } from "@web/search/pager_hook";

export class GalleryController extends Component {
    static template = "awesome_gallery.GalleryController";
    static components = { Layout };
    static props = {
        ...standardViewProps,
        archInfo: Object,
        Model: Function,
        Renderer: Function,
    };

    setup() {
        this.orm = useService("orm");
        this.model = useState(
            new this.props.Model(
                this.orm,
                this.props.resModel,
                this.props.fields,
                this.props.archInfo
            )
        );
        usePager(() => {
            console.log("pager", this.model.pager);
            return {
                offset: this.model.pager.offset,
                limit: parseInt(this.model.pager.limit),
                total: this.model.recordsLength,
                onUpdate: async ({ offset, limit }) => {
                    console.log("onUpdate", offset, limit);
                    this.model.pager = { offset, limit };
                    await this.model.load(this.props.domain);
                },
            };
        });
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
