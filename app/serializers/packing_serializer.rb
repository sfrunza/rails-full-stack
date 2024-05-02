class PackingSerializer < ActiveModel::Serializer
  attributes :id, :name, :description, :is_default, :labor_increase, :droppable_index
end
