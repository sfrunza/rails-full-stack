class Api::V1::TrucksController < ApplicationController
  # before_action :set_truck, only: %i[show update destroy]
  before_action :authenticate_user!, only: %i[create update destroy bulk_update]
  before_action :set_packing, only: %i[show update destroy]

  # GET /trucks
  def index
    @trucks = Truck.all.order(:id)

    render json: @trucks.as_json
  end

  def requests_by_date
    date = params[:date].to_date

    requests = Request.where(moving_date: date.all_day)

    trucks =
      Truck
        .joins(:requests)
        .where(requests: { moving_date: date.all_day })
        .distinct

    render json: requests, each_serializer: RequestSerializer
  end

  # GET /trucks/1
  def show
    render json: @truck
  end

  # POST /trucks
  def create
    truck = Truck.new(truck_params)

    if truck.save
      render json: { success: "Truck added", truck: truck }
    elsif truck.errors.messages
      render json: { error: truck.errors.messages }
    else
      render json: { error: "Truck could not be created. Please try again." }
    end
  end

  # PATCH/PUT /trucks/1
  def update
    if @truck.update(truck_params)
      render json: { success: "Truck updated", truck: @truck }
    else
      render json: @truck.errors, status: :unprocessable_entity
    end
  end

  # POST /trucks/bulk_update
  def bulk_update
    trucks = params[:trucks]
    trucks.each do |truck|
      t = Truck.find(truck["id"])
      t.name = truck["name"]
      t.is_active = truck["is_active"]
      t.save
    end
    render json: { success: "Changes saved" }, status: :accepted
  end

  # DELETE /trucks/1
  def destroy
    @truck.destroy!
  end

  private

  def set_truck
    @truck = Truck.find(params[:id])
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
  def truck_params
    params.require(:truck).permit(:name)
  end
end
