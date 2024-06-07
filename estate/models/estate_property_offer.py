from odoo import models, fields, api
from dateutil.relativedelta import relativedelta
from datetime import datetime


class EstatePropertyOffer(models.Model):
    _name = "estate.property.offer"
    _description = "Real Estate Property Offer"
    _order = "price desc"
    _sql_constraints = [
        ("check_price", "CHECK(price > 0)", "The price must be strictly positive")
    ]

    price = fields.Float(required=True)
    status = fields.Selection(
        [("accepted", "Accepted"), ("refused", "Refused")], copy=False
    )
    partner_id = fields.Many2one("res.partner", required=True)
    property_id = fields.Many2one("estate.property", required=True)
    validity = fields.Integer(default=7, help="Offer validity in days")
    date_deadline = fields.Date(
        compute="_compute_deadline", inverse="_inverse_deadline", string="Deadline"
    )

    # Compute methods
    @api.depends("validity")
    def _compute_deadline(self):
        for record in self:
            if record.create_date:
                record.date_deadline = record.create_date + relativedelta(
                    days=record.validity
                )
            else:
                record.date_deadline = fields.Date.today() + relativedelta(
                    days=record.validity
                )

    def _inverse_deadline(self):
        for record in self:
            record.validity = (record.date_deadline - record.create_date.date()).days

    # Action methods
    def action_accept(self):
        print("action_accept", self)
        for record in self:
            record.status = "accepted"
            record.property_id.selling_price = record.price
            record.property_id.state = "offer_accepted"
            record.property_id.buyer_id = record.partner_id.id

    def action_refuse(self):
        for record in self:
            record.status = "refused"
            record.property_id.state = "new"
            record.property_id.selling_price = 0.0
            record.property_id.buyer_id = None
            record.property_id.state = "offer_received"
