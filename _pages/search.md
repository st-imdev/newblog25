---
layout: page
title: Search
permalink: /search
---

<div class="wrap">
  <h1>Search</h1>

  <div>
    <input type="text" id="search-input" placeholder="Search notes..." class="search-input">
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
    .search-input {
      width: var(--input-width);
      padding: 0.8rem;
      margin-bottom: 2rem;
      font-size: 1.1rem;
      border: 1px solid var(--color-ui-normal);
      border-radius: var(--border-radius);
      background: var(--color-bg-primary);
      color: var(--color-tx-normal);
      font-family: var(--font-ui);
    }
    
    .search-input:focus {
      outline: none;
      border-color: var(--color-action);
      box-shadow: 0 0 0 2px var(--color-bg-hover);
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
  </style>
</div> 