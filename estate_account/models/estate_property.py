from odoo import models, fields, api, Command


class EstateProperty(models.Model):
    _inherit = "estate.property"

    def action_sold(self):
        print("I'm overriding the action_sold method")
        print("partner_id", self.buyer_id)
        self.env["account.move"].create(
            {
                "move_type": "out_invoice",
                "partner_id": self.buyer_id.id,
                "invoice_line_ids": [
                    Command.create(
                        {
                            "name": self.name,
                            "quantity": 1,
                            "price_unit": self.selling_price,
                        }
                    ),
                    Command.create(
                        {
                            "name": "Notary fees",
                            "quantity": 1,
                            "price_unit": self.selling_price * 0.06,
                        }
                    ),
                    Command.create(
                        {
                            "name": "Administrative fees",
                            "quantity": 1,
                            "price_unit": 100.00,
                        }
                    ),
                ],
            }
        )
        return super().action_sold()
