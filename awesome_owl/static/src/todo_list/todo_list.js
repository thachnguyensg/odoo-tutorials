/** @odoo-module **/

import { Component, useState, useRef, onMounted } from "@odoo/owl";
import { TodoItem } from "./todo_item";

export class TodoList extends Component {
    static template = "awesome_owl.todo_list";
    static components = { TodoItem };

    setup() {
        this.todoInputRef = useRef("todoInput");
        this.todos = useState([]);
        onMounted(() => {
            this.todoInputRef.el.focus();
        });
    }
    addTodo(e){
        if (e.key === "Enter" && e.target.value !=""){
            this.todos.push({id: this.todos.length + 1, description: e.target.value, isCompleted: false});
            e.target.value = "";
        }
    }
    removeTodo = (id) => {
        const index = this.todos.findIndex(todo => todo.id === id);
        if (index >= 0) {
            this.todos.splice(index, 1);
        }
    }
    toggleTodoStatus = (id) =>{
        const todo = this.todos.find(todo => todo.id === id);
        todo.isCompleted = !todo.isCompleted;
    }
}