/** @odoo-module **/

import { Component, useState, markup } from "@odoo/owl";
import { Counter } from "./counter/counter";
import { Card } from "./card/card";
import { TodoList } from "./todo_list/todo_list";

export class Playground extends Component {
    static template = "awesome_owl.playground";
    static components = { Counter, Card, TodoList };
    setup() {
        this.sum = useState({value: 0});
        this.cards= [{ title: "Card 1", content:"Content 1" },
             { title: "Card 2", content: markup("<span class='text-primary'>Content 2</span>")},];
    }
    onCounterChange = () => {
        this.sum.value ++;
    }
}
