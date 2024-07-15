class CreateTrucks < ActiveRecord::Migration[7.1]
  def change
    create_table :trucks do |t|
      t.string :name
      t.boolean :is_active, default: true

      t.timestamps
    end
  end
end
