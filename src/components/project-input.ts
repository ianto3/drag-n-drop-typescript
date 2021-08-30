import Cmp from './base-component.js';
import * as Validation from '../utils/validation.js';
import { autobind as Autobind } from '../decorators/autobind.js';
import { projectStore } from '../store/state.js';

// ProjectInputs Class (Form) 
export class ProjectInputs extends Cmp<HTMLDivElement, HTMLFormElement> {
    titleInputEl: HTMLInputElement;
    descriptionInputEl: HTMLInputElement;
    peopleInputEl: HTMLInputElement;

    constructor() {
        super("project-input", "app", true, "user-input");
        // Access to inputs in form
        this.titleInputEl = this.element.querySelector("#title") as HTMLInputElement;
        this.descriptionInputEl = this.element.querySelector("#description") as HTMLInputElement;
        this.peopleInputEl = this.element.querySelector("#people") as HTMLInputElement;

        // addEventListener
        this.configure();
    }

    configure() {
        // Bind this to the class and avoid it being the event in addEventListener.
        // Used autobind decorator instead of binding manually next.
        // this.element.addEventListener("submit", this.submitHandler.bind(this));
        this.element.addEventListener("submit", this.submitHandler);
    }
    
    // Required by parent class
    renderContent() {}

    private gatherInputData(): [string, string, number] | void {
        const enteredTitle = this.titleInputEl.value;
        const enteredDescription = this.descriptionInputEl.value;
        const enteredPeople = this.peopleInputEl.value;

        const titleValidatable: Validation.Validatable = {
            value: enteredTitle,
            required: true,
            minLength: 5
        };
        const descriptionValidatable: Validation.Validatable = {
            value: enteredDescription,
            required: true,
            minLength: 5
        };
        const peopleValidatable: Validation.Validatable = {
            value: +enteredPeople,
            required: true,
            min: 1,
            max: 5
        }

        if (!Validation.validate(titleValidatable) || 
        !Validation.validate(descriptionValidatable) || 
        !Validation.validate(peopleValidatable)) {
            alert("Invalid input, try again!");
            return;
        } else {
            return [enteredTitle, enteredDescription, +enteredPeople];
        }
    }

    private clearInputs() {
        this.titleInputEl.value = "";
        this.descriptionInputEl.value = "";
        this.peopleInputEl.value = "";

    }

    @Autobind
    private submitHandler(ev: Event){
        ev.preventDefault();
        const inputData = this.gatherInputData();
        if (Array.isArray(inputData)) {
            const [title, description, people] = inputData;
            projectStore.addProject(title, description, people);
            this.clearInputs();
        }
    }
}
