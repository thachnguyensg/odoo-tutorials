from odoo import models, fields, api, Command


class EstateProperty(models.Model):
    _inherit = "estate.property"

    def action_sold(self):
        self.env["account.journal"].check_access_rights("read")
        journal = self.env["account.journal"].sudo().search([("type", "=", "sale")], limit=1)
        # Another way to get the journal:
        # journal = self.env["account.move"].with_context(default_move_type="out_invoice")._get_default_journal()
        # print(" reached ".center(100, '='))
        self.env["account.move"].check_access_rights("create")
        self.env["account.move"].check_access_rules("create")
        self.env["account.move"].sudo().create(
            {
                "move_type": "out_invoice",
                "partner_id": self.buyer_id.id,
                "journal_id": journal.id,
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
