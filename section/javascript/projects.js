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
            projectCard.className = 'bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 group';

            const tagsHTML = project.tags.split(',')
                .map(tag => tag.trim())
                .filter(tag => tag)
                .map(tag => {
                    const tagLower = tag.toLowerCase();
                    const colorClass = tagColorClasses[tagLower] || 'bg-slate-100 text-slate-800';
                    return `<span class="inline-block px-2 py-1 text-xs font-semibold ${colorClass} rounded-full">${tag}</span>`;
                })
                .join(' ');

            const imageUrl = project.logo ? `../images/${project.logo}` : `https://placehold.co/600x400/334155/FFFFFF?text=${encodeURIComponent(project.title)}`;

            projectCard.innerHTML = `
                <img class="w-full h-48 object-cover" src="${imageUrl}" alt="${project.title} project image" onerror="this.onerror=null;this.src='https://placehold.co/600x400/e2e8f0/475569?text=Image+Not+Found';">
                <div class="h-[300px] flex flex-col">
                    <div class="p-6 flex-grow overflow-hidden">
                        <div class="flex items-center justify-between">
                            <h3 class="text-xl font-semibold text-slate-900">${project.title}</h3>
                            <div class="flex flex-wrap gap-2 justify-end flex-shrink-0 ml-4">
                                ${tagsHTML}
                            </div>
                        </div>
                        <p class="mt-3 text-slate-600 text-sm leading-relaxed">
                            ${project.description}
                        </p>
                    </div>
                    <footer class="bg-slate-50 px-6 py-4 flex items-center justify-end space-x-4">
                        <a href="${project.github}" target="_blank" rel="noopener noreferrer" class="text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors duration-200" title="View Source Code">
                            <i class="bi bi-github"></i> Source Code
                        </a>
                        <a href="../projects/${project.html}" class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500" title="View Project">
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
    'python': 'bg-purple-100 text-purple-800',
    'scraping': 'bg-gray-100 text-gray-800',
    'js': 'bg-green-100 text-green-800',
    'tailwind': 'bg-sky-100 text-sky-800',
    'flask': 'bg-yellow-100 text-yellow-800',
};

document.addEventListener('DOMContentLoaded', function() {
    loadHTML('navbar-container', 'navbar.html', () => {
        // Mobile menu toggler
        const navbarToggler = document.getElementById('navbar-toggler');
        const navbarCollapse = document.getElementById('navbarCollapse');

        if (navbarToggler && navbarCollapse) {
            navbarToggler.addEventListener('click', function() {
                navbarCollapse.classList.toggle('hidden');
            });
        }

        // Set active nav link
        const currentPath = window.location.pathname;
        const navLinks = document.querySelectorAll('.nav-item, .mobile-nav-item');

        navLinks.forEach(link => {
            const linkPath = link.getAttribute('href');
            // Normalize paths to remove trailing slashes for comparison
            const normalizedCurrentPath = currentPath.endsWith('/') ? currentPath.slice(0, -1) : currentPath;
            const normalizedLinkPath = linkPath.endsWith('/') ? linkPath.slice(0, -1) : linkPath;

            // Handle root path case (e.g., / or /index.html)
            if ((normalizedCurrentPath === '' || normalizedCurrentPath === '/index.html') && (normalizedLinkPath === '/index.html' || normalizedLinkPath === '')) {
                link.classList.add('active');
            } else if (normalizedLinkPath !== '' && normalizedCurrentPath.endsWith(normalizedLinkPath)) {
                link.classList.add('active');
            }
        });
    });

    loadProjects();
}); 