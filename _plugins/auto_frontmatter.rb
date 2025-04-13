Jekyll::Hooks.register :site, :pre_render do |site|
  # Process all notes
  site.collections['notes'].docs.each do |document|
    # Skip if the document is already processed
    next if document.data['processed_by_plugin']
    
    # Get the filename without extension
    filename = File.basename(document.path, '.*')
    
    # Set default front matter if not already set
    document.data['title'] ||= filename.gsub('-', ' ').gsub('_', ' ').capitalize
    document.data['last_modified_at'] ||= File.mtime(document.path)
    document.data['last_modified_at_timestamp'] ||= File.mtime(document.path).to_i
    
    # Extract tags from content
    content = document.content
    hashtags = content.scan(/#([a-zA-Z0-9]+)/).flatten.uniq
    document.data['tags'] ||= []
    document.data['tags'] += hashtags unless hashtags.empty?
    document.data['tags'].uniq!
    
    # Mark as processed
    document.data['processed_by_plugin'] = true
  end
end 