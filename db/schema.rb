# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema[7.1].define(version: 2024_06_27_202304) do
  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "audits", force: :cascade do |t|
    t.integer "auditable_id"
    t.string "auditable_type"
    t.integer "associated_id"
    t.string "associated_type"
    t.integer "user_id"
    t.string "user_type"
    t.string "username"
    t.string "action"
    t.jsonb "audited_changes"
    t.integer "version", default: 0
    t.string "comment"
    t.string "remote_address"
    t.string "request_uuid"
    t.datetime "created_at"
    t.index ["associated_type", "associated_id"], name: "associated_index"
    t.index ["auditable_type", "auditable_id", "version"], name: "auditable_index"
    t.index ["created_at"], name: "index_audits_on_created_at"
    t.index ["request_uuid"], name: "index_audits_on_request_uuid"
    t.index ["user_id", "user_type"], name: "user_index"
  end

  create_table "packings", force: :cascade do |t|
    t.string "name"
    t.text "description"
    t.boolean "is_default", default: false
    t.integer "labor_increase"
    t.integer "droppable_index"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "requests", force: :cascade do |t|
    t.bigint "service_id", null: false
    t.bigint "packing_id", default: 1, null: false
    t.datetime "moving_date"
    t.string "status", default: "Pending", null: false
    t.string "size"
    t.integer "start_time_window"
    t.integer "end_time_window"
    t.integer "customer_id"
    t.jsonb "work_time", default: {"max"=>0, "min"=>0}
    t.jsonb "total_time", default: {"max"=>0, "min"=>0}
    t.jsonb "total_price", default: {"max"=>0, "min"=>0}
    t.integer "travel_time", default: 0
    t.integer "min_total_time", default: 120
    t.integer "crew_size"
    t.boolean "can_edit_request", default: true
    t.integer "rate"
    t.jsonb "stops", default: []
    t.text "sales_notes"
    t.text "driver_notes"
    t.text "customer_notes"
    t.text "dispatch_notes"
    t.integer "deposit", default: 10000
    t.boolean "is_moving_from_storage", default: false
    t.integer "paired_request_id"
    t.jsonb "details", default: {"comments"=>"", "bulky_items_question_answer"=>"", "delicate_items_question_answer"=>"", "disassemble_items_question_answer"=>""}
    t.jsonb "origin", default: {"apt"=>"", "zip"=>"", "city"=>"", "floor"=>"", "state"=>"", "street"=>"", "location"=>{"lat"=>0, "lng"=>0}}
    t.jsonb "destination", default: {"apt"=>"", "zip"=>"", "city"=>"", "floor"=>"", "state"=>"", "street"=>"", "location"=>{"lat"=>0, "lng"=>0}}
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["packing_id"], name: "index_requests_on_packing_id"
    t.index ["service_id"], name: "index_requests_on_service_id"
  end

  create_table "requests_trucks", id: false, force: :cascade do |t|
    t.bigint "request_id", null: false
    t.bigint "truck_id", null: false
    t.index ["request_id", "truck_id"], name: "index_requests_trucks_on_request_id_and_truck_id"
    t.index ["truck_id", "request_id"], name: "index_requests_trucks_on_truck_id_and_request_id"
  end

  create_table "services", force: :cascade do |t|
    t.string "name"
    t.integer "droppable_index"
    t.boolean "is_default", default: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "trucks", force: :cascade do |t|
    t.string "name"
    t.boolean "is_active", default: true
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "users", force: :cascade do |t|
    t.string "first_name"
    t.string "last_name"
    t.string "email"
    t.string "phone"
    t.string "add_phone"
    t.integer "role", default: 0
    t.string "password_digest"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  add_foreign_key "requests", "packings"
  add_foreign_key "requests", "services"
  add_foreign_key "requests", "users", column: "customer_id"
end
