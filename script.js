// Main script for the Code Articles website

// Configuration
const ARTICLES_FOLDER = 'articles/';
const SUPPORTED_LANGUAGES = {
    'js': 'JavaScript',
    'py': 'Python',
    'html': 'HTML',
    'css': 'CSS',
    'java': 'Java',
    'cpp': 'C++',
    'c': 'C',
    'php': 'PHP',
    'rb': 'Ruby',
    'go': 'Go',
    'rs': 'Rust',
    'ts': 'TypeScript',
    'sql': 'SQL',
    'json': 'JSON',
    'xml': 'XML',
    'md': 'Markdown'
};

// Utility functions
function getFileExtension(filename) {
    return filename.split('.').pop().toLowerCase();
}

function getLanguageFromExtension(extension) {
    return SUPPORTED_LANGUAGES[extension] || extension.toUpperCase();
}

function formatFilename(filename) {
    // Remove extension and replace dashes/underscores with spaces
    const nameWithoutExt = filename.replace(/\.[^/.]+$/, "");
    return nameWithoutExt
        .replace(/[-_]/g, ' ')
        .replace(/\b\w/g, l => l.toUpperCase());
}

function formatDate(timestamp) {
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}

// Article listing functionality
async function loadArticlesList() {
    try {
        // In a real implementation, we would fetch from GitHub API
        // For this demo, we'll simulate with a predefined list
        const articlesContainer = document.getElementById('articles-container');
        
        if (!articlesContainer) return; // Not on the index page
        
        // Get list of articles (in a real implementation, this would be dynamic)
        const articles = await getArticlesList();
        
        if (articles.length === 0) {
            articlesContainer.innerHTML = '<p>No articles found.</p>';
            return;
        }
        
        articlesContainer.innerHTML = articles.map(article => `
            <div class="article-card">
                <div class="article-card-header">
                    <h3>${article.title}</h3>
                    <p>${article.description || 'Code example and explanation'}</p>
                </div>
                <div class="article-card-meta">
                    <span class="language">${article.language}</span>
                    <span class="date">${article.date}</span>
                </div>
                <div class="article-card-footer">
                    <a href="article.html?file=${article.filename}" class="btn">Read Article</a>
                </div>
            </div>
        `).join('');
    } catch (error) {
        console.error('Error loading articles:', error);
        document.getElementById('articles-container').innerHTML = 
            '<p>Error loading articles. Please try again later.</p>';
    }
}

// Simulate getting articles list (in a real implementation, this would use GitHub API)
async function getArticlesList() {
    // This is a simulation - in a real implementation, you would:
    // 1. Use GitHub API to list files in the articles folder
    // 2. Or use a GitHub Action to generate a manifest file
    
    // For demo purposes, we'll return a hardcoded list
    return [
        {
            filename: 'example.js',
            title: 'JavaScript Array Methods',
            language: 'JavaScript',
            date: 'Jan 15, 2023',
            description: 'Examples of useful JavaScript array methods'
        },
        {
            filename: 'example.py',
            title: 'Python Data Processing',
            language: 'Python',
            date: 'Feb 3, 2023',
            description: 'Efficient data processing with Python'
        },
        {
            filename: 'example.html',
            title: 'HTML5 Semantic Elements',
            language: 'HTML',
            date: 'Mar 22, 2023',
            description: 'Using semantic HTML5 elements for better structure'
        },
        {
            filename: 'example.css',
            title: 'CSS Flexbox Layout',
            language: 'CSS',
            date: 'Apr 10, 2023',
            description: 'Creating responsive layouts with CSS Flexbox'
        }
    ];
}

// Article loading functionality
async function loadArticle() {
    try {
        const urlParams = new URLSearchParams(window.location.search);
        const filename = urlParams.get('file');
        
        if (!filename) {
            document.getElementById('code-content').textContent = 
                'No article specified. Please select an article from the homepage.';
            return;
        }
        
        // Update page title and heading
        const title = formatFilename(filename);
        document.getElementById('article-title').textContent = `${title} - Code Articles`;
        document.getElementById('article-heading').textContent = title;
        
        // Update language and date in meta
        const extension = getFileExtension(filename);
        const language = getLanguageFromExtension(extension);
        document.getElementById('article-language').textContent = language;
        
        // Set code language class for syntax highlighting
        const codeElement = document.getElementById('code-content');
        codeElement.className = `language-${extension}`;
        
        // Load the code content
        const code = await loadCodeFile(filename);
        codeElement.textContent = code;
        
        // Re-run syntax highlighting
        if (window.hljs) {
            hljs.highlightAll();
        }
        
        // Set up copy button
        const copyButton = document.getElementById('copy-button');
        if (copyButton) {
            copyButton.addEventListener('click', () => copyCodeToClipboard(code));
        }
    } catch (error) {
        console.error('Error loading article:', error);
        document.getElementById('code-content').textContent = 
            'Error loading article. Please try again later.';
    }
}

// Simulate loading code file (in a real implementation, this would fetch from GitHub)
async function loadCodeFile(filename) {
    // This is a simulation - in a real implementation, you would:
    // 1. Use GitHub API to fetch the file content
    // 2. Or use a GitHub Action to preprocess files
    
    // For demo purposes, we'll return example code based on file extension
    const extension = getFileExtension(filename);
    
    const examples = {
        'js': `// JavaScript Example: Array Methods
const numbers = [1, 2, 3, 4, 5];

// Map: Transform each element
const doubled = numbers.map(n => n * 2);
console.log(doubled); // [2, 4, 6, 8, 10]

// Filter: Keep elements that pass a test
const even = numbers.filter(n => n % 2 === 0);
console.log(even); // [2, 4]

// Reduce: Accumulate values
const sum = numbers.reduce((acc, n) => acc + n, 0);
console.log(sum); // 15

// Find: Get first matching element
const firstEven = numbers.find(n => n % 2 === 0);
console.log(firstEven); // 2

// Some: Check if any element passes test
const hasEven = numbers.some(n => n % 2 === 0);
console.log(hasEven); // true`,

        'py': `# Python Example: Data Processing
def process_data(data):
    """Process a list of data points"""
    # Filter out None values
    clean_data = [x for x in data if x is not None]
    
    # Calculate statistics
    total = sum(clean_data)
    average = total / len(clean_data) if clean_data else 0
    maximum = max(clean_data) if clean_data else 0
    
    return {
        'total': total,
        'average': average,
        'maximum': maximum,
        'count': len(clean_data)
    }

# Example usage
data = [10, 20, None, 30, 40, None, 50]
result = process_data(data)
print(f"Processed {result['count']} items")
print(f"Total: {result['total']}, Average: {result['average']:.2f}")`,

        'html': `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Semantic HTML Example</title>
</head>
<body>
    <header>
        <h1>Website Header</h1>
        <nav>
            <ul>
                <li><a href="#home">Home</a></li>
                <li><a href="#about">About</a></li>
                <li><a href="#contact">Contact</a></li>
            </ul>
        </nav>
    </header>
    
    <main>
        <article>
            <header>
                <h2>Article Title</h2>
                <p>Published on <time datetime="2023-01-15">January 15, 2023</time></p>
            </header>
            
            <section>
                <h3>Introduction</h3>
                <p>This is the introduction section of the article.</p>
            </section>
            
            <section>
                <h3>Main Content</h3>
                <p>This is the main content section with more details.</p>
            </section>
            
            <footer>
                <p>Article footer with author information.</p>
            </footer>
        </article>
    </main>
    
    <aside>
        <h3>Related Content</h3>
        <p>Additional information or links.</p>
    </aside>
    
    <footer>
        <p>&copy; 2023 Website Name. All rights reserved.</p>
    </footer>
</body>
</html>`,

        'css': `/* CSS Example: Flexbox Layout */
.container {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
    background-color: #f5f5f5;
}

.header {
    background-color: #2c3e50;
    color: white;
    padding: 1rem 2rem;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.main-content {
    display: flex;
    flex: 1;
    padding: 2rem;
    gap: 2rem;
}

.sidebar {
    flex: 0 0 250px;
    background-color: white;
    padding: 1.5rem;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.content {
    flex: 1;
    background-color: white;
    padding: 1.5rem;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.footer {
    background-color: #34495e;
    color: white;
    text-align: center;
    padding: 1rem;
}

/* Responsive design */
@media (max-width: 768px) {
    .main-content {
        flex-direction: column;
        padding: 1rem;
    }
    
    .sidebar {
        flex: none;
        order: 2;
    }
}`
    };
    
    return examples[extension] || `// Code for ${filename} would be loaded here`;
}

// Copy to clipboard functionality
async function copyCodeToClipboard(code) {
    try {
        await navigator.clipboard.writeText(code);
        
        const button = document.getElementById('copy-button');
        const originalText = button.textContent;
        
        button.textContent = 'Copied!';
        button.classList.add('copied');
        
        setTimeout(() => {
            button.textContent = originalText;
            button.classList.remove('copied');
        }, 2000);
    } catch (err) {
        console.error('Failed to copy code: ', err);
        alert('Failed to copy code to clipboard');
    }
}

// Initialize the appropriate functionality based on the current page
document.addEventListener('DOMContentLoaded', function() {
    if (document.getElementById('articles-container')) {
        // We're on the index page
        loadArticlesList();
    } else if (document.getElementById('code-content')) {
        // We're on an article page
        loadArticle();
    }
});