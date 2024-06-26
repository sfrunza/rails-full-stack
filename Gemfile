source "https://rubygems.org"

ruby "3.1.3"

# Bundle edge Rails instead: gem 'rails', github: 'rails/rails', branch: 'main'
gem "rails", "~> 7.1.2"

# Use postgresql as the database for Active Record
gem "pg", "~> 1.1"

# Use the Puma web server [https://github.com/puma/puma]
gem "puma", ">= 5.0"

# Build JSON APIs with ease [https://github.com/rails/jbuilder]
# gem 'jbuilder'

# Use Redis adapter to run Action Cable in production
# gem 'redis', '>= 4.0.1'

# Use Kredis to get higher-level data types in Redis [https://github.com/rails/kredis]
# gem 'kredis'

# Use Active Model has_secure_password [https://guides.rubyonrails.org/active_model_basics.html#securepassword]
gem "bcrypt", "~> 3.1.7"

# Windows does not include zoneinfo files, so bundle the tzinfo-data gem
gem "tzinfo-data", platforms: %i[windows jruby]

# Reduces boot times through caching; required in config/boot.rb
gem "bootsnap", require: false

# Use Active Storage variants [https://guides.rubyonrails.org/active_storage_overview.html#transforming-images]
# gem 'image_processing', '~> 1.2'

# Use Rack CORS for handling Cross-Origin Resource Sharing (CORS), making cross-origin Ajax possible
gem "rack-cors"

gem "email_validator", require: "email_validator/strict"

gem "jwt", "~> 2.8", ">= 2.8.1"

gem "active_model_serializers", "~> 0.10.14"
gem "jsonapi-serializer"

gem "figaro", "~> 1.2"

gem "mail_form", "~> 1.10", ">= 1.10.1"

gem "carrierwave-aws", "~> 1.6"

gem "carrierwave", "~> 3.0", ">= 3.0.7"

gem "foreman", "~> 0.87.2"

gem "syntax_tree", "~> 6.2"

gem "audited"

group :development, :test do
  # See https://guides.rubyonrails.org/debugging_rails_applications.html#debugging-with-the-debug-gem
  gem "debug", platforms: %i[mri windows]
end

group :development do
  # Speed up commands on slow machines / big apps [https://github.com/rails/spring]
  # gem 'spring'
  gem "ruby-lsp", require: false

  gem "error_highlight", ">= 0.4.0", platforms: [:ruby]
end

gem "dockerfile-rails", ">= 1.6", group: :development

gem "redis", "~> 5.2"
