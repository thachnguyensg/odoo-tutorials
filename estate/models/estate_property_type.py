from odoo import models, fields, api


class EstatePropertyType(models.Model):
    _name = "estate.property.type"
    _description = "Real Estate Property Type"
    _order = "sequence, name"
    _sql_constraints = [
        ("unique_name", "UNIQUE(name)", "The property type must be unique")
    ]

    name = fields.Char(required=True)
    sequence = fields.Integer(
        "Sequence", default=1, help="Used to order types. Lower is better."
    )
    property_ids = fields.One2many("estate.property", "property_type_id")
    offer_ids = fields.One2many("estate.property.offer", "property_type_id")
    offer_count = fields.Integer(compute="_compute_offer_count", string="Offer Count")

    # Compute methods
    @api.depends("offer_ids")
    def _compute_offer_count(self):
        for record in self:
            record.offer_count = len(record.offer_ids)
