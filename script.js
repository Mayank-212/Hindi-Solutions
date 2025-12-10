// ===================================
// NCERT Solutions App - JavaScript
// ===================================

// App State
const appState = {
    currentView: 'book-selection', // 'book-selection', 'chapter-list', 'solutions'
    selectedBook: null,
    selectedChapter: null,
    searchQuery: ''
};

// DOM Elements
const container = document.getElementById('app-container');
const searchContainer = document.getElementById('search-container');
const searchInput = document.getElementById('search-input');
const floatingBackBtn = document.getElementById('floating-back-btn');

// Initialize App
document.addEventListener('DOMContentLoaded', () => {
    // Check if data is loaded
    if (typeof window.chaptersDataKshitij === 'undefined' || typeof window.chaptersDataKritika === 'undefined') {
        container.innerHTML = `
            <div style="text-align: center; padding: 3rem; color: var(--color-text-muted);">
                <p style="font-size: 1.2rem;">❌ Data could not be loaded</p>
                <p style="font-size: 0.9rem; margin-top: 0.5rem;">Please refresh the page</p>
            </div>
        `;
        return;
    }

    // Filter to only include actual chapters (entries with questions array)
    window.chaptersDataKshitij = window.chaptersDataKshitij.filter(item => Array.isArray(item.questions));
    window.chaptersDataKritika = window.chaptersDataKritika.filter(item => Array.isArray(item.questions));

    renderBookSelection();
});

// Floating back button click handler
floatingBackBtn?.addEventListener('click', () => {
    if (appState.currentView === 'solutions') {
        renderChapterList(appState.selectedBook);
    } else if (appState.currentView === 'chapter-list') {
        appState.searchQuery = '';
        searchInput.value = '';
        renderBookSelection();
    }
});

// Visitor Counter Logic
const visitorCounterElement = document.getElementById('visitor-counter');
const visitorCountDisplay = document.getElementById('visitor-count');

function initVisitorCounter() {
    // Get current count from localStorage
    let visitorCount = localStorage.getItem('ncertVisitorCount');

    if (!visitorCount) {
        // First time visitor
        visitorCount = 1;
    } else {
        // Increment count
        visitorCount = parseInt(visitorCount) + 1;
    }

    // Save updated count
    localStorage.setItem('ncertVisitorCount', visitorCount);

    // Display count with animation
    animateCounter(visitorCount);
}

function animateCounter(targetCount) {
    let currentCount = 0;
    const duration = 1000; // 1 second
    const steps = 30;
    const increment = targetCount / steps;
    const stepDuration = duration / steps;

    const timer = setInterval(() => {
        currentCount += increment;
        if (currentCount >= targetCount) {
            currentCount = targetCount;
            clearInterval(timer);
        }
        visitorCountDisplay.textContent = Math.floor(currentCount);
    }, stepDuration);
}

// Initialize visitor counter on page load
initVisitorCounter();

// Search functionality
searchInput?.addEventListener('input', (e) => {
    appState.searchQuery = e.target.value.toLowerCase();
    if (appState.currentView === 'chapter-list') {
        renderChapterList(appState.selectedBook);
    }
});

// ===================================
// RENDER FUNCTIONS
// ===================================

/**
 * Render Book Selection Screen
 */
function renderBookSelection() {
    appState.currentView = 'book-selection';
    appState.selectedBook = null;
    appState.selectedChapter = null;
    searchContainer.style.display = 'none';

    // Hide floating back button
    floatingBackBtn?.classList.remove('show');

    // Show visitor counter (only on landing page)
    visitorCounterElement?.classList.remove('hide');

    const html = `
        <div class="book-selection">
            <h2>📖 Select Your Book</h2>
            <p>Class 9 Hindi NCERT Solutions</p>
            
            <div class="book-grid">
                <div class="book-card" data-book="kshitij">
                    <div class="book-card-content">
                        <span class="book-icon">📘</span>
                        <h3>क्षितिज</h3>
                        <span class="chapter-count">${window.chaptersDataKshitij.length} Chapters</span>
                    </div>
                </div>
                
                <div class="book-card" data-book="kritika">
                    <div class="book-card-content">
                        <span class="book-icon">📕</span>
                        <h3>कृतिका</h3>
                        <span class="chapter-count">${window.chaptersDataKritika.length} Chapters</span>
                    </div>
                </div>
            </div>
        </div>
    `;

    container.innerHTML = html;

    // Add event listeners
    document.querySelectorAll('.book-card').forEach(card => {
        card.addEventListener('click', (e) => {
            const bookType = e.currentTarget.dataset.book;
            const bookData = bookType === 'kshitij' ? window.chaptersDataKshitij : window.chaptersDataKritika;
            const bookName = bookType === 'kshitij' ? 'क्षितिज' : 'कृतिका';

            appState.selectedBook = { type: bookType, data: bookData, name: bookName };
            renderChapterList(appState.selectedBook);
        });
    });
}

