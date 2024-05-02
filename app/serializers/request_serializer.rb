class RequestSerializer < ActiveModel::Serializer
  attributes :id,
             :moving_date,
             :status,
             :size,
             #  :service,
             :service_id,
             #  :packing,
             :packing_id,
             #  :customer,
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
             :can_edit_request
  def customer
    {
      id: object.customer&.id,
      first_name: object.customer&.first_name,
      last_name: object.customer&.last_name,
      email: object.customer&.email,
      phone: object.customer&.phone
    }
  end

  def can_edit_request
    ["Pending", "Not Confirmed"].include?(object.status)
  end
end
