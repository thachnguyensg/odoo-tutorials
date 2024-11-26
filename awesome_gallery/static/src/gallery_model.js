/** @odoo-module **/
import { KeepLast } from "@web/core/utils/concurrency";

export class GalleryModel {
    constructor(orm, resModel, fields, archInfo) {
        this.orm = orm;
        this.resModel = resModel;
        const { imageField, limit, tooltipField } = archInfo;
        this.imageField = imageField;
        this.limit = limit;
        this.tooltipField = tooltipField;
        this.fields = fields;
        this.keeplast = new KeepLast();
        this.records = [];
        this.pager = { offset: 0, limit: limit };
        this.recordsLength = 0;
    }

    async load(domain) {
        const { length, records } = await this.keeplast.add(
            this.orm.webSearchRead(this.resModel, domain, {
                limit: this.pager.limit,
                offset: this.pager.offset,
                specification: {
                    [this.imageField]: {},
                    ...(this.tooltipField ? { [this.tooltipField]: {} } : {}),
                    country_id: {
                        fields: { id: {}, name: {} },
                    },
                },
                context: {
                    bin_size: true,
                },
            })
        );
        this.recordsLength = length;
        console.log("records length", this.recordsLength);

        if (!this.fields[this.tooltipField]) {
            this.records = records;
            return;
        }

        switch (this.fields[this.tooltipField].type) {
            case "many2one":
                this.records = records.map((record) => ({
                    ...record,
                    [this.tooltipField]:
                        record[this.tooltipField]?.name || record[this.tooltipField],
                }));
                break;
            case "integer":
                this.records = records.map((record) => ({
                    ...record,
                    [this.tooltipField]: String(record[this.tooltipField]),
                }));
                break;
            default:
                this.records = records;
        }

        // this.records = records;
    }
}
