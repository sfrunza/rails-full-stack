class Api::V1::RequestsController < ApplicationController
  before_action :authenticate_user!
  before_action :set_request, only: %i[show update destroy]
  before_action :check_permission, only: %i[destroy]

  # GET /requests
  def index
    filter = params[:filter]
    per_page = 20
    page = params[:page].to_i || 1
    offset = (page - 1) * per_page

    if params[:filter] === "all"
      @requests = Request.limit(per_page).offset(offset).order("id desc")
      total_pages = (Request.count.to_f / per_page).ceil
    else
      @requests =
        Request
          .where(status: filter)
          .limit(per_page)
          .offset(offset)
          .order("id desc")
      total_pages = (Request.where(status: filter).count.to_f / per_page).ceil
    end

    render json: {
             requests:
               ActiveModelSerializers::SerializableResource.new(
                 @requests,
                 each_serializer: RequestTableSerializer
               ),
             total_pages: total_pages
           }
  end

  def status_counts
    status_counts = Request.group(:status).count
    status_data = {
      all: Request.count,
      Pending: status_counts["Pending"] || 0,
      Confirmed: status_counts["Confirmed"] || 0,
      "Not Confirmed": status_counts["Not Confirmed"] || 0,
      Canceled: status_counts["Canceled"] || 0,
      Completed: status_counts["Completed"] || 0,
      "Not Available": status_counts["Not Available"] || 0,
      Expired: status_counts["Expired"] || 0,
      Spam: status_counts["Spam"] || 0
    }

    render json: status_data
  end

  # GET /requests/1
  def show
    @request = request = Request.find(params[:id])
    render json: @request, serializer: RequestSerializer, user: @current_user
    #  can_edit_request: can_edit_request(@request, user:@current_user)
  rescue ActiveRecord::RecordNotFound
    render json: { error: "Request not found" }, status: :not_found
  end

  # def update_order
  #   requests = params[:requests]

  #   requests.each do |request|
  #     s = Request.find(request["id"])
  #     s.droppable_index = request["droppable_index"].to_i
  #     s.name = request["name"]
  #     s.save
  #   end
  #   render json: { success: "Changes saved." }, status: :accepted
  # end

  # POST /requests
  def create
    request = Request.new(request_params)

    if request.save
      serialized_request = RequestSerializer.new(request)
      ActionCable.server.broadcast("request_#{params[:id]}", serialized_request)
      render json: { success: "Request created.", request: request }
    elsif request.errors.messages
      render json: { error: request.errors.messages }
    else
      render json: { error: "Request could not be created. Please try again." }
    end
  end

  # PATCH/PUT /requests/1
  def update
    @request = Request.joins(:service).find(params[:id])
    serialized_request = RequestSerializer.new(@request)
    if @request.update(request_params)
      ActionCable.server.broadcast("request_#{params[:id]}", serialized_request)
      render json: @request, serializer: RequestSerializer
    else
      render json: @request.errors, status: :unprocessable_entity
    end
  end

  # DELETE /requests/1
  def destroy
    @request.destroy!
    render json: { success: "Request successfully deleted." }, status: :accepted
  end

  private

  def set_request
    @request = Request.find(params[:id])
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
  def request_params
    params.require(:request).permit(
      :id,
      :service_id,
      :packing_id,
      :customer_id,
      :moving_date,
      :status,
      :size,
      :crew_size,
      :rate,
      :travel_time,
      origin: %i[street city state zip apt floor],
      destination: %i[street city state zip apt floor],
      work_time: %i[min max],
      total_time: %i[min max],
      total_price: %i[min max],
      details: %i[
        delicate_items_question_answer
        bulky_items_question_answer
        disassemble_items_question_answer
        comments
      ],
      stops: []
    )
  end

  def check_permission
    unless @request.editable_by?(@current_user)
      render json: {
               error: "You don't have permission to delete this request."
             },
             status: :forbidden
    end
  end
end
