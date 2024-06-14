from odoo import models, fields, api


class ResUser(models.Model):
    _inherit = "res.users"

    property_ids = fields.One2many(
        "estate.property",
        "salesperson_id",
        string="Properties",
        domain=lambda self: [("salesperson_id", "=", self.id)],
    )
    # offer_ids = fields.One2many("estate.property.offer", "partner_id", string="Offers")
    # offer_count = fields.Integer(compute="_compute_offer_count", string="Offer count")

    # def _compute_offer_count(self):
    #     for record in self:
    #         record.offer_count = len(record.offer_ids)
