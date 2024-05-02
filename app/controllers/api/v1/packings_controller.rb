class Api::V1::PackingsController < ApplicationController
  before_action :authenticate_user!,
                only: %i[create update destroy update_order]
  before_action :set_packing, only: %i[show update destroy]

  # GET /packings
  def index
    @packings = Packing.all.order(:droppable_index)

    render json: @packings
  end

  # GET /packings/1
  def show
    packing = Packing.find(params[:id])
    if packing
      render json: packing
    else
      render json: { error: "Packing could not be found." }
    end
  end

  def update_order
    packings = params[:packings]

    packings.each do |packing|
      s = Packing.find(packing["id"])
      s.droppable_index = packing["droppable_index"].to_i
      s.save
    end
    render json: { success: "Changes saved." }, status: :accepted
  end

  # POST /packings
  def create
    packing = Packing.new(packing_params)

    if packing.save
      render json: { success: "Packing added.", packing: packing }
    elsif packing.errors.messages
      render json: { error: packing.errors.messages }
    else
      render json: { error: "Packing could not be created. Please try again." }
    end
  end

  # PATCH/PUT /packings/1
  def update
    if @packing.update(packing_params)
      render json: { success: "Packing updated.", packing: @packing }
    else
      render json: @packing.errors, status: :unprocessable_entity
    end
  end

  # DELETE /packings/1
  def destroy
    @packing.destroy!
    render json: { success: "Packing successfully deleted." }, status: :accepted
  end

  private

  def set_packing
    @packing = Packing.find(params[:id])
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
  def packing_params
    params.require(:packing).permit(
      :name,
      :description,
      :is_default,
      :labor_increase,
      :droppable_index
    )
  end
end
