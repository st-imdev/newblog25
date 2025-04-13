module Jekyll
  class TagGenerator < Generator
    safe true

    def generate(site)
      # Get all unique tags from notes
      all_tags = []
      site.collections['notes'].docs.each do |note|
        if note.data['tags']
          # Handle both array tags and space-separated string tags
          tags = note.data['tags']
          if tags.is_a?(String)
            tags = tags.split
          end
          all_tags.concat(tags)
        end
      end
      all_tags.uniq!

      # Create a topic page for each tag if it doesn't exist
      all_tags.each do |tag|
        # Skip creation if topic page already exists
        topic_path = File.join(site.source, '_topics', "#{tag.downcase}.md")
        next if File.exist?(topic_path)

        # Create topic page
        topic_content = "---\n"
        topic_content += "title: #{tag.capitalize}\n"
        topic_content += "tag: #{tag}\n"
        topic_content += "layout: topic\n"
        topic_content += "---\n\n"
        topic_content += "Notes and essays related to #{tag.downcase}.\n"

        # Ensure directory exists
        FileUtils.mkdir_p(File.dirname(topic_path))
        
        # Write the file
        File.open(topic_path, 'w') { |f| f.write(topic_content) }
      end
    end
  end
end 