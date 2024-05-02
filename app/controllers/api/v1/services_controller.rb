class Api::V1::ServicesController < ApplicationController
  before_action :authenticate_user!,
                only: %i[create update destroy update_order]
  before_action :set_service, only: %i[show update destroy]

  # GET /services
  def index
    @services = Service.all.order(:droppable_index)

    render json: @services
  end

  # GET /services/1
  def show
    service = Service.find(params[:id])
    if service
      render json: service
    else
      render json: { error: "Service could not be found." }
    end
  end

  def update_order
    services = params[:services]

    services.each do |service|
      s = Service.find(service["id"])
      s.droppable_index = service["droppable_index"].to_i
      s.name = service["name"]
      s.save
    end
    render json: { success: "Changes saved." }, status: :accepted
  end

  # POST /services
  def create
    service = Service.new(service_params)

    if service.save
      render json: { success: "Service added.", service: service }
    elsif service.errors.messages
      render json: { error: service.errors.messages }
    else
      render json: { error: "Service could not be created. Please try again." }
    end
  end

  # PATCH/PUT /services/1
  def update
    if @service.update(service_params)
      render json: @service
    else
      render json: @service.errors, status: :unprocessable_entity
    end
  end

  # DELETE /services/1
  def destroy
    @service.destroy!
    render json: { success: "Service successfully deleted." }, status: :accepted
  end

  private

  def set_service
    @service = Service.find(params[:id])
  end
  def authenticate_user!
    @token = request.headers["Authorization"]&.split(" ")&.last

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

  # Only allow a list of trusted parameters through.
  def service_params
    params.require(:service).permit(:name, :droppable_index)
  end
end
