class Client::RequestSerializer < ActiveModel::Serializer
  attributes :id, :status, :moving_date, :origin, :destination
end
