import { ProjectInputs } from './components/project-input';
import { ProjectList } from './components/project-list';

// Invoke form
new ProjectInputs();

// Instantiate lists
new ProjectList('active');
new ProjectList('finished');
