# frozen_string_literal: true
class BidirectionalLinksGenerator < Jekyll::Generator
  def generate(site)
    graph_nodes = []
    graph_edges = []

    all_notes = site.collections['notes'].docs
    all_pages = site.pages

    all_docs = all_notes + all_pages

    link_extension = !!site.config["use_html_extension"] ? '.html' : ''

    # Convert all Wiki/Roam-style double-bracket link syntax to plain HTML
    # anchor tag elements (<a>) with "internal-link" CSS class
    all_docs.each do |current_note|
      all_docs.each do |note_potentially_linked_to|
        note_title_regexp_pattern = Regexp.escape(
          File.basename(
            note_potentially_linked_to.basename,
            File.extname(note_potentially_linked_to.basename)
          )
        ).gsub('\_', '[ _]').gsub('\-', '[ -]').capitalize

        title_from_data = note_potentially_linked_to.data['title']
        if title_from_data
          title_from_data = Regexp.escape(title_from_data)
        end

        new_href = "#{site.baseurl}#{note_potentially_linked_to.url}#{link_extension}"
        anchor_tag = "<a class='internal-link' href='#{new_href}'>\\1</a>"

        # Replace double-bracketed links with label using note title
        # [[A note about cats|this is a link to the note about cats]]
        current_note.content.gsub!(
          /\[\[#{note_title_regexp_pattern}\|(.+?)(?=\])\]\]/i,
          anchor_tag
        )

        # Replace double-bracketed links with label using note filename
        # [[cats|this is a link to the note about cats]]
        current_note.content.gsub!(
          /\[\[#{title_from_data}\|(.+?)(?=\])\]\]/i,
          anchor_tag
        )

        # Replace double-bracketed links using note title
        # [[a note about cats]]
        current_note.content.gsub!(
          /\[\[(#{title_from_data})\]\]/i,
          anchor_tag
        )

        # Replace double-bracketed links using note filename
        # [[cats]]
        current_note.content.gsub!(
          /\[\[(#{note_title_regexp_pattern})\]\]/i,
          anchor_tag
        )
      end

      # At this point, all remaining double-bracket-wrapped words are
      # pointing to non-existing pages, so let's turn them into disabled
      # links by greying them out and changing the cursor
      current_note.content = current_note.content.gsub(
        /\[\[([^\]]+)\]\]/i, # match on the remaining double-bracket links
        <<~HTML.delete("\n") # replace with this HTML (\\1 is what was inside the brackets)
          <span title='There is no note that matches this link.' class='invalid-link'>
            <span class='invalid-link-brackets'>[[</span>
            \\1
            <span class='invalid-link-brackets'>]]</span></span>
        HTML
      )
    end

    # Combine all documents (notes, pages, topics) to process for node graph
    all_docs_for_graph = all_notes + all_pages + site.collections['topics'].docs

    # Generate graph nodes for all included document types
    all_docs_for_graph.each do |current_doc|
      # Skip the index note itself if it exists in _notes folder
      next if current_doc.path.include?('_notes/index.html')

      graph_nodes << {
        id: note_id_from_doc(current_doc), # Use a generic ID function
        path: "#{site.baseurl}#{current_doc.url}#{link_extension}",
        label: current_doc.data['title'],
        # Add excerpt only if it exists (mainly for notes), otherwise empty string
        excerpt: (current_doc.data['excerpt']&.to_s&.strip || '') 
      }
    end

    # Identify note backlinks (only processing notes for backlink data)
    all_notes.each do |current_note|
      # Nodes: Jekyll (already done above for graph)
      notes_linking_to_current_note = all_notes.filter do |e|
        e.url != current_note.url && e.content.include?(current_note.url)
      end

      # Edges: Jekyll
      current_note.data['backlinks'] = notes_linking_to_current_note

      # Edges: Graph
      notes_linking_to_current_note.each do |n|
        graph_edges << {
          source: note_id_from_doc(n), # Use generic ID function
          target: note_id_from_doc(current_note), # Use generic ID function
        }
      end
    end

    # Add edges based on tags
    all_topics = site.collections['topics'].docs
    all_topics.each do |topic|
      # Find notes tagged with this topic
      topic_tag = topic.data['title'] # Assuming title is the tag name
      unless topic_tag.nil?
        tagged_notes = all_notes.filter do |note|
          (note.data['tags'] || []).map(&:downcase).include?(topic_tag.downcase)
        end
        
        # Create edges from topic to tagged notes
        tagged_notes.each do |note|
          graph_edges << {
            source: note_id_from_doc(topic), # Topic is the source
            target: note_id_from_doc(note),  # Note is the target
          }
        end
      end
    end

    # Write to assets directory instead of _includes
    File.write('assets/notes_graph.json', JSON.dump({
      edges: graph_edges,
      nodes: graph_nodes,
    }))
  end

  # Updated function to handle notes, pages, topics
  def note_id_from_doc(doc)
    # Use path as a more reliable unique ID than title for pages/topics
    doc.path.bytes.join 
  end
end
