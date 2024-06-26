{
    "name": "Real Estate",
    "category": "Real Estate/Brokerage",
    "depends": ["base"],
    "data": [
        "data/estate.property.type.csv",
        "security/security.xml",
        "security/ir.model.access.csv",
        "views/estate_property_views.xml",
        "views/estate_property_type_view.xml",
        "views/estate_property_tag_view.xml",
        "views/estate_menus.xml",
        "views/res_users_view.xml",
    ],
    "demo": [
        "demo/estate_property.xml",
        "demo/estate_property_tag.xml",
        "demo/estate_property_offer.xml",
    ],
    "application": True,
}
