// Function to load HTML content into a container
function loadHTML(containerId, filePath, callback) {
    fetch(filePath)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }
            return response.text();
        })
        .then(data => {
            document.getElementById(containerId).innerHTML = data;
            if (callback) {
                callback();
            }
        })
        .catch(error => console.error('Error loading HTML:', error));
}

/**
 * Parses a CSV string into an array of objects.
 * @param {string} csvText The CSV string to parse.
 * @returns {Array<Object>} An array of objects representing the rows.
 */
function parseCSV(csvText) {
    const lines = csvText.trim().split('\n');
    const header = lines.shift().split(',').map(h => h.trim());

    return lines.map(line => {
        if (line.trim() === '') return null;

        const values = line.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/)
                         .map(value => {
                             let val = value.trim();
                             if (val.startsWith('"') && val.endsWith('"')) {
                                 val = val.slice(1, -1);
                             }
                             return val.replace(/""/g, '"');
                         });

        if (values.length !== header.length) {
            console.warn(`CSV row has incorrect number of columns. Expected ${header.length}, got ${values.length}. Row: ${line}`);
            return null;
        }

        const project = {};
        header.forEach((key, index) => {
            project[key] = values[index] || '';
        });
        return project;
    }).filter(p => p !== null);
}

/**
 * Fetches project data from a CSV file and populates the projects grid.
 */
async function loadProjects() {
    try {
        const response = await fetch('../../data/Projects.csv');
        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }
        const csvData = await response.text();
        const projects = parseCSV(csvData);
        const container = document.getElementById('projects-grid');

        if (!container) {
            console.error('Projects grid container not found');
            return;
        }

        container.innerHTML = ''; // Clear placeholder content

        projects.reverse().forEach(project => {
            if (!project.title) return; // Skip empty rows

            const projectCard = document.createElement('article');
            projectCard.className = 'panel flex flex-col overflow-hidden transition-transform duration-300 transform hover:-translate-y-2';

            const tagsHTML = project.tags.split(',')
                .map(tag => tag.trim())
                .filter(tag => tag)
                .map(tag => {
                    const tagLower = tag.toLowerCase();
                    const colorClass = tagColorClasses[tagLower] || 'bg-gray-700 text-gray-200';
                    return `<span class="inline-block px-2 py-1 text-xs font-semibold ${colorClass} rounded-full">${tag}</span>`;
                })
                .join(' ');

            const imageUrl = project.logo ? `../images/${project.logo}` : `https://placehold.co/600x400/334155/FFFFFF?text=${encodeURIComponent(project.title)}`;

            const isUpcoming = project.status === 'upcoming';
            const statusBadge = isUpcoming ? `<span class="bg-amber-600 text-white px-2 py-1 text-xs font-bold rounded-md uppercase tracking-wider mb-2 self-start">Upcoming</span>` : '';

            projectCard.innerHTML = `
                <img class="w-full h-48 object-cover" src="${imageUrl}" alt="${project.title} project image" onerror="this.onerror=null;this.src='https://placehold.co/600x400/e2e8f0/475569?text=Image+Not+Found';">
                <div class="flex flex-col flex-grow">
                    <div class="p-6 flex-grow flex flex-col">
                        ${statusBadge}
                        <div class="flex items-center justify-between">
                            <h3 class="text-xl font-semibold text-white">${project.title}</h3>
                            <div class="flex flex-wrap gap-2 justify-end flex-shrink-0 ml-4">
                                ${tagsHTML}
                            </div>
                        </div>
                        <p class="mt-3 text-slate-400 text-sm leading-relaxed">
                            ${project.description}
                        </p>
                    </div>
                    <footer class="px-6 py-4 flex items-center justify-end space-x-4 border-t border-slate-700">
                        <a href="${project.github}" target="_blank" rel="noopener noreferrer" class="text-sm font-medium text-slate-300 hover:text-sky-400 transition-colors duration-200" title="View Source Code">
                            <i class="bi bi-github"></i> Source Code
                        </a>
                        <a href="../projects/${project.html}" class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-sky-600 hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500" title="View Project">
                            View Project <i class="bi bi-box-arrow-up-right ml-2"></i>
                        </a>
                    </footer>
                </div>
            `;
            container.appendChild(projectCard);
        });
    } catch (error) {
        console.error('Error loading projects:', error);
    }
}

const tagColorClasses = {
    'python': 'bg-purple-900 text-purple-200',
    'scraping': 'bg-gray-700 text-gray-200',
    'js': 'bg-green-900 text-green-200',
    'tailwind': 'bg-sky-900 text-sky-200',
    'flask': 'bg-yellow-900 text-yellow-200',
};

document.addEventListener('DOMContentLoaded', function() {
    // The existing navbar loader (`navbar-loader.js`) handles this now.
    // This function can be simplified to just load projects.
    loadProjects();
}); 