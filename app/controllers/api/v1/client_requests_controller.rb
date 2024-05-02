class Api::V1::ClientRequestsController < ApplicationController
  before_action :authenticate_user!
  before_action :set_request, only: %i[show]
  before_action :authorize_request_access, only: %i[show]

  # GET /api/v1/users/:user_id/client_requests
  def index
    puts "Current User: #{current_user}"
    if current_user
      @requests = current_user.requests
      render json: @requests, each_serializer: Client::RequestSerializer
    else
      render json: { error: "Unauthorized" }, status: :unauthorized
    end
  end

  # GET /api/v1/users/:user_id/client_requests/:id
  def show
    render json: @request, include: :service
  end

  private

  def authenticate_user!
    @token = request.headers["Authorization"]&.split(" ")&.last

    puts "Token: #{@token}"

    if token.present?
      begin
        decoded_token = JWT.decode(token, jwt_key, "HS256")
        user_id = decoded_token.first["user_id"]
        @current_user = User.find(user_id)
      rescue JWT::DecodeError, ActiveRecord::RecordNotFound
        render json: { error: "Unauthorized" }, status: :unauthorized
      end
    else
      render json: { error: "Missing token" }, status: :unprocessable_entity
    end
  end

  def set_request
    @request = Request.find(params[:id])
  rescue ActiveRecord::RecordNotFound
    render json: { error: "Request not found" }, status: :not_found
  end

  def authorize_request_access
    unless current_user && current_user.requests.exists?(id: @request.id)
      render json: { error: "Unauthorized" }, status: :unauthorized
    end
  end

  # def set_request
  #   if current_user
  #     @request = current_user.requests.find(params[:id])
  #   rescue ActiveRecord::RecordNotFound
  #     render json: { error: 'Request not found' }, status: :not_found
  #   else
  #     render json: { error: "Unauthorized" }, status: :unauthorized
  #   end
  # end
end
