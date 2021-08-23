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

    @autobind
    private submitHandler(ev: Event){
        ev.preventDefault();
        console.log(this.titleInputEl.value);
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