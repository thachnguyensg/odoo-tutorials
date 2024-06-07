from odoo import models, fields


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
