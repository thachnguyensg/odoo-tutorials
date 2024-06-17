/** @odoo-module **/

import { Component, useState } from "@odoo/owl";

export class TodoItem extends Component {
    static template = "awesome_owl.todo_list.todo_item";
    static props = {
        todo: { type: Object, shape: { id: Number, description: String, isCompleted: Boolean }},
        toggle: { type: Function },
        remove: { type: Function },
    }
}