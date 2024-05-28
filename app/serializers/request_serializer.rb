class RequestSerializer < ActiveModel::Serializer
  attributes :id,
             :moving_date,
             :status,
             :size,
             #  :service,
             :service_id,
             #  :packing,
             :packing_id,
             :customer,
             :customer_id,
             :origin,
             :destination,
             :stops,
             :work_time,
             :travel_time,
             :total_time,
             :total_price,
             :details,
             :crew_size,
             :rate,
             :sales_notes,
             :driver_notes,
             :customer_notes,
             :dispatch_notes,
             :deposit,
             :can_edit_request,
             :created_at,
             :updated_at
  def customer
    {
      id: object.customer&.id,
      first_name: object.customer&.first_name,
      last_name: object.customer&.last_name,
      email: object.customer&.email,
      phone: object.customer&.phone,
      add_phone: object.customer&.add_phone,
      password: object.customer&.password_digest
    }
  end
end
