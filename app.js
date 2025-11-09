// LGBTQ+ Book Tracker Application
// Local Storage Keys
const STORAGE_KEYS = {
    READ_BOOKS: 'lgbtq_tracker_read_books',
    USER_RATINGS: 'lgbtq_tracker_user_ratings'
};

// Application State
let allBooks = [];
let filteredBooks = [];
let readBooks = new Set();
let userRatings = {};

// DOM Elements
const elements = {
    booksGrid: document.getElementById('books-grid'),
    searchInput: document.getElementById('search-input'),
    statusFilter: document.getElementById('status-filter'),
    representationFilter: document.getElementById('representation-filter'),
    genreFilter: document.getElementById('genre-filter'),
    sortBy: document.getElementById('sort-by'),
    resetFilters: document.getElementById('reset-filters'),
    showingCount: document.getElementById('showing-count'),
    noResults: document.getElementById('no-results'),
    totalBooks: document.getElementById('total-books'),
    booksRead: document.getElementById('books-read'),
    avgRating: document.getElementById('avg-rating'),
    modal: document.getElementById('book-modal'),
    modalOverlay: document.getElementById('modal-overlay'),
    modalClose: document.getElementById('modal-close'),
    modalBody: document.getElementById('modal-body')
};

// Initialize Application
async function init() {
    try {
        // Load books data
        const response = await fetch('books.json');
        allBooks = await response.json();

        // Load user data from local storage
        loadUserData();

        // Populate genre filter
        populateGenreFilter();

        // Initial render
        filteredBooks = [...allBooks];
        renderBooks();
        updateStats();

        // Set up event listeners
        setupEventListeners();

        console.log('App initialized successfully');
    } catch (error) {
        console.error('Error initializing app:', error);
        elements.booksGrid.innerHTML = '<p style="text-align: center; color: red;">Error loading books. Please refresh the page.</p>';
    }
}

// Load User Data from Local Storage
function loadUserData() {
    const readBooksData = localStorage.getItem(STORAGE_KEYS.READ_BOOKS);
    const ratingsData = localStorage.getItem(STORAGE_KEYS.USER_RATINGS);

    readBooks = readBooksData ? new Set(JSON.parse(readBooksData)) : new Set();
    userRatings = ratingsData ? JSON.parse(ratingsData) : {};
}

// Save User Data to Local Storage
function saveUserData() {
    localStorage.setItem(STORAGE_KEYS.READ_BOOKS, JSON.stringify([...readBooks]));
    localStorage.setItem(STORAGE_KEYS.USER_RATINGS, JSON.stringify(userRatings));
}

// Populate Genre Filter
function populateGenreFilter() {
    const genres = [...new Set(allBooks.map(book => book.genre))].sort();
    genres.forEach(genre => {
        const option = document.createElement('option');
        option.value = genre;
        option.textContent = genre;
        elements.genreFilter.appendChild(option);
    });
}

// Set Up Event Listeners
function setupEventListeners() {
    elements.searchInput.addEventListener('input', debounce(applyFilters, 300));
    elements.statusFilter.addEventListener('change', applyFilters);
    elements.representationFilter.addEventListener('change', applyFilters);
    elements.genreFilter.addEventListener('change', applyFilters);
    elements.sortBy.addEventListener('change', applyFilters);
    elements.resetFilters.addEventListener('click', resetFilters);

    elements.modalOverlay.addEventListener('click', closeModal);
    elements.modalClose.addEventListener('click', closeModal);

    // Close modal on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && elements.modal.classList.contains('active')) {
            closeModal();
        }
    });
}

// Debounce Function
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Apply Filters and Sorting
function applyFilters() {
    const searchTerm = elements.searchInput.value.toLowerCase().trim();
    const statusFilter = elements.statusFilter.value;
    const repFilter = elements.representationFilter.value;
    const genreFilter = elements.genreFilter.value;

    filteredBooks = allBooks.filter(book => {
        // Search filter
        const matchesSearch = !searchTerm ||
            book.title.toLowerCase().includes(searchTerm) ||
            book.author.toLowerCase().includes(searchTerm) ||
            book.lgbtqRepresentation.some(rep => rep.toLowerCase().includes(searchTerm)) ||
            book.description.toLowerCase().includes(searchTerm);

        // Status filter
        const isRead = readBooks.has(book.id);
        const matchesStatus = statusFilter === 'all' ||
            (statusFilter === 'read' && isRead) ||
            (statusFilter === 'unread' && !isRead);

        // Representation filter
        const matchesRep = repFilter === 'all' ||
            book.lgbtqRepresentation.includes(repFilter);

        // Genre filter
        const matchesGenre = genreFilter === 'all' ||
            book.genre === genreFilter;

        return matchesSearch && matchesStatus && matchesRep && matchesGenre;
    });

    // Apply sorting
    sortBooks();

    // Render filtered books
    renderBooks();
}

// Sort Books
function sortBooks() {
    const sortBy = elements.sortBy.value;

    filteredBooks.sort((a, b) => {
        switch (sortBy) {
            case 'title':
                return a.title.localeCompare(b.title);
            case 'author':
                return a.author.localeCompare(b.author);
            case 'rating-high':
                return b.averageRating - a.averageRating;
            case 'rating-low':
                return a.averageRating - b.averageRating;
            case 'year-new':
                return b.publishYear - a.publishYear;
            case 'year-old':
                return a.publishYear - b.publishYear;
            default:
                return 0;
        }
    });
}

// Reset Filters
function resetFilters() {
    elements.searchInput.value = '';
    elements.statusFilter.value = 'all';
    elements.representationFilter.value = 'all';
    elements.genreFilter.value = 'all';
    elements.sortBy.value = 'title';
    applyFilters();
}

// Render Books
function renderBooks() {
    elements.showingCount.textContent = filteredBooks.length;

    if (filteredBooks.length === 0) {
        elements.booksGrid.style.display = 'none';
        elements.noResults.style.display = 'block';
        return;
    }

    elements.booksGrid.style.display = 'grid';
    elements.noResults.style.display = 'none';

    elements.booksGrid.innerHTML = filteredBooks.map(book => createBookCard(book)).join('');

    // Add event listeners to book cards
    document.querySelectorAll('.book-card').forEach(card => {
        const bookId = parseInt(card.dataset.bookId);
        card.addEventListener('click', (e) => {
            // Don't open modal if clicking on buttons
            if (!e.target.closest('.book-actions')) {
                openModal(bookId);
            }
        });
    });

    // Add event listeners to action buttons
    document.querySelectorAll('.btn-read').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const bookId = parseInt(btn.dataset.bookId);
            toggleReadStatus(bookId);
        });
    });

    document.querySelectorAll('.btn-rate').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const bookId = parseInt(btn.dataset.bookId);
            openModal(bookId);
        });
    });
}

// Create Book Card HTML
function createBookCard(book) {
    const isRead = readBooks.has(book.id);
    const userRating = userRatings[book.id];
    const displayRating = userRating || book.averageRating;
    const stars = generateStars(displayRating);

    // Lighten or darken the cover color for gradient
    const coverColorAlt = adjustColor(book.coverColor, -20);

    return `
        <div class="book-card" data-book-id="${book.id}">
            ${isRead ? '<div class="read-badge">Read</div>' : ''}
            <div class="book-cover" style="--cover-color: ${book.coverColor}; --cover-color-alt: ${coverColorAlt};">
                <div class="book-cover-title">${truncate(book.title, 50)}</div>
            </div>
            <div class="book-content">
                <h3 class="book-title">${book.title}</h3>
                <p class="book-author">by ${book.author}</p>
                <div class="book-meta">
                    <div class="book-rating">
                        <span class="stars">${stars}</span>
                        <span class="rating-number">${displayRating.toFixed(1)}</span>
                        ${userRating ? '<span style="font-size: 0.75rem; color: var(--success-color);">(Your rating)</span>' : ''}
                    </div>
                </div>
                <div class="book-representation">
                    ${book.lgbtqRepresentation.map(rep => `<span class="rep-tag">${rep}</span>`).join('')}
                </div>
                <div class="book-actions">
                    <button class="btn btn-read ${isRead ? 'active' : ''}" data-book-id="${book.id}">
                        ${isRead ? 'Mark Unread' : 'Mark as Read'}
                    </button>
                    <button class="btn btn-rate" data-book-id="${book.id}">
                        ${userRating ? 'Edit Rating' : 'Rate Book'}
                    </button>
                </div>
            </div>
        </div>
    `;
}

// Generate Star Rating HTML
function generateStars(rating) {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

    let stars = '★'.repeat(fullStars);
    if (hasHalfStar) stars += '⯨';
    stars += '☆'.repeat(emptyStars);

    return stars;
}

// Adjust Color Brightness
function adjustColor(color, amount) {
    const num = parseInt(color.replace('#', ''), 16);
    const r = Math.max(0, Math.min(255, (num >> 16) + amount));
    const g = Math.max(0, Math.min(255, ((num >> 8) & 0x00FF) + amount));
    const b = Math.max(0, Math.min(255, (num & 0x0000FF) + amount));
    return '#' + ((r << 16) | (g << 8) | b).toString(16).padStart(6, '0');
}

// Truncate Text
function truncate(text, length) {
    return text.length > length ? text.substring(0, length) + '...' : text;
}

// Toggle Read Status
function toggleReadStatus(bookId) {
    if (readBooks.has(bookId)) {
        readBooks.delete(bookId);
    } else {
        readBooks.add(bookId);
    }

    saveUserData();
    updateStats();
    renderBooks();
}

// Open Modal
function openModal(bookId) {
    const book = allBooks.find(b => b.id === bookId);
    if (!book) return;

    const isRead = readBooks.has(bookId);
    const userRating = userRatings[bookId] || 0;

    elements.modalBody.innerHTML = `
        <div class="modal-header">
            <h2 class="modal-title" id="modal-title">${book.title}</h2>
            <p class="modal-author">by ${book.author}</p>
            <div class="modal-rating">
                <span class="stars" style="font-size: 1.5rem;">${generateStars(book.averageRating)}</span>
                <span style="font-weight: 600;">${book.averageRating.toFixed(1)} average rating</span>
            </div>
        </div>

        <div class="user-rating-section">
            <h3>Your Rating</h3>
            <div class="rating-stars" id="rating-stars">
                ${[1, 2, 3, 4, 5].map(star => `
                    <span class="star ${star <= userRating ? 'active' : ''}" data-rating="${star}">★</span>
                `).join('')}
            </div>
            ${userRating > 0 ? `<p style="color: var(--success-color); font-weight: 600;">You rated this ${userRating} star${userRating > 1 ? 's' : ''}</p>` : '<p style="color: var(--text-secondary);">Click stars to rate</p>'}
        </div>

        <div class="modal-section">
            <h3>Description</h3>
            <p>${book.description}</p>
        </div>

        <div class="modal-section">
            <h3>Author</h3>
            <p>${book.authorDescription}</p>
        </div>

        <div class="modal-section">
            <h3>LGBTQ+ Representation</h3>
            <p>${book.lgbtqRepresentation.join(', ')}</p>
        </div>

        <div class="modal-section">
            <h3>Genre</h3>
            <p>${book.genre}</p>
        </div>

        <div class="modal-section">
            <h3>Published</h3>
            <p>${book.publishYear}</p>
        </div>

        ${book.triggerWarnings.length > 0 ? `
            <div class="modal-section">
                <h3>Content Warnings</h3>
                <div>
                    ${book.triggerWarnings.map(warning => `<span class="trigger-warning">${warning}</span>`).join('')}
                </div>
            </div>
        ` : ''}

        <div class="modal-actions">
            <button class="btn btn-read ${isRead ? 'active' : ''}" id="modal-read-btn">
                ${isRead ? 'Mark as Unread' : 'Mark as Read'}
            </button>
        </div>
    `;

    // Add event listeners for rating stars
    document.querySelectorAll('.star').forEach(star => {
        star.addEventListener('click', () => {
            const rating = parseInt(star.dataset.rating);
            setUserRating(bookId, rating);
        });

        star.addEventListener('mouseenter', () => {
            const rating = parseInt(star.dataset.rating);
            highlightStars(rating);
        });
    });

    document.getElementById('rating-stars').addEventListener('mouseleave', () => {
        highlightStars(userRating);
    });

    // Add event listener for read button
    document.getElementById('modal-read-btn').addEventListener('click', () => {
        toggleReadStatus(bookId);
        closeModal();
    });

    elements.modal.classList.add('active');
    elements.modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
}

// Close Modal
function closeModal() {
    elements.modal.classList.remove('active');
    elements.modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
}

// Highlight Stars
function highlightStars(rating) {
    document.querySelectorAll('.star').forEach(star => {
        const starRating = parseInt(star.dataset.rating);
        if (starRating <= rating) {
            star.classList.add('active');
        } else {
            star.classList.remove('active');
        }
    });
}

// Set User Rating
function setUserRating(bookId, rating) {
    // If clicking the same rating, remove it
    if (userRatings[bookId] === rating) {
        delete userRatings[bookId];
    } else {
        userRatings[bookId] = rating;
    }

    saveUserData();
    updateStats();
    renderBooks();

    // Update modal display
    const userRating = userRatings[bookId] || 0;
    highlightStars(userRating);

    // Update rating text
    const ratingSection = document.querySelector('.user-rating-section');
    const ratingText = ratingSection.querySelector('p:last-child');
    if (userRating > 0) {
        ratingText.innerHTML = `<span style="color: var(--success-color); font-weight: 600;">You rated this ${userRating} star${userRating > 1 ? 's' : ''}</span>`;
    } else {
        ratingText.innerHTML = '<span style="color: var(--text-secondary);">Click stars to rate</span>';
    }
}

// Update Statistics
function updateStats() {
    elements.totalBooks.textContent = allBooks.length;
    elements.booksRead.textContent = readBooks.size;

    // Calculate average user rating
    const ratings = Object.values(userRatings);
    const avgRating = ratings.length > 0
        ? (ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length).toFixed(1)
        : '0.0';

    elements.avgRating.textContent = avgRating;
}

// Initialize app when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
