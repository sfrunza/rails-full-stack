class CreateUsers < ActiveRecord::Migration[7.1]
  def change
    create_table :users do |t|
      t.string :first_name
      t.string :last_name
      t.string :email
      t.string :phone
      t.string :add_phone
      t.integer :role, default: 0
      t.string :password_digest

      t.timestamps
    end
  end
end
