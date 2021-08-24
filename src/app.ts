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
type Listener<T>  = (items: T[]) => void; // void -> we don't care about any return

class State<T> {
    protected listeners: Listener<T>[] = [];

    addListener(listener: Listener<T>) {
        this.listeners.push(listener);
    }
}

class ProjectStore extends State<Project>{
    // Array of listener function we call when we update states.
    private projects: Project[] = [];
    private static instance: ProjectStore;

    private constructor() {
        super();
    }

    static getInstance() {
        if(this.instance) {
            return this.instance;
        };
        this.instance = new ProjectStore();
        return this.instance;
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

/*
* Component base class 
* Component with basic funcitonality to allow rendering on the screen
* abstract -> makes sure it can't be instantiated, it's just for inheritance
*/
 abstract class Component<T extends HTMLElement, U extends HTMLElement> {
    templateEl: HTMLTemplateElement;
    hostEl: T;
    element: U;

    constructor(
        templateId: string, 
        hostElementId: string,
        insertAtStart: boolean, 
        newElementId?: string
        ) {
        this.templateEl = document.getElementById(templateId)! as HTMLTemplateElement;
        this.hostEl = document.getElementById(hostElementId)! as T;

        const importedNode = document.importNode(this.templateEl.content, true);
        this.element = importedNode.firstElementChild! as U;
        if (newElementId){
            this.element.id = newElementId; // active-projects and finished-projects
        }

        this.render(insertAtStart);
    }

    private render(insertAtBeginning: boolean){
        this.hostEl.insertAdjacentElement(
            insertAtBeginning ? "afterbegin" : "beforeend", 
            this.element
            );
    }
    
    // abstract method -> content is missing and to be filled by descendent classes
    abstract configure(): void;
    abstract renderContent(): void;
}

// Project item class
class ProjectItem extends Component<HTMLUListElement, HTMLLIElement> {
    private project: Project;
    
    constructor (hostId: string, project: Project) {
        super("single-project", hostId, false, project.id);
        this.project = project;

        this.configure();
        this.renderContent();
    }

    configure() {}

    renderContent() {
        this.element.querySelector("h2")!.textContent = this.project.title;
        this.element.querySelector("h3")!.textContent = this.project.people.toString();
        this.element.querySelector("p")!.textContent = this.project.description;
    }

}

// ProjectList Class
class ProjectList extends Component<HTMLDivElement, HTMLElement> {
    assignedProjects: Project[];

    constructor(private type: "active" | "finished"){
        super("project-list", "app", false, `${type}-projects` );
        this.assignedProjects = [];
        this.element.id = `${this.type}-projects`; // active-projects and finished-projects

        this.configure();
        this.renderContent();
    }

    // As a convention public classes go before private ones
    configure() {
        projectStore.addListener((projects: Project[]) => {
            const relevantProjects = projects.filter(project => {
                if (this.type === "active"){
                    return project.status === ProjectStatus.Active;
                }
                return project.status === ProjectStatus.Finished;
            });
            this.assignedProjects = relevantProjects;
            this.renderProjects();
        })
    }

    renderContent() {
        const listId = `${this.type}-projects-list`;
        this.element.querySelector("ul")!.id = listId;
        this.element.querySelector("h2")!.textContent = this.type.toUpperCase() + " PROJECTS";
    }

    private renderProjects() {
        const listEl = document.getElementById(`${this.type}-projects-list`)! as HTMLUListElement;
        listEl.innerHTML = ""; // Clear previous content before rendering list
        for (const projectItem of this.assignedProjects) {
            new ProjectItem(this.element.querySelector("ul")!.id, projectItem);
        }
    }
}

// ProjectInputs Class (Form) 
class ProjectInputs extends Component<HTMLDivElement, HTMLFormElement> {
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
}

// Invoke form
const invokedFormInput = new ProjectInputs();

// Instantiate lists
const activeList = new ProjectList("active");
const finishedList = new ProjectList("finished");