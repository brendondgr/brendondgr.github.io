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
            const element = document.getElementById(containerId);
            if (element) {
                element.innerHTML = data;
                if (callback) callback();
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

const tagColorClasses = {
    'python': 'bg-purple-900 text-purple-200',
    'scraping': 'bg-gray-700 text-gray-200',
    'js': 'bg-green-900 text-green-200',
    'tailwind': 'bg-sky-900 text-sky-200',
    'flask': 'bg-yellow-900 text-yellow-200',
    'django': 'bg-emerald-900 text-emerald-200',
    'llm': 'bg-indigo-900 text-indigo-200',
    'react': 'bg-blue-900 text-blue-200',
    'discord': 'bg-indigo-600 text-white',
};

function getTagsHTML(tagsString) {
    if (!tagsString) return '';
    return tagsString.split(',')
        .map(tag => tag.trim())
        .filter(tag => tag)
        .map(tag => {
            const tagLower = tag.toLowerCase();
            // Default to 'bg-slate-700' if not found, slightly customized from original
            const colorClass = tagColorClasses[Object.keys(tagColorClasses).find(k => k === tagLower) || ''] || 'bg-slate-700 text-slate-200 border border-slate-600';
            return `<span class="inline-block px-2.5 py-0.5 text-xs font-medium ${colorClass} rounded-full">${tag}</span>`;
        })
        .join(' ');
}

function createFeaturedCard(project) {
    const projectCard = document.createElement('article');
    projectCard.className = 'panel flex flex-col overflow-hidden transition-all duration-300 hover:shadow-2xl hover:shadow-sky-900/20 group';

    const tagsHTML = getTagsHTML(project.tags);

    const imageUrl = project.logo ? `../images/${project.logo}` : `https://placehold.co/600x400/1e293b/475569?text=${encodeURIComponent(project.title)}`;

    const isUpcoming = project.status === 'upcoming';
    const statusBadge = isUpcoming ? `<span class="bg-amber-600 text-white px-2 py-1 text-xs font-bold rounded-md uppercase tracking-wider mb-2 self-start">Upcoming</span>` : '';

    const viewProjectBtn = project.html && project.html !== '#'
        ? `<a href="../projects/${project.html}" class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-sky-600 hover:bg-sky-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500" title="View Project">
             View Project <i class="bi bi-box-arrow-up-right ml-2"></i>
           </a>`
        : `<button disabled class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-slate-400 bg-slate-800 cursor-not-allowed" title="Coming Soon">
             Coming Soon
           </button>`;

    const githubLink = project.github && project.github !== '#'
        ? `<a href="${project.github}" target="_blank" rel="noopener noreferrer" class="text-sm font-medium text-slate-400 hover:text-sky-400 transition-colors duration-200 flex items-center gap-2" title="View Source Code">
             <i class="bi bi-github"></i> Source
           </a>`
        : '';

    projectCard.innerHTML = `
        <div class="relative overflow-hidden h-48">
            <img class="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500" src="${imageUrl}" alt="${project.title}" onerror="this.onerror=null;this.src='https://placehold.co/600x400/1e293b/475569?text=Image+Not+Found';">
            <div class="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent"></div>
        </div>
        <div class="flex flex-col flex-grow">
            <div class="p-6 flex-grow flex flex-col">
                ${statusBadge}
                <div class="flex items-start justify-between gap-4 mb-2">
                    <h3 class="text-xl font-bold text-white group-hover:text-sky-400 transition-colors">${project.title}</h3>
                </div>
                <div class="flex flex-wrap gap-2 mb-4">
                    ${tagsHTML}
                </div>
                <p class="text-slate-400 text-sm leading-relaxed line-clamp-3">
                    ${project.description}
                </p>
            </div>
            <footer class="px-6 py-4 flex items-center justify-between border-t border-slate-700/50 bg-slate-800/30">
                ${githubLink}
                ${viewProjectBtn}
            </footer>
        </div>
    `;
    return projectCard;
}

function createProjectRow(project) {
    const row = document.createElement('article');
    // Row layout: Image (left) -> Content (middle) -> Actions (right)
    // Mobile: Stacked like a card
    row.className = 'panel flex flex-col md:flex-row overflow-hidden transition-all duration-300 hover:bg-slate-800/50 group items-stretch';

    const tagsHTML = getTagsHTML(project.tags);

    // Square image (w-32 h-32 is 8rem x 8rem = 128px)
    const imageUrl = project.logo ? `../images/${project.logo}` : `https://placehold.co/150x150/1e293b/475569?text=${encodeURIComponent(project.title.charAt(0))}`;

    const isUpcoming = project.status === 'upcoming';
    const statusBadge = isUpcoming ? `<span class="text-xs font-bold text-amber-500 uppercase tracking-wide border border-amber-500/30 px-2 py-0.5 rounded w-fit">Upcoming</span>` : '';

    // Buttons: Side by side again
    const githubLink = project.github && project.github !== '#'
        ? `<a href="${project.github}" target="_blank" rel="noopener noreferrer" class="flex items-center justify-center px-4 py-2 border border-slate-600 text-sm font-medium rounded-md text-slate-300 bg-transparent hover:bg-slate-700 hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500 whitespace-nowrap" title="View Source">
             <i class="bi bi-github mr-2"></i> GitHub
           </a>`
        : '';

    const viewProjectBtn = project.html && project.html !== '#'
        ? `<a href="../projects/${project.html}" class="flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-sky-600 hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 transition-colors whitespace-nowrap">
             View Project <i class="bi bi-arrow-right ml-2"></i>
           </a>`
        : `<span class="flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-slate-500 bg-slate-800 cursor-not-allowed whitespace-nowrap">Coming Soon</span>`;

    row.innerHTML = `
        <!-- Image / Icon -->
        <!-- Fixed square size on desktop (md:w-32 md:h-32), relative for overlay -->
        <div class="w-full md:w-32 md:h-32 h-48 relative flex-shrink-0 bg-slate-800 border-r border-slate-700/50">
             <img class="w-full h-full object-cover" src="${imageUrl}" alt="${project.title}" onerror="this.onerror=null;this.src='https://placehold.co/200x200/1e293b/475569?text=IMG';">
             <!-- Overlay: visible by default, fades out on group hover -->
             <div class="absolute inset-0 bg-black/50 transition-opacity duration-300 group-hover:opacity-0"></div>
        </div>

        <!-- Content -->
        <!-- Added self-center to align content vertically in the middle of the row if needed, or stick to top -->
        <div class="p-5 flex-grow flex flex-col justify-center">
            <div class="flex flex-col md:flex-row justify-between items-start gap-4 mb-2">
                <div class="flex flex-col gap-1">
                    <div class="flex items-center gap-2">
                        <!-- Larger title: text-xl -->
                        <h3 class="text-xl font-bold text-white group-hover:text-blue-400 transition-colors">${project.title}</h3>
                        ${statusBadge}
                    </div>
                </div>
                <!-- Tags justified right on same row as title -->
                <div class="flex flex-wrap gap-2 justify-end md:max-w-[50%]">
                    ${tagsHTML}
                </div>
            </div>

            <div class="flex flex-col md:flex-row gap-6 items-center">
                <p class="text-slate-400 text-sm leading-relaxed mb-3 md:mb-0 line-clamp-2 flex-grow">
                    ${project.description}
                </p>

                <!-- Actions Side-by-Side -->
                <div class="flex items-center gap-3 flex-shrink-0 w-full md:w-auto mt-2 md:mt-0 justify-end">
                    ${githubLink}
                    ${viewProjectBtn}
                </div>
            </div>
        </div>
    `;
    return row;
}

/**
 * Fetches project data from a CSV file and populates the projects sections.
 */
async function loadProjects() {
    try {
        const response = await fetch('../../data/Projects.csv');
        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }
        const csvData = await response.text();
        const projects = parseCSV(csvData);

        const featuredContainer = document.getElementById('featured-projects');
        const allProjectsContainer = document.getElementById('all-projects');

        if (!featuredContainer || !allProjectsContainer) {
            console.error('Project containers not found');
            return;
        }

        featuredContainer.innerHTML = '';
        allProjectsContainer.innerHTML = '';

        // Separate projects
        // Using string comparison for 'true' because CSV parser treats everything as strings unless converted
        const featuredProjects = projects.filter(p => p.featured && p.featured.toLowerCase().trim() === 'true');
        const normalProjects = projects.filter(p => !p.featured || p.featured.toLowerCase().trim() !== 'true');

        // Render Featured (Grid)
        featuredProjects.forEach(project => {
            if (!project.title) return;
            featuredContainer.appendChild(createFeaturedCard(project));
        });

        // Render All Projects (Rows)
        // You mentioned "All Projects at the bottom to be the rest", so we render the rest here
        // If you intended for "All Projects" to include featured ones too, we would iterate 'projects' instead of 'normalProjects'
        // But usually "Featured" pulls them out. I will assume "rest" based on "the rest at the bottom" phrasing.
        normalProjects.forEach(project => {
            if (!project.title) return;
            allProjectsContainer.appendChild(createProjectRow(project));
        });

    } catch (error) {
        console.error('Error loading projects:', error);
    }
}

document.addEventListener('DOMContentLoaded', function () {
    // The existing navbar loader (`navbar-loader.js`) handles this now.
    // This function can be simplified to just load projects.
    loadProjects();
}); 