class Truck < ApplicationRecord
  has_and_belongs_to_many :requests, serializer: RequestSerializer
end
