class Request < ApplicationRecord
  belongs_to :service
  belongs_to :packing
  belongs_to :customer, class_name: "User", optional: true

  before_save :calculate_total_time
  before_save :calculate_total_price

  def editable_by?(user)
    return true if user.role == "admin"
  end

  private

  # def calculate_total_time
  #   if work_time.present? && work_time.is_a?(Hash)
  #     min_time = work_time["min"].to_i + travel_time.to_i
  #     max_time = work_time["max"].to_i + travel_time.to_i

  #     self.total_time = { min: min_time, max: max_time }
  #   else
  #     self.total_time = { min: travel_time.to_i, max: travel_time.to_i }
  #   end
  # end
  #
  def calculate_total_time
    travel_time_minutes = travel_time.to_i
    work_time_min_minutes = work_time["min"].to_i
    work_time_max_minutes = work_time["max"].to_i

    # Calculate total time in minutes
    total_minutes_min = [120, travel_time_minutes + work_time_min_minutes].max
    total_minutes_max = travel_time_minutes + work_time_max_minutes

    # If work_time['max'] is 0, set total_time['max'] to 0
    total_minutes_max = 0 if total_minutes_max <= 120

    # Ensure total_minutes_max is at least 120 minutes
    # total_minutes_max = [total_minutes_max, 120].max

    self.total_time = { min: total_minutes_min, max: total_minutes_max }
  end

  # def calculate_total_price
  #   if total_time.present? && total_time.is_a?(Hash) && rate.present?
  #     # Convert total_time from minutes to hours (divide by 60)
  #     total_time_hours_min = total_time["min"] / 60.0
  #     total_time_hours_max = total_time["max"] / 60.0

  #     # Calculate total_price based on total_time in hours and rate per hour
  #     min_price = total_time_hours_min * rate
  #     max_price = total_time_hours_max * rate

  #     self.total_price = { min: min_price, max: max_price }
  #   else
  #     self.total_price = { min: 0, max: 0 }
  #   end
  # end
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
