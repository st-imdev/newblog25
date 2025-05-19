Jekyll::Hooks.register [:fleeting], :pre_render do |doc|
  doc.content = doc.content.gsub(/^([0-9]{1,2}:[0-9]{2}) -\s*(.*)$/m) do
    time = Regexp.last_match(1)
    text = Regexp.last_match(2)
    
    # Extract and process categories/tags if present
    category = ''
    if text =~ /#(\w+)/
      tag_name = $1
      category = " data-category=\"#{tag_name}\""
    end
    
    # Try to determine if this is a link entry
    is_link = (text.include?('http://') || text.include?('https://'))
    link_class = is_link ? " link-entry" : ""
    
    # Create the appropriate HTML
    "<p class=\"fleeting-entry#{link_class}\" data-time=\"#{time}\"#{category}>#{text}</p>"
  end
end