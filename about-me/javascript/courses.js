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
    'bg-blue-100 text-blue-800', 'bg-green-100 text-green-800', 'bg-yellow-100 text-yellow-800',
    'bg-purple-100 text-purple-800', 'bg-pink-100 text-pink-800', 'bg-teal-100 text-teal-800',
    'bg-red-100 text-red-800', 'bg-indigo-100 text-indigo-800', 'bg-gray-200 text-gray-800'
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
            if (course.school.toLowerCase().includes('florida state')) schoolClass = 'school-fsu';
            else if (course.school.toLowerCase().includes('delaware')) schoolClass = 'school-udel';

            const subjects = course.subject.split(',').map(s => s.trim());
            const subjectHtml = subjects.map(s => `
                <span class="inline-block text-xs font-semibold mr-2 mb-2 px-2.5 py-1 rounded-full ${getTagColor(s)}">
                    ${s}
                </span>`).join('');

            const modalityFlag = `
                <div class="flex items-center text-sm text-gray-600">
                    <svg class="w-4 h-4 mr-1.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path></svg>
                    ${course.modality}
                </div>`;
            const creditFlag = `
                <div class="flex items-center text-sm ${course.forcredit.toLowerCase() === 'yes' ? 'text-green-600' : 'text-red-600'}">
                     <svg class="w-4 h-4 mr-1.5" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path></svg>
                    For Credit
                </div>`;
            
            const linkButton = `
                <a href="${course.info}" target="_blank" rel="noopener noreferrer" class="p-2 rounded-full text-gray-500 hover:bg-gray-200 hover:text-gray-800 transition-colors" title="More Info">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path></svg>
                </a>`;

            if (currentView === 'grid') {
                card.className = `bg-white rounded-lg shadow-lg overflow-hidden flex flex-col transition-transform transform hover:-translate-y-1 ${schoolClass}`;
                card.style.borderTop = `5px solid var(--school-primary)`;
                card.innerHTML = `
                    <div class="p-6 flex-grow">
                        <h2 class="text-xl font-bold text-gray-900 mb-2">${course.course}</h2>
                        <p class="text-md font-semibold mb-4" style="color: var(--school-primary);">${course.school}</p>
                        <div class="flex flex-wrap mb-4">${subjectHtml}</div>
                        ${course.description ? `<p class="text-sm text-gray-600">${course.description}</p>` : ''}
                    </div>
                    <div class="px-6 py-4 bg-gray-50 border-t border-gray-200">
                        <div class="flex justify-between items-center">
                            <div class="flex items-center space-x-4">${modalityFlag}${course.forcredit.toLowerCase() === 'yes' ? creditFlag : ''}</div>
                            ${linkButton}
                        </div>
                    </div>`;
            } else { // List View (Reformatted)
                card.className = `bg-white rounded-lg shadow-lg overflow-hidden flex flex-col sm:flex-row sm:items-center transition-shadow hover:shadow-xl ${schoolClass}`;
                card.style.borderLeft = `5px solid var(--school-primary)`;
                
                const descriptionHtml = course.description ? `<p class="text-sm text-gray-600 my-2">${course.description}</p>` : '';

                card.innerHTML = `
                    <div class="flex-grow p-5">
                        <div>
                            <h2 class="text-lg font-bold text-gray-900">${course.course}</h2>
                            <p class="text-sm font-semibold" style="color: var(--school-primary);">${course.school}</p>
                        </div>
                        ${descriptionHtml}
                        <div class="flex flex-wrap mt-2">
                            ${subjectHtml}
                        </div>
                    </div>
                    <div class="flex-shrink-0 p-5 sm:border-l border-t sm:border-t-0 border-gray-200">
                        <div class="flex items-center justify-start sm:justify-center space-x-4">
                            ${modalityFlag}
                            ${course.forcredit.toLowerCase() === 'yes' ? creditFlag : ''}
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
        
        gridViewBtn.classList.toggle('bg-indigo-600', isGrid);
        gridViewBtn.classList.toggle('text-white', isGrid);
        gridViewBtn.classList.toggle('bg-white', !isGrid);
        gridViewBtn.classList.toggle('text-gray-900', !isGrid);
        
        listViewBtn.classList.toggle('bg-indigo-600', !isGrid);
        listViewBtn.classList.toggle('text-white', !isGrid);
        listViewBtn.classList.toggle('bg-white', isGrid);
        listViewBtn.classList.toggle('text-gray-900', isGrid);
        
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