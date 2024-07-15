class TruckSerializer < ActiveModel::Serializer
  attributes :id, :name, :is_active
  has_many :requests, serializer: RequestSerializer
end
