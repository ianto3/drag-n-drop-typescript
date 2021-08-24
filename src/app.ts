// Project type class
enum ProjectStatus {Active, Finished}

class Project {
    constructor(
        public id: string,
        public title: string, 
        public description: string, 
        public people: number,
        public status: ProjectStatus) {}
}


// Project state management class
type Listener  = (items: Project[]) => void; // void -> we don't care about any return

class ProjectStore {
    // Array of listener function we call when we update states.
    private listeners: Listener[] = [];
    private projects: Project[] = [];
    private static instance: ProjectStore;

    private constructor() {

    }

    static getInstance() {
        if(this.instance) {
            return this.instance;
        };
        this.instance = new ProjectStore();
        return this.instance;
    }

    addListener(listener: Listener) {
        this.listeners.push(listener);
    }

    addProject(title: string, description: string, numOfPeople: number) {
        const newProject = new Project(
            Math.random().toString(),
            title,
            description,
            numOfPeople,
            ProjectStatus.Active // enum
        )
        this.projects.push(newProject);
        for (const listener of this.listeners) {
            // Use slice to send copy of the array and not the original.
            listener(this.projects.slice());
        }
    }
}

// Instace of ProjectStore
const projectStore = ProjectStore.getInstance();

// Input validation
interface Validatable {
    value: string | number;
    required?: boolean;
    minLength?: number;
    maxLength?: number;
    min?: number;
    max?: number;
}

function validate(validatableInput: Validatable) {
    let isValid = true;
    if (validatableInput.required) {
        isValid = isValid && validatableInput.value.toString().trim().length !== 0;
    }
    if (validatableInput.minLength != null && 
        typeof validatableInput.value === "string"){
        isValid = isValid && validatableInput.value.length > validatableInput.minLength;
    }
    if (validatableInput.maxLength != null && 
        typeof validatableInput.value === "string"){
        isValid = isValid && validatableInput.value.length < validatableInput.maxLength;
    }
    if (validatableInput.min != null && 
        typeof validatableInput.value === "number") {
            isValid = isValid && validatableInput.value > validatableInput.min;
    }
    if (validatableInput.max != null && 
        typeof validatableInput.value === "number") {
            isValid = isValid && validatableInput.value < validatableInput.max;
    }
    return isValid;
}

// Autobind decorator
function autobind(
    _: any, 
    _2: string, 
    descriptor: PropertyDescriptor
    ) {
 const originalMethod = descriptor.value;
 const adjDescriptor: PropertyDescriptor = {
     configurable: true,
     get(){
         const boundFn = originalMethod.bind(this);
         return boundFn;
     }
 }
 return adjDescriptor;
}

// ProjectList Class
class ProjectList {
    templateEl: HTMLTemplateElement;
    hostEl: HTMLDivElement;
    sectionEl: HTMLElement;
    assignedProjects: Project[];

    constructor(private type: "active" | "finished"){
        this.templateEl = document.getElementById("project-list")! as HTMLTemplateElement;
        this.hostEl = document.getElementById("app")! as HTMLDivElement;
        this.assignedProjects = [];

        // Selection for project list section
        const importedNode = document.importNode(this.templateEl.content, true);
        this.sectionEl = importedNode.firstElementChild! as HTMLElement;
        this.sectionEl.id = `${this.type}-projects`; // active-projects and finished-projects
        
        projectStore.addListener((projects: Project[]) => {
            this.assignedProjects = projects;
            this.renderProjects();
        })
        
        this.renderList();
        this.renderContent();
    }

    private renderProjects() {
        const listEl = document.getElementById(`${this.type}-projects-list`)! as HTMLUListElement;
        for (const projectItem of this.assignedProjects) {
            const listItem = document.createElement("li");
            listItem.textContent = projectItem.title;
            listEl.appendChild(listItem);
        }
    }

    private renderContent() {
        const listId = `${this.type}-projects-list`;
        this.sectionEl.querySelector("ul")!.id = listId;
        this.sectionEl.querySelector("h2")!.textContent = this.type.toUpperCase() + " PROJECTS";
    }

    // Render form
    private renderList(){
        this.hostEl.insertAdjacentElement("beforeend", this.sectionEl);
    }
}

// ProjectInputs Class (Form) 
class ProjectInputs {
    templateEl: HTMLTemplateElement;
    hostEl: HTMLDivElement;
    formEl: HTMLFormElement;
    titleInputEl: HTMLInputElement;
    descriptionInputEl: HTMLInputElement;
    peopleInputEl: HTMLInputElement;

    constructor() {
        // Add as HTMLTemplateElement to avoid missing content error.
        // Same for hostEl.
        this.templateEl = document.getElementById("project-input")! as HTMLTemplateElement;
        this.hostEl = document.getElementById("app")! as HTMLDivElement;

        // Selection for rendering form
        const importedNode = document.importNode(this.templateEl.content, true);
        this.formEl = importedNode.firstElementChild! as HTMLFormElement;
        this.formEl.id = "user-input"; // Add id for css styling

        // Access to inputs in form
        this.titleInputEl = this.formEl.querySelector("#title") as HTMLInputElement;
        this.descriptionInputEl = this.formEl.querySelector("#description") as HTMLInputElement;
        this.peopleInputEl = this.formEl.querySelector("#people") as HTMLInputElement;

        // Action to render form
        this.attachEventListener();
        this.renderForm();
    }

    private gatherInputData(): [string, string, number] | void {
        const enteredTitle = this.titleInputEl.value;
        const enteredDescription = this.descriptionInputEl.value;
        const enteredPeople = this.peopleInputEl.value;

        const titleValidatable: Validatable = {
            value: enteredTitle,
            required: true,
            minLength: 5
        };
        const descriptionValidatable: Validatable = {
            value: enteredDescription,
            required: true,
            minLength: 5
        };
        const peopleValidatable: Validatable = {
            value: +enteredPeople,
            required: true,
            min: 1,
            max: 5
        }

        if (!validate(titleValidatable) || 
        !validate(descriptionValidatable) || 
        !validate(peopleValidatable)) {
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

    @autobind
    private submitHandler(ev: Event){
        ev.preventDefault();
        const inputData = this.gatherInputData();
        if (Array.isArray(inputData)) {
            const [title, description, people] = inputData;
            projectStore.addProject(title, description, people);
            this.clearInputs();
        }
    }

    private attachEventListener() {
        // Bind this to the class and avoid it being the event in addEventListener.
        // Used autobind decorator instead of binding manually next.
        // this.formEl.addEventListener("submit", this.submitHandler.bind(this));
        this.formEl.addEventListener("submit", this.submitHandler);
    }

    // Render form
    private renderForm(){
        this.hostEl.insertAdjacentElement("afterbegin", this.formEl);
    }
}

// Invoke form
const invokedFormInput = new ProjectInputs();

// Instantiate lists
const activeList = new ProjectList("active");
const finishedList = new ProjectList("finished");