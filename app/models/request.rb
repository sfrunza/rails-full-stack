class Request < ApplicationRecord
  audited

  belongs_to :service
  belongs_to :packing
  belongs_to :customer, class_name: "User", optional: true
  belongs_to :paired_request, class_name: "Request", optional: true
  has_and_belongs_to_many :trucks

  before_save :calculate_total_time
  before_save :calculate_total_price
  before_save :update_can_edit_request

  def editable_by?(user)
    return true if user.role == "admin"
  end

  public

  def update_trucks(new_truck_ids)
    self.truck_ids = new_truck_ids
  end

  def updated_fields
    changed_fields = {}
    previous_changes.each do |field, values|
      changed_fields[field] = values.last
    end

    changed_fields
  end

  def update_status_if_needed(current_user_role)
    if current_user_role == "customer" && status_was == "Not Confirmed" &&
         status != "Confirmed"
      update(status: "Pending-info")
    end
  end

  # Ensure bidirectional pairing
  def pair_with(other_request)
    self.update!(paired_request: other_request, is_moving_from_storage: true)
    other_request.update!(paired_request: self, is_moving_from_storage: false)
  end

  private

  def update_can_edit_request
    self.can_edit_request =
      (
        status == "Pending" || status == "Pending-info" ||
          status == "Not Confirmed"
      )
  end

  def calculate_total_time
    min_total_time = self.min_total_time.to_i
    travel_time_minutes = travel_time.to_i
    work_time_min_minutes = work_time["min"].to_i
    work_time_max_minutes = work_time["max"].to_i

    # Calculate total time in minutes
    total_minutes_min = [
      min_total_time,
      travel_time_minutes + work_time_min_minutes
    ].max
    total_minutes_max = travel_time_minutes + work_time_max_minutes

    # If work_time['max'] is 0, set total_time['max'] to 0
    total_minutes_max = 0 if total_minutes_max <= min_total_time

    # Ensure total_minutes_max is at least min_total_time minutes
    # total_minutes_max = [total_minutes_max, min_total_time].max

    self.total_time = { min: total_minutes_min, max: total_minutes_max }
  end

  def calculate_total_price
    if self.service.name == "Flat Rate"
      # For requests with a Flat Price type, set total_price directly to the rate
      self.total_price = { min: rate, max: rate }
    elsif total_time.present? && total_time.is_a?(Hash) && rate.present?
      # Convert total_time from minutes to hours (divide by 60)
      total_time_hours_min = total_time["min"] / 60.0
      total_time_hours_max = total_time["max"] / 60.0

      # Calculate total_price based on total_time in hours and rate per hour
      min_price = total_time_hours_min * rate
      max_price = total_time_hours_max * rate

      self.total_price = { min: min_price, max: max_price }
    else
      # Default to zero price if total_time or rate is missing or invalid
      self.total_price = { min: 0, max: 0 }
    end
  end
end
