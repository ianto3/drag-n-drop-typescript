import { DragTarget } from '../models/drag-n-drop';
import { Project, ProjectStatus } from '../models/project';
import Component from './base-component';
import { autobind } from '../decorators/autobind';
import { projectStore } from '../store/state';
import { ProjectItem } from './project-item';

// ProjectList Class
export class ProjectList extends Component<HTMLDivElement, HTMLElement> implements DragTarget{
    assignedProjects: Project[];

    constructor(private type: "active" | "finished"){
        super("project-list", "app", false, `${type}-projects` );
        this.assignedProjects = [];
        this.element.id = `${this.type}-projects`; // active-projects and finished-projects

        this.configure();
        this.renderContent();
    }

    @autobind
    dragOverHandler(event: DragEvent) {
        if (event.dataTransfer && event.dataTransfer.types[0] === "text/plain") {
            event.preventDefault(); 
            // The default is to not allow dropping.
            // For this element we allow it, it will fire the "drop" event (dropHandler)
            const listEl = this.element.querySelector("ul")!;
            listEl.classList.add("droppable");
        }
    }

    @autobind
    dropHandler(event: DragEvent) {
        const projectId = event.dataTransfer!.getData("text/plain");
        projectStore.moveProject(
            projectId, 
            this.type === "active" ? 
            ProjectStatus.Active : 
            ProjectStatus.Finished);
    }

    @autobind
    dragLeaveHandler(_: DragEvent) {
        const listEl = this.element.querySelector("ul")!;
        listEl.classList.remove("droppable");
    }

    // As a convention public classes go before private ones
    configure() {
        this.element.addEventListener("dragover", this.dragOverHandler);
        this.element.addEventListener("drop", this.dropHandler);
        this.element.addEventListener("dragleave", this.dragLeaveHandler);

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