module ObsidianLinksConverter
  # Regular expression for matching wiki-style links like [[Link Name]]
  WIKI_LINK_REGEX = /\[\[([^\]]+)\]\]/

  def self.process_content(content, site)
    # Replace wiki-style links with Jekyll links
    content.gsub(WIKI_LINK_REGEX) do |match|
      link_text = $1.strip
      
      # Try to find the corresponding document
      doc = find_document_by_title(link_text, site)
      
      if doc
        # Create proper link to the document
        %(<a class="internal-link" href="#{site.baseurl}#{doc.url}">#{link_text}</a>)
      else
        # If document not found, leave as is with a special class
        %(<span class="invalid-link">#{link_text}</span>)
      end
    end
  end

  def self.find_document_by_title(title, site)
    # Try to find a document with matching title or filename
    site.collections['notes'].docs.find do |doc|
      doc.data['title'].to_s.downcase == title.downcase ||
      File.basename(doc.path, '.*').downcase == title.downcase.gsub(' ', '-')
    end
  end
end

Jekyll::Hooks.register :documents, :pre_render do |document, payload|
  # Only process documents from the notes collection
  if document.collection.label == 'notes'
    document.content = ObsidianLinksConverter.process_content(document.content, document.site)
  end
end 