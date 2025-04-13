---
layout: page
title: Search
permalink: /search
---

<div class="wrap">
  <h1>Search</h1>

  <div class="search-container">
    <div class="search-field">
      <input type="text" id="search-input" placeholder="Search notes..." class="search-input">
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
        resultsContainer.innerHTML = '<p class="muted">No results found.</p>';
        return;
      }
      
      let resultsHtml = '<ul class="list-plain">';
      results.forEach(note => {
        resultsHtml += `
          <li class="mt-4">
            <a href="${note.url}" class="internal-link">
              ${note.title}
            </a>
            <div class="muted small">
              ${note.date}
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
    .search-container {
      margin: 2rem 0 3rem;
    }
    
    .search-field {
      position: relative;
      max-width: 100%;
      width: 100%;
    }
    
    .search-input {
      width: 100%;
      padding: 0.7rem 1rem;
      margin-bottom: 2rem;
      font-size: 1rem;
      border: none;
      border-bottom: 1px solid var(--color-ui-normal);
      border-radius: 0;
      background: var(--color-bg-primary);
      color: var(--color-tx-normal);
      font-family: var(--font-ui);
      transition: border-color 0.3s;
      -webkit-appearance: none;
    }
    
    .search-input::placeholder {
      color: var(--color-tx-faint);
      font-style: italic;
    }
    
    .search-input:focus {
      outline: none;
      border-bottom: 1px solid var(--color-action);
    }
    
    .search-results ul {
      margin-top: 1rem;
    }
    
    .search-results li {
      margin-bottom: 1.2rem;
    }
    
    .mt-4 {
      margin-top: 1rem;
    }
    
    .list-plain {
      list-style: none;
      padding: 0;
      margin: 0;
    }

    @media (min-width: 640px) {
      .search-field {
        max-width: 30rem;
      }
    }
  </style>
</div> 