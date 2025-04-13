---
layout: page
title: Search
permalink: /search
---

<div class="wrap">
  <h1>Search</h1>
  <p class="search-description">Find notes, articles and other content across the site</p>

  <div class="search-container">
    <div class="search-field">
      <input type="text" id="search-input" placeholder="Type to search..." class="search-input">
      <div class="search-icon">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="11" cy="11" r="8"></circle>
          <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
        </svg>
      </div>
    </div>
    <div id="search-results" class="search-results"></div>
  </div>

  <script>
    // JSON containing all searchable notes
    const notes = [
      {% assign sorted_notes = site.notes | sort: "date" | reverse %}
      {% for note in sorted_notes %}
        {
          "title": "{{ note.title | escape }}",
          "content": {{ note.content | strip_html | strip_newlines | jsonify }},
          "url": "{{ site.baseurl }}{{ note.url }}",
          "date": "{{ note.date | date: "%B %e, %Y" }}"
        }{% unless forloop.last %},{% endunless %}
      {% endfor %}
    ];

    // Search function
    function performSearch() {
      const query = document.getElementById('search-input').value.toLowerCase();
      const resultsContainer = document.getElementById('search-results');
      
      if (query.length < 2) {
        resultsContainer.innerHTML = '';
        return;
      }
      
      const results = notes.filter(note => {
        return note.title.toLowerCase().includes(query) || 
               note.content.toLowerCase().includes(query);
      });
      
      if (results.length === 0) {
        resultsContainer.innerHTML = '<p class="no-results">No results found. Try different keywords.</p>';
        return;
      }
      
      let resultsHtml = '<div class="results-count">' + results.length + ' results found</div>';
      resultsHtml += '<ul class="search-results-list">';
      results.forEach(note => {
        resultsHtml += `
          <li class="search-result-item">
            <a href="${note.url}" class="internal-link search-result-title">
              ${note.title}
            </a>
            <div class="search-result-date">
              ${note.date}
            </div>
            <div class="search-result-preview">
              ${note.content.substring(0, 150)}...
            </div>
          </li>
        `;
      });
      resultsHtml += '</ul>';
      
      resultsContainer.innerHTML = resultsHtml;
    }

    // Add event listener
    document.getElementById('search-input').addEventListener('input', performSearch);
  </script>

  <style>
    .search-description {
      color: var(--color-tx-subtle);
      margin-bottom: 2rem;
    }
    
    .search-container {
      margin: 2rem 0 3rem;
    }
    
    .search-field {
      position: relative;
      max-width: 100%;
      width: 100%;
      margin-bottom: 2rem;
    }
    
    .search-input {
      width: 100%;
      padding: 0.5rem 0.5rem 0.5rem 2.5rem;
      margin-bottom: 1rem;
      font-size: 1.4rem;
      border: none;
      border-bottom: 1px solid var(--color-ui-normal);
      background: transparent;
      color: var(--color-tx-normal);
      font-family: var(--font-ui);
      transition: all 0.3s;
      -webkit-appearance: none;
    }
    
    .search-icon {
      position: absolute;
      left: 0;
      top: 50%;
      transform: translateY(-50%);
      color: var(--color-tx-faint);
      pointer-events: none;
      margin-top: -0.5rem;
    }
    
    .search-input::placeholder {
      color: var(--color-tx-faint);
    }
    
    .search-input:focus {
      outline: none;
      border-color: var(--color-action);
      box-shadow: none;
    }
    
    .results-count {
      margin-bottom: 1.5rem;
      color: var(--color-tx-subtle);
      font-size: 0.95rem;
    }
    
    .no-results {
      padding: 2rem 0;
      text-align: center;
      color: var(--color-tx-subtle);
      font-style: italic;
    }
    
    .search-results-list {
      list-style: none;
      padding: 0;
      margin: 0;
    }
    
    .search-result-item {
      margin-bottom: 2rem;
      padding-bottom: 2rem;
      border-bottom: 1px solid var(--color-ui-faint);
    }
    
    .search-result-item:last-child {
      border-bottom: none;
    }
    
    .search-result-title {
      font-size: 1.3rem;
      font-weight: 600;
      color: var(--color-action);
      display: block;
      margin-bottom: 0.4rem;
    }
    
    .search-result-date {
      color: var(--color-tx-subtle);
      font-size: 0.85rem;
      margin-bottom: 0.8rem;
    }
    
    .search-result-preview {
      color: var(--color-tx-normal);
      font-size: 0.95rem;
      line-height: 1.6;
    }

    @media (min-width: 768px) {
      .search-field {
        max-width: 38rem;
      }
    }
  </style>
</div> 