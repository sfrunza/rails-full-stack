class CreateRequests < ActiveRecord::Migration[7.1]
  def change
    create_table :requests do |t|
      t.references :service, null: false, foreign_key: true
      t.references :packing, null: false, foreign_key: true, default: 1
      t.datetime :moving_date
      t.string :status, null: false, default: "Pending"
      t.string :size
      t.integer :customer_id
      t.jsonb :work_time, default: { min: 0, max: 0 }
      t.jsonb :total_time, default: { min: 0, max: 0 }
      t.jsonb :total_price, default: { min: 0, max: 0 }
      t.integer :travel_time, default: 0
      t.integer :crew_size
      t.integer :rate
      t.jsonb :stops, default: []
      t.jsonb :details,
              default: {
                delicate_items_question_answer: "",
                bulky_items_question_answer: "",
                disassemble_items_question_answer: "",
                comments: ""
              }
      t.jsonb :origin,
              default: {
                street: "",
                city: "",
                state: "",
                zip: "",
                apt: "",
                floor: ""
              }
      t.jsonb :destination,
              default: {
                street: "",
                city: "",
                state: "",
                zip: "",
                apt: "",
                floor: ""
              }

      t.timestamps
    end
    add_foreign_key :requests, :users, column: :customer_id
  end
end
