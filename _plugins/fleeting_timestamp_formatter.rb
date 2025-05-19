Jekyll::Hooks.register :fleeting, :pre_render do |doc|
  doc.content = doc.content.gsub(/^([0-9]{1,2}:[0-9]{2}) -\s*(.*)\$/m) do
    time = Regexp.last_match(1)
    text = Regexp.last_match(2)
    "<p class=\"fleeting-entry\" data-time=\"#{time}\">#{text}</p>"
  end
end