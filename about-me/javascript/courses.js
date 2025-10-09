/**
 * Parses a CSV string into an array of objects.
 * @param {string} csv - The CSV data as a string.
 * @returns {Array<Object>} An array of course objects.
 */
function parseCSV(csv) {
    const lines = csv.trim().split('\n');
    const headers = lines[0].split(',').map(header => header.trim());
    const data = [];

    for (let i = 1; i < lines.length; i++) {
        const line = lines[i];
        const values = [];
        let currentVal = '';
        let inQuotes = false;

        for (let char of line) {
            if (char === '"') { inQuotes = !inQuotes; } 
            else if (char === ',' && !inQuotes) {
                values.push(currentVal.trim());
                currentVal = '';
            } else { currentVal += char; }
        }
        values.push(currentVal.trim());

        const courseObject = {};
        headers.forEach((header, index) => {
            courseObject[header] = values[index] ? values[index].replace(/"/g, '') : '';
        });
        data.push(courseObject);
    }
    return data;
}

// --- Color generation for tags ---
const tagColors = {};
const colorPalette = [
    'bg-sky-900 text-sky-200', 'bg-green-900 text-green-200', 'bg-yellow-900 text-yellow-200',
    'bg-purple-900 text-purple-200', 'bg-pink-900 text-pink-200', 'bg-teal-900 text-teal-200',
    'bg-red-900 text-red-200', 'bg-indigo-900 text-indigo-200', 'bg-slate-700 text-slate-200'
];
let colorIndex = 0;

function getTagColor(subject) {
    if (!tagColors[subject]) {
        tagColors[subject] = colorPalette[colorIndex % colorPalette.length];
        colorIndex++;
    }
    return tagColors[subject];
}

document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('courses-container');
    const searchInput = document.getElementById('searchInput');
    const noResultsDiv = document.getElementById('no-results');
    const gridViewBtn = document.getElementById('gridViewBtn');
    const listViewBtn = document.getElementById('listViewBtn');

    let currentView = 'grid'; // 'grid' or 'list'
    let courses = []; // To be populated by fetch

    /**
     * Renders the course data as cards in the container based on the current view.
     * @param {Array<Object>} coursesToRender - The array of course objects to display.
     */
    function renderCourses(coursesToRender) {
        container.className = currentView === 'grid' 
            ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8' 
            : 'flex flex-col gap-4';

        container.innerHTML = ''; 
        noResultsDiv.classList.toggle('hidden', coursesToRender.length > 0);

        coursesToRender.forEach(course => {
            const card = document.createElement('div');
            
            let schoolClass = 'school-default';
            const schoolName = course.school.toLowerCase();
            if (schoolName.includes('florida state')) schoolClass = 'school-fsu';
            else if (schoolName.includes('delaware')) schoolClass = 'school-udel';
            else if (schoolName.includes('john hopkins')) schoolClass = 'school-jhu';
            else if (schoolName.includes('mit')) schoolClass = 'school-mit';
            else if (schoolName.includes('wharton')) schoolClass = 'school-wharton';


            const subjects = course.subject.split(',').map(s => s.trim());
            const subjectHtml = subjects.map(s => `
                <span class="inline-block text-xs font-semibold mr-2 mb-2 px-2.5 py-1 rounded-full ${getTagColor(s)}">
                    ${s}
                </span>`).join('');

            let modalityIcon;
            const modality = course.modality.toLowerCase();
            if (modality === 'in-progress') {
                modalityIcon = `<svg class="w-4 h-4 mr-1.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>`;
            } else if (modality === 'online') {
                modalityIcon = `<svg class="w-4 h-4 mr-1.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9V3m0 18a9 9 0 009-9m-9 9a9 9 0 00-9-9"></path></svg>`;
            }
            else {
                modalityIcon = `<svg class="w-4 h-4 mr-1.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path></svg>`;
            }
            
            const modalityFlag = `
                <div class="flex items-center text-sm text-slate-400">
                    ${modalityIcon}
                    ${course.modality}
                </div>`;

            let creditHtml = '';
            const forCreditStatus = course.forcredit.toLowerCase();
            if (forCreditStatus === 'yes') {
                creditHtml = `
                <div class="flex items-center text-sm text-green-400">
                     <svg class="w-4 h-4 mr-1.5" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path></svg>
                    For Credit
                </div>`;
            } else if (forCreditStatus === 'no') {
                creditHtml = `
                <div class="flex items-center text-sm text-red-400">
                     <svg class="w-4 h-4 mr-1.5" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"></path></svg>
                    No Credit
                </div>`;
            } else if (forCreditStatus === 'audit') {
                creditHtml = `
                <div class="flex items-center text-sm text-yellow-400">
                     <svg class="w-4 h-4 mr-1.5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 000 2h6a1 1 0 100-2H7z" clip-rule="evenodd"></path></svg>
                    Audited
                </div>`;
            }
            
            const linkButton = `
                <a href="${course.info}" target="_blank" rel="noopener noreferrer" class="p-2 rounded-full text-slate-400 hover:bg-slate-700 hover:text-white transition-colors" title="More Info">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path></svg>
                </a>`;

            if (currentView === 'grid') {
                card.className = `panel overflow-hidden flex flex-col transition-transform transform hover:-translate-y-1 ${schoolClass}`;
                card.style.borderTop = `5px solid var(--school-primary)`;
                card.innerHTML = `
                    <div class="p-6 flex-grow">
                        <h2 class="text-xl font-bold text-white mb-2">${course.course}</h2>
                        <p class="text-md font-semibold mb-4" style="color: var(--school-primary);">${course.school}</p>
                        <div class="flex flex-wrap mb-4">${subjectHtml}</div>
                        ${course.description ? `<p class="text-sm text-slate-400">${course.description}</p>` : ''}
                    </div>
                    <div class="px-6 py-4 bg-slate-800/50 border-t border-slate-700">
                        <div class="flex justify-between items-center">
                            <div class="flex items-center space-x-4">${modalityFlag}${creditHtml}</div>
                            ${linkButton}
                        </div>
                    </div>`;
            } else { // List View (Reformatted)
                card.className = `panel overflow-hidden flex flex-col sm:flex-row sm:items-center transition-shadow hover:shadow-xl ${schoolClass}`;
                card.style.borderLeft = `5px solid var(--school-primary)`;
                
                const descriptionHtml = course.description ? `<p class="text-sm text-slate-400 my-2">${course.description}</p>` : '';

                card.innerHTML = `
                    <div class="flex-grow p-5">
                        <div>
                            <h2 class="text-lg font-bold text-white">${course.course}</h2>
                            <p class="text-sm font-semibold" style="color: var(--school-primary);">${course.school}</p>
                        </div>
                        ${descriptionHtml}
                        <div class="flex flex-wrap mt-2">
                            ${subjectHtml}
                        </div>
                    </div>
                    <div class="flex-shrink-0 p-5 sm:border-l border-t sm:border-t-0 border-slate-700">
                        <div class="flex items-center justify-start sm:justify-center space-x-4">
                            ${modalityFlag}
                            ${creditHtml}
                            <div class="ml-2">${linkButton}</div>
                        </div>
                    </div>`;
            }
            container.appendChild(card);
        });
    }

    /**
     * Sets the current view and re-renders the courses.
     * @param {string} view - The view to set ('grid' or 'list').
     */
    function setView(view) {
        currentView = view;
        const isGrid = view === 'grid';
        
        // Grid button
        gridViewBtn.classList.toggle('bg-sky-600', isGrid);
        gridViewBtn.classList.toggle('text-white', isGrid);
        gridViewBtn.classList.toggle('bg-slate-700', !isGrid);
        gridViewBtn.classList.toggle('text-slate-200', !isGrid);
        
        // List button
        listViewBtn.classList.toggle('bg-sky-600', !isGrid);
        listViewBtn.classList.toggle('text-white', !isGrid);
        listViewBtn.classList.toggle('bg-slate-700', isGrid);
        listViewBtn.classList.toggle('text-slate-200', isGrid);
        
        handleSearch(); // Re-render with the new view
    }

    /**
     * Filters courses based on the search input and calls the render function.
     */
    function handleSearch() {
        const searchTerm = searchInput.value.toLowerCase();
        const filteredCourses = courses.filter(c => 
            c.course.toLowerCase().includes(searchTerm) ||
            c.subject.toLowerCase().includes(searchTerm) ||
            c.school.toLowerCase().includes(searchTerm)
        );
        renderCourses(filteredCourses);
    }
    
    fetch('../../data/Courses.csv')
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.text();
        })
        .then(csvData => {
            courses = parseCSV(csvData);
            courses.reverse();
            
            // --- Event Listeners ---
            searchInput.addEventListener('input', handleSearch);
            gridViewBtn.addEventListener('click', () => setView('grid'));
            listViewBtn.addEventListener('click', () => setView('list'));

            // Initial render
            renderCourses(courses);
        })
        .catch(error => {
            console.error('Error fetching or processing CSV data:', error);
            container.innerHTML = '<p class="text-center text-red-600 font-semibold">Error: Could not load course data. Please try again later.</p>';
        });
}); 