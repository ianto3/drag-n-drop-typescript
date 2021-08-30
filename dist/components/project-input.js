var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import Cmp from './base-component.js';
import * as Validation from '../utils/validation.js';
import { autobind as Autobind } from '../decorators/autobind.js';
import { projectStore } from '../store/state.js';
export class ProjectInputs extends Cmp {
    constructor() {
        super("project-input", "app", true, "user-input");
        this.titleInputEl = this.element.querySelector("#title");
        this.descriptionInputEl = this.element.querySelector("#description");
        this.peopleInputEl = this.element.querySelector("#people");
        this.configure();
    }
    configure() {
        this.element.addEventListener("submit", this.submitHandler);
    }
    renderContent() { }
    gatherInputData() {
        const enteredTitle = this.titleInputEl.value;
        const enteredDescription = this.descriptionInputEl.value;
        const enteredPeople = this.peopleInputEl.value;
        const titleValidatable = {
            value: enteredTitle,
            required: true,
            minLength: 5
        };
        const descriptionValidatable = {
            value: enteredDescription,
            required: true,
            minLength: 5
        };
        const peopleValidatable = {
            value: +enteredPeople,
            required: true,
            min: 1,
            max: 5
        };
        if (!Validation.validate(titleValidatable) ||
            !Validation.validate(descriptionValidatable) ||
            !Validation.validate(peopleValidatable)) {
            alert("Invalid input, try again!");
            return;
        }
        else {
            return [enteredTitle, enteredDescription, +enteredPeople];
        }
    }
    clearInputs() {
        this.titleInputEl.value = "";
        this.descriptionInputEl.value = "";
        this.peopleInputEl.value = "";
    }
    submitHandler(ev) {
        ev.preventDefault();
        const inputData = this.gatherInputData();
        if (Array.isArray(inputData)) {
            const [title, description, people] = inputData;
            projectStore.addProject(title, description, people);
            this.clearInputs();
        }
    }
}
__decorate([
    Autobind
], ProjectInputs.prototype, "submitHandler", null);
//# sourceMappingURL=project-input.js.map