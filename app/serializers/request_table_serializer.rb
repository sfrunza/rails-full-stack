class RequestTableSerializer < ActiveModel::Serializer
  attributes :id,
             :moving_date,
             :status,
             :size,
             :service,
             :packing,
             :customer,
             :origin,
             :destination,
             :stops,
             :work_time,
             :travel_time,
             :crew_size,
             :rate,
             :created_at,
             :updated_at
  #  def customer
  #    {
  #      first_name: object.customer&.first_name,
  #      last_name: object.customer&.last_name,
  #      phone: object.customer&.phone
  #    }
  #  end
  def service
    { name: object.service&.name }
  end
end
