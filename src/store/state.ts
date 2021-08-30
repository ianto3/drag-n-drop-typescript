import { Project, ProjectStatus } from '../models/project.js';

// Project state management class
type Listener<T>  = (items: T[]) => void; // void -> we don't care about any return

class State<T> {
    protected listeners: Listener<T>[] = [];

    addListener(listener: Listener<T>) {
        this.listeners.push(listener);
    }
}

export class ProjectStore extends State<Project>{
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
        this.updateListeners();
    }

    moveProject(projectId: string, newStatus: ProjectStatus) {
        const project = this.projects.find(project => project.id === projectId);
        if (project && project.status !== newStatus) {
            project.status = newStatus;
            this.updateListeners();
        }
    }

    private updateListeners() {
        for (const listener of this.listeners) {
            listener(this.projects.slice());
        }
    }
}

// Instace of ProjectStore
export const projectStore = ProjectStore.getInstance();