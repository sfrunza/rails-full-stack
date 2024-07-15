class RequestSerializer < ActiveModel::Serializer
  attributes :id,
             :moving_date,
             :status,
             :size,
             :start_time_window,
             :end_time_window,
             :service_id,
             :packing_id,
             :customer_id,
             :customer,
             :origin,
             :destination,
             :stops,
             :work_time,
             :travel_time,
             :total_time,
             :total_price,
             :min_total_time,
             :details,
             :crew_size,
             :rate,
             :sales_notes,
             :driver_notes,
             :customer_notes,
             :dispatch_notes,
             :deposit,
             :can_edit_request,
             :paired_request_id,
             :paired_request,
             :is_moving_from_storage,
             :truck_ids,
             :created_at,
             :updated_at

  has_one :paired_request

  def customer
    {
      id: object.customer&.id,
      first_name: object.customer&.first_name,
      last_name: object.customer&.last_name,
      email: object.customer&.email,
      phone: object.customer&.phone,
      add_phone: object.customer&.add_phone
    }
  end
end
