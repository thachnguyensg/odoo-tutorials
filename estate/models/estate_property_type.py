from odoo import models, fields


class EstatePropertyType(models.Model):
    _name = "estate.property.type"
    _description = "Real Estate Property Type"
    _sql_constraints = [
        ("unique_name", "UNIQUE(name)", "The property type must be unique")
    ]

    name = fields.Char(required=True)
    # property_ids = fields.One2many("estate.property", "property_type_id")
