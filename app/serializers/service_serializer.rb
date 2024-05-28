class ServiceSerializer < ActiveModel::Serializer
  attributes :id, :name, :droppable_index, :is_default
end
