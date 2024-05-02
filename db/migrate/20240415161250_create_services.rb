class CreateServices < ActiveRecord::Migration[7.1]
  def change
    create_table :services do |t|
      t.string :name
      t.integer :droppable_index

      t.timestamps
    end
  end
end
