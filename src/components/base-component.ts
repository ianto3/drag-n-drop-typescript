/*
* Component base class 
* Component with basic funcitonality to allow rendering on the screen
* abstract -> makes sure it can't be instantiated, it's just for inheritance
*/

export default abstract class Component<T extends HTMLElement, U extends HTMLElement> {
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