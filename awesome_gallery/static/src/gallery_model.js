/** @odoo-module **/
import { KeepLast } from "@web/core/utils/concurrency";

export class GalleryModel {
    constructor(orm, resModel, archInfo) {
        this.orm = orm;
        this.resModel = resModel;
        const { imageField } = archInfo;
        this.imageField = imageField;
        this.keeplast = new KeepLast();
        this.records = [];
    }

    async load(domain) {
        const { records } = await this.keeplast.add(
            this.orm.webSearchRead(this.resModel, domain, {
                specification: {
                    [this.imageField]: {},
                },
                context: {
                    bin_size: true,
                },
            })
        );
        this.records = records;
    }
}
