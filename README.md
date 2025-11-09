# LGBTQ+ Book Tracker 🏳️‍🌈

A beautifully designed web application for tracking LGBTQ+ books you've read and rating your favorites. Built with vanilla HTML, CSS, and JavaScript, optimized for GitHub Pages deployment.

## Features

### 📚 Comprehensive Book Database
- **100 curated books** with authentic LGBTQ+ representation
- Diverse representation including: Gay, Lesbian, Bisexual, Trans, Non-binary, Queer, Asexual, Aromantic, and more
- Multiple genres: Contemporary Romance, Fantasy, Historical Fiction, YA, Science Fiction, and more
- Detailed information including:
  - Book title, author, and description
  - Author biography
  - LGBTQ+ representation types
  - Content/trigger warnings
  - Average ratings
  - Publication year
  - Genre classification
  - Page count for each book

### 🎨 User Interface
- **Responsive design** that works on mobile, tablet, and desktop
- **Beautiful rainbow-themed header** celebrating LGBTQ+ pride
- **Color-coded book cards** with unique cover colors
- **Interactive modal dialogs** for detailed book information
- **Smooth animations** and hover effects
- **Accessible design** with ARIA labels and keyboard navigation

### ✨ Tracking Features
- **Mark books as read/unread** with a single click
- **Rate books** from 1-5 stars with your personal rating
- **Real-time statistics** showing:
  - Total books in database
  - Books you've read
  - Your average rating
  - Average pages of books you've read
- **Local storage** - all your data is saved in your browser

### 🎯 Smart Recommendations
- **Personalized book recommendations** based on your ratings
- Analyzes books you've rated 4+ stars
- Recommends similar books by:
  - Genre preferences
  - LGBTQ+ representation types you enjoy
  - Book length preferences
  - Overall ratings
- Shows up to 6 recommendations with reasons why each book matches your taste
- Automatically updates as you rate more books

### 📊 Book Length Visualization
- **Interactive bar chart** showing distribution of books by length
- Categories: Short (<250 pages), Medium (250-400), Long (>400)
- Statistics panel displaying:
  - Average book length across all books
  - Shortest and longest books in the collection
  - Median book length

### 🔍 Advanced Filtering & Sorting
- **Search** by title, author, or representation type
- **Filter by reading status**: All books, Read, or Unread
- **Filter by representation type**: Gay, Lesbian, Trans, Non-binary, etc.
- **Filter by genre**: Contemporary, Fantasy, Historical, etc.
- **Filter by book length**: Short (<250 pages), Medium (250-400), or Long (>400)
- **Filter by content warnings**: All books, No warnings only, or Has warnings
- **Sort by**: Title, Author, Rating (High/Low), Publication Year, or Book Length
- **Reset filters** button to start fresh

### ⚠️ Content Warnings
Each book includes appropriate content/trigger warnings to help readers make informed choices, including warnings for:
- Violence, death, or gore
- Mental health topics (anxiety, depression, suicide)
- Abuse (physical, sexual, domestic)
- Discrimination (homophobia, transphobia, racism)
- And more

## How to Use

### Basic Usage
1. **Browse Books**: Scroll through the collection of 100 LGBTQ+ books
2. **Click on a book** to see detailed information including description, author bio, and content warnings
3. **Mark as Read**: Click the "Mark as Read" button to track books you've finished
4. **Rate Books**: Click stars (1-5) to add your personal rating
5. **Search & Filter**: Use the search bar and filters to find specific books

### Filtering Tips
- Use the search bar for quick title/author searches
- Combine filters to narrow down results (e.g., "Lesbian" + "Fantasy" + "Read")
- Click "Reset Filters" to clear all selections

### Data Storage
- All your data (read status and ratings) is stored locally in your browser
- Your data persists between sessions
- No account or login required
- Data is never sent to any server

## Deployment to GitHub Pages

This project is optimized for GitHub Pages deployment. Here's how to deploy:

### Method 1: Using GitHub Settings (Recommended)

1. **Push this repository to GitHub**
2. Go to your repository on GitHub
3. Click on **Settings**
4. Navigate to **Pages** in the left sidebar
5. Under **Source**, select the branch you want to deploy (usually `main` or `master`)
6. Click **Save**
7. Your site will be published at: `https://yourusername.github.io/repository-name/`

### Method 2: Using GitHub Actions

Create a `.github/workflows/deploy.yml` file:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Deploy
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./
```

### Custom Domain (Optional)

1. Add a `CNAME` file to the root directory with your domain name
2. Configure your domain's DNS settings to point to GitHub Pages
3. Enable "Enforce HTTPS" in GitHub Pages settings

## Technical Details

### Technologies Used
- **HTML5**: Semantic markup with accessibility features
- **CSS3**: Modern styling with CSS Grid, Flexbox, and animations
- **JavaScript (ES6+)**: Vanilla JS with no dependencies
- **Local Storage API**: For persistent data storage

### Browser Compatibility
- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

### Performance
- **No external dependencies**: Fast load times
- **Optimized images**: Using CSS gradients instead of image files
- **Lazy loading**: Books rendered efficiently
- **Responsive**: Adapts to any screen size

## File Structure

```
lgbtq-book-tracker/
├── index.html          # Main HTML file
├── styles.css          # All styling
├── app.js             # Application logic
├── books.json         # Book database (100 books)
└── README.md          # This file
```

## Customization

### Adding More Books

Edit `books.json` and add new book objects following this structure:

```json
{
  "id": 101,
  "title": "Book Title",
  "author": "Author Name",
  "authorDescription": "Author bio...",
  "lgbtqRepresentation": ["Gay", "Trans"],
  "averageRating": 4.5,
  "triggerWarnings": ["Violence", "Death"],
  "description": "Book description...",
  "publishYear": 2023,
  "genre": "Fantasy",
  "coverColor": "#E74C3C"
}
```

### Changing Colors

Edit CSS custom properties in `styles.css`:

```css
:root {
    --primary-color: #6366f1;
    --secondary-color: #ec4899;
    /* ... other colors */
}
```

## Accessibility Features

- **ARIA labels** for screen readers
- **Keyboard navigation** support
- **High contrast** color schemes
- **Reduced motion** support for users with motion sensitivity
- **Semantic HTML** for better structure
- **Focus indicators** for keyboard users

## Privacy

- **No tracking**: This application doesn't use any analytics or tracking
- **No cookies**: Only uses local storage for your personal data
- **No server**: Everything runs in your browser
- **No accounts**: No sign-up or login required

## Credits

### Book Data
All book information has been compiled from publicly available sources. Book ratings are approximate averages from popular book rating platforms.

### Design
- Rainbow gradient inspired by the Pride flag
- Color scheme designed for accessibility and visual appeal
- Icons and styling are custom-made for this project

## License

This project is open source and available for personal and educational use.

## Contributing

Found a bug or have a suggestion? This project welcomes contributions!

## Acknowledgments

This project celebrates LGBTQ+ voices in literature and the authors who create authentic representation. Thank you to all the authors included in this database for their important work.

---

**Happy Reading! 🌈📚**
