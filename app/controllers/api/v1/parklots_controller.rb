class Api::V1::ParklotsController < ApplicationController
  # before_action :authenticate_user!, only: %i[trucks requests_by_date]

  # GET /parklots/requests/:date
  def requests_by_date
    # date = params[:date].to_date

    # @requests = Request.where(moving_date: date.all_day)

    # render json: @requests, each_serializer: RequestSerializer

    date = params[:date].to_date

    trucks =
      Truck
        .joins(:requests)
        .where(requests: { moving_date: date.all_day })
        .distinct

    render json: trucks.to_json(include: :requests)
  end

  # GET /parklots/trucks
  def trucks
    @trucks = Truck.where(is_active: true).order(:id)

    render json: @trucks
  end

  private

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
end
