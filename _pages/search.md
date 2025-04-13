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
      {% assign sorted_notes = site.notes | sort: "last_modified_at_timestamp" | reverse %}
      {% for note in sorted_notes %}
        {
          "title": "{{ note.title | escape }}",
          "content": {{ note.content | strip_html | strip_newlines | jsonify }},
          "url": "{{ site.baseurl }}{{ note.url }}",
          "date": "{{ note.last_modified_at | date: "%Y-%m-%d" }}"
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
        resultsContainer.innerHTML = '<p>No results found.</p>';
        return;
      }
      
      let resultsHtml = '<ul>';
      results.forEach(note => {
        resultsHtml += `
          <li>
            <a href="${note.url}" class="internal-link">
              ${note.title}
            </a>
            <span class="muted small">${note.date}</span>
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
      width: 100%;
      padding: 0.5rem;
      margin-bottom: 1rem;
      font-size: 1.1rem;
    }
    
    .search-results li {
      margin-bottom: 0.8rem;
    }
    
    .search-results .muted {
      margin-left: 0.5rem;
    }
  </style>
</div> 