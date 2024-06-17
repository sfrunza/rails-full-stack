class AuditLogSerializer < ActiveModel::Serializer
  attributes :id,
             :user_id,
             :auditable_id,
             :user,
             :action,
             :audited_changes,
             :created_at

  def user
    return { first_name: "System", last_name: "User" } if object.user.nil?
    { first_name: object.user.first_name, last_name: object.user.last_name }
  end
end
