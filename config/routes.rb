Rails.application.routes.draw do
  mount ActionCable.server => "/cable"

  resources :packings
  resources :services
  post "/auth/login", to: "users/sessions#create"
  get "/auth/authorized", to: "users/sessions#show"
  delete "/auth/logout", to: "users/sessions#destroy"

  namespace :api do
    namespace :v1 do
      # scope path: "client/:user_id",
      #       constraints: RoleConstraint.new("customer") do
      #   resources :requests, only: %i[index show update destroy]
      # end

      resources :users do
        patch "update_password", to: "users#update_password"
      end
      resources :client_requests, only: %i[index show]
      # resources :users

      resources :services
      post "/services/update_order", to: "services#update_order"

      resources :packings
      post "/packings/update_order", to: "packings#update_order"

      get "/requests/status_counts", to: "requests#status_counts"

      resources :requests do
        get "/versions", to: "requests#show_versions"
      end

      # resources :client_requests

      get "/auth/authorized", to: "users/sessions#show"
    end
  end

  get "up" => "rails/health#show", :as => :rails_health_check

  get "*path",
      to: "fallback#index",
      constraints: ->(request) { !request.xhr? && request.format.html? }
end
