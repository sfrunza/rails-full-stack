class User < ApplicationRecord
  enum role: { customer: 0, admin: 1, foreman: 2, mover: 3 }

  has_secure_password

  validates :first_name, presence: { message: "First name field is empty." }
  validates :last_name, presence: { message: "Last name field is empty." }
  validates :email,
            uniqueness: {
              message: "This email is already registered."
            },
            email: true

  has_many :requests, foreign_key: "customer_id"

  audited
  has_associated_audits
end
