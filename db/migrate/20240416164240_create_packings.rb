class CreatePackings < ActiveRecord::Migration[7.1]
  def change
    create_table :packings do |t|
      t.string :name
      t.text :description
      t.boolean :is_default, default: false
      t.integer :labor_increase
      t.integer :droppable_index

      t.timestamps
    end
  end
end
