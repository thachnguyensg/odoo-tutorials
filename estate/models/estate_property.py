from odoo import fields, models, api, _
from dateutil.relativedelta import relativedelta
from odoo.exceptions import UserError, ValidationError
from odoo.tools.float_utils import float_compare, float_is_zero


class EstateProperty(models.Model):
    _name = "estate.property"
    _description = "Real Estate Property"
    _order = "id desc"
    _sql_constraints = [
        (
            "check_expected_price",
            "CHECK(expected_price > 0)",
            "The expected price must be strictly positive",
        ),
        (
            "check_selling_price",
            "CHECK(selling_price >= 0)",
            "The selling price must be positive",
        ),
    ]

    def _default_availability(self):
        return fields.Date.today() + relativedelta(months=3)

    name = fields.Char(required=True)
    company_id = fields.Many2one('res.company', required=True, default=lambda self: self.env.user.company_id)
    description = fields.Text()
    postcode = fields.Char()
    date_availability = fields.Date(copy=False, default=_default_availability)
    expected_price = fields.Float(required=True)
    selling_price = fields.Float(copy=False, readonly=True)
    bedrooms = fields.Integer(default=2)
    living_area = fields.Integer()
    facades = fields.Integer()
    garage = fields.Boolean()
    garden = fields.Boolean()
    garden_area = fields.Integer()
    garden_orientation = fields.Selection(
        [("north", "North"), ("south", "South"), ("east", "East"), ("west", "West")]
    )
    active = fields.Boolean(default=True)
    state = fields.Selection(
        [
            ("new", "New"),
            ("offer_received", "Offer Received"),
            ("offer_accepted", "Offer Accepted"),
            ("sold", "Sold"),
            ("cancelled", "Cancelled"),
        ],
        default="new",
    )
    property_type_id = fields.Many2one("estate.property.type", string="Property Type")
    salesperson_id = fields.Many2one(
        "res.users", string="Salesperson", default=lambda self: self.env.user
    )
    buyer_id = fields.Many2one("res.partner", string="Buyer", copy=False)
    tag_ids = fields.Many2many("estate.property.tag", string="Tags")
    offer_ids = fields.One2many("estate.property.offer", "property_id")
    total_area = fields.Integer(compute="_compute_total_area")
    best_price = fields.Float(compute="_best_offer", string="Best Offer")

    # Compute methods
    @api.depends("living_area", "garden_area")
    def _compute_total_area(self):
        for record in self:
            record.total_area = record.living_area + record.garden_area

    @api.depends("offer_ids.price")
    def _best_offer(self):
        for property in self:
            if property.offer_ids:
                property.best_price = max(property.offer_ids.mapped("price"))
            else:
                property.best_price = 0.0

    @api.onchange("garden")
    def _onchange_garger(self):
        if self.garden:
            self.garden_area = 10
            self.garden_orientation = "north"
        else:
            self.garden_area = 0
            self.garden_orientation = None

    # Action methods
    def action_sold(self):
        if self.state == "cancelled":
            raise UserError(_("You cannot sell a cancelled property."))
        self.state = "sold"

    def action_cancel(self):
        if self.state == "sold":
            raise UserError(_("You cannot cancel a sold property."))
        self.state = "cancelled"

    # Constraint methods
    @api.constrains("selling_price")
    def _check_selling_price(self):
        for record in self:
            if not float_is_zero(record.selling_price, precision_digits=2):
                expected_price = record.expected_price * 0.9
                if (
                    float_compare(
                        record.selling_price, expected_price, precision_digits=2
                    )
                    == -1
                ):
                    raise ValidationError(
                        _(
                            "The selling price cannot be less than 90% of the expected price"
                        )
                    )

    # Validation methods
    @api.ondelete(at_uninstall=False)
    def _unlink_if_new_or_cancelled(self):
        for record in self:
            if record.state not in ("new", "cancelled"):
                raise UserError(
                    _("You cannot delete a property that is not new or cancelled.")
                )