/**
 * Render Chapter List Screen
 */
function renderChapterList(book) {
    appState.currentView = 'chapter-list';
    searchContainer.style.display = 'flex';

    // Show floating back button
    floatingBackBtn?.classList.add('show');

    // Hide visitor counter (only show on landing page)
    visitorCounterElement?.classList.add('hide');

    // Filter chapters based on search
    let chapters = book.data;
    if (appState.searchQuery) {
        chapters = chapters.filter(chapter =>
            chapter.title.toLowerCase().includes(appState.searchQuery) ||
            chapter.description.toLowerCase().includes(appState.searchQuery) ||
            chapter.number.toLowerCase().includes(appState.searchQuery)
        );
    }

    const html = `
        <div class="chapter-view">
            <div class="view-header">
                <button class="back-button" id="back-to-books">
                    ← Back to Book Selection
                </button>
                <div class="view-title">
                    <h2>${book.name}</h2>
                    <p>${chapters.length} Chapters${appState.searchQuery ? ' (Search Results)' : ''}</p>
                </div>
            </div>
            
            <div class="chapter-grid">
                ${chapters.map(chapter => `
                    <div class="chapter-card" data-chapter-id="${chapter.id}">
                        <span class="chapter-number">${chapter.number}</span>
                        <h3>${chapter.title}</h3>
                        <p>${chapter.description}</p>
                    </div>
                `).join('')}
            </div>
            
            ${chapters.length === 0 ? `
                <div style="text-align: center; padding: 3rem; color: var(--color-text-muted);">
                    <p style="font-size: 1.2rem;">No results found</p>
                    <p style="font-size: 0.9rem; margin-top: 0.5rem;">Please try a different search</p>
                </div>
            ` : ''}
            
            <div style="text-align: center; margin-top: 2rem;">
                <button class="back-button" id="back-to-books-bottom">
                    ← Back to Book Selection
                </button>
            </div>
        </div>
    `;

    container.innerHTML = html;

    // Add event listeners
    document.getElementById('back-to-books')?.addEventListener('click', () => {
        appState.searchQuery = '';
        searchInput.value = '';
        renderBookSelection();
    });

    document.getElementById('back-to-books-bottom')?.addEventListener('click', () => {
        appState.searchQuery = '';
        searchInput.value = '';
        renderBookSelection();
    });

    document.querySelectorAll('.chapter-card').forEach(card => {
        card.addEventListener('click', (e) => {
            const chapterId = parseInt(e.currentTarget.dataset.chapterId);
            const chapter = book.data.find(ch => ch.id === chapterId);

            if (chapter) {
                appState.selectedChapter = chapter;
                renderSolutions(chapter, book);
            }
        });
    });
}

/**
 * Render Solutions Screen
 */
function renderSolutions(chapter, book) {
    appState.currentView = 'solutions';
    searchContainer.style.display = 'none';

    // Show floating back button
    floatingBackBtn?.classList.add('show');

    // Hide visitor counter (only show on landing page)
    visitorCounterElement?.classList.add('hide');

    const html = `
        <div class="solutions-view">
            <button class="back-button" id="back-to-chapters">
                ← Back to Chapter List
            </button>
            
            <div class="solutions-header">
                <h2>${chapter.number}: ${chapter.title}</h2>
                <p>${chapter.description}</p>
            </div>
            
            <div class="question-list">
                ${chapter.questions.map(question => `
                    <div class="question-item-static">
                        <div class="question-section">
                            <div class="question-text">
                                <strong>Question ${question.number}:</strong> ${question.text}
                            </div>
                            <span class="question-type">${question.type}</span>
                        </div>
                        <div class="answer-section">
                            <span class="answer-label">✓ Answer</span>
                            <div class="answer-text">${question.answer}</div>
                        </div>
                    </div>
                `).join('')}
            </div>
            
            <div style="text-align: center; margin-top: 2rem; padding-top: 2rem; border-top: 1px solid var(--border);">
                <button class="back-button" id="back-to-chapters-bottom">
                    ← Back to Chapter List
                </button>
            </div>
        </div>
    `;

    container.innerHTML = html;

    // Add event listener for the back button
    document.getElementById('back-to-chapters')?.addEventListener('click', () => {
        renderChapterList(book);
    });

    document.getElementById('back-to-chapters-bottom')?.addEventListener('click', () => {
        renderChapterList(book);
    });
}

// ===================================
// UTILITY FUNCTIONS
// ===================================

/**
 * Smooth scroll to top
 */
function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Export for debugging
window.appState = appState;
window.renderBookSelection = renderBookSelection;