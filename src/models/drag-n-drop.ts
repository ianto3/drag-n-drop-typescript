// Drag-n-drop interfaces
// Will require us to implement certain methods in class with these interfaces.
export interface Draggable {
    dragStartHandler(event: DragEvent): void;
    dragEndHandler(event: DragEvent): void;
}

export interface DragTarget{
    // Permit the drop
    dragOverHandler(event: DragEvent): void;
    // Handle the drop
    dropHandler(event: DragEvent): void;
    // Useful for visual feedback
    dragLeaveHandler(event: DragEvent): void;
}