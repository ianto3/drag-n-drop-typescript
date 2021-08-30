import { ProjectInputs } from './components/project-input.js';
import { ProjectList } from './components/project-list.js';

// Invoke form
new ProjectInputs();

// Instantiate lists
new ProjectList('active');
new ProjectList('finished');
