Rails.application.routes.draw do
  mount ActionCable.server => "/cable"

  resources :packings
  resources :services
  post "/auth/login", to: "users/sessions#create"
  get "/auth/authorized", to: "users/sessions#show"
  delete "/auth/logout", to: "users/sessions#destroy"

  namespace :api do
    namespace :v1 do
      resources :users do
        patch "update_password", on: :member
      end

      resources :client_requests, only: %i[index show]

      resources :services do
        post "update_order", on: :collection
      end

      resources :packings do
        post "update_order", on: :collection
      end

      resources :trucks do
        post "bulk_update", on: :collection
      end

      get "trucks/requests/:date", to: "trucks#requests_by_date"
      get "parklots/trucks", to: "parklots#trucks"
      get "parklots/requests", to: "parklots#requests_by_date"

      resources :requests do
        post "pair", on: :member
        get "versions", on: :member
        get "status_counts", on: :collection
      end
    end
  end

  get "up" => "rails/health#show", :as => :rails_health_check

  get "*path",
      to: "fallback#index",
      constraints: ->(request) { !request.xhr? && request.format.html? }
end
