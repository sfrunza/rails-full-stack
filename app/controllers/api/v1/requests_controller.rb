class Api::V1::RequestsController < ApplicationController
  # before_action :authenticate_user!
  before_action :set_request, only: %i[show update destroy show versions pair]
  before_action :check_permission, only: %i[destroy]

  # GET /requests?filter=all&page=1
  def index
    filter = params[:filter]
    per_page = 20
    page = params[:page].to_i || 1
    offset = (page - 1) * per_page

    if params[:filter] === "all"
      requests = Request.limit(per_page).offset(offset).order("id desc")
      total_pages = (Request.count.to_f / per_page).ceil
    elsif filter == "Pending" || filter == "Pending-info"
      requests =
        Request
          .where(status: %w[Pending Pending-info])
          .limit(per_page)
          .offset(offset)
          .order("id desc")
      total_pages =
        (
          Request.where(status: %w[Pending Pending-info]).count.to_f / per_page
        ).ceil
    elsif filter.present?
      requests =
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
                 requests,
                 each_serializer: RequestTableSerializer
               ),
             total_pages: total_pages
           }
  end

  # GET /requests/status_counts
  def status_counts
    status_counts =
      Request.group(
        "CASE WHEN status = 'Pending-info' THEN 'Pending' ELSE status END"
      ).count
    status_data = {
      all: Request.count,
      Pending: status_counts["Pending" || "Pending-info"] || 0,
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
    render json: @request, serializer: RequestSerializer, user: @current_user
  rescue ActiveRecord::RecordNotFound
    render json: { error: "Request not found" }, status: :not_found
  end

  # GET /requests/1/versions
  def versions
    # request = Request.find(params[:id])
    # versions = @request.audits.order("id desc")

    versions =
      Audited.audit_class.where(auditable_id: params[:id]).order("id desc")

    render json: versions, each_serializer: AuditLogSerializer
  end

  # POST /requests
  def create
    # request = Request.new(request_params)
    request = Request.new(request_params.except(:id))

    if request.save
      if request.paired_request_id.present?
        paired_request = Request.find(request.paired_request_id)
        unless paired_request.paired_request_id == request.id
          paired_request.update(paired_request_id: request.id)
        end
      end
      serialized_request = RequestSerializer.new(request)
      ActionCable.server.broadcast("request_#{params[:id]}", serialized_request)
      render json: { success: "Request created", request: request }
    elsif request.errors.messages
      render json: { error: request.errors.messages }
    else
      render json: { error: "Request could not be created. Please try again." }
    end
  end

  # PATCH/PUT /requests/1
  def update
    old_truck_ids = @request.truck_ids

    if @request.update(request_params)
      @request.update_status_if_needed(current_user.role)
      new_truck_ids = params[:request][:truck_ids]
      @request.update_trucks(new_truck_ids) if new_truck_ids.present?

      updated_fields = @request.updated_fields
      updated_fields =
        @request.updated_fields.merge(
          truck_ids: new_truck_ids
        ) if new_truck_ids.present?

      ActionCable.server.broadcast("request_#{params[:id]}", updated_fields)
      # render json: @request, serializer: RequestSerializer
      render json: {
               success: "Request saved",
               request:
                 ActiveModelSerializers::SerializableResource.new(
                   @request,
                   serializer: RequestSerializer
                 )
             }
    else
      render json: @request.errors, status: :unprocessable_entity
    end
  end

  # DELETE /requests/1
  def destroy
    @request.destroy!
    render json: { success: "Request successfully deleted." }, status: :accepted
  end

  # POST /api/v1/requests/:id/pair
  def pair
    paired_request = Request.find(params[:paired_request_id])
    if @request.pair_with(paired_request)
      updated_fields = @request.updated_fields

      ActionCable.server.broadcast("request_#{params[:id]}", updated_fields)
      render json: @request, serializer: RequestSerializer
    else
      render json: @request.errors, status: :unprocessable_entity
    end
  end

  private

  def set_request
    @request = Request.find(params[:id])
  rescue ActiveRecord::RecordNotFound
    render json: { error: "Request not found" }, status: :not_found
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
      :customer,
      :moving_date,
      :status,
      :size,
      :start_time_window,
      :end_time_window,
      :crew_size,
      :rate,
      :sales_notes,
      :driver_notes,
      :customer_notes,
      :dispatch_notes,
      :deposit,
      :travel_time,
      :min_total_time,
      :can_edit_request,
      :paired_request_id,
      :is_moving_from_storage,
      work_time: %i[min max],
      total_time: %i[min max],
      total_price: %i[min max],
      details: %i[
        delicate_items_question_answer
        bulky_items_question_answer
        disassemble_items_question_answer
        comments
      ],
      origin: permit_nested_location_params_with_location,
      destination: permit_nested_location_params_with_location,
      stops: [
        :street,
        :city,
        :state,
        :zip,
        :floor,
        :apt,
        :isPickup,
        :isDropoff,
        location: %i[lat lng] # Permit nested location attributes
      ],
      truck_ids: []
    )
  end

  def permit_nested_location_params
    %i[street city state zip apt floor]
  end

  # Permit nested location attributes with lat/lng within destination
  def permit_nested_location_params_with_location
    permit_nested_location_params + [location: %i[lat lng]]
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
