# This file should ensure the existence of records required to run the application in every environment (production,
# development, test). The code here should be idempotent so that it can be executed at any point in every environment.
# The data can then be loaded with the bin/rails db:seed command (or created alongside the database with db:setup).
#
# Example:
#
#   ["Action", "Comedy", "Drama", "Horror"].each do |genre_name|
#     MovieGenre.find_or_create_by!(name: genre_name)
#   end

User.create!(
  first_name: "Aurel",
  last_name: "Busuioc",
  email: "frunza_sergiu@mail.ru",
  password: "111111",
  role: 1
)

# Create a user
User.create!(
  first_name: "Sergiu",
  last_name: "Frunza",
  email: "frunza.sergiu3@gmail.com",
  password: "111111",
  role: 0
)

Service.create!(name: "Local move", droppable_index: 0)

Packing.create!(
  name: "I will pack by myself",
  description:
    "<p class='text-sm font-semibold'><span style='font-family: Arial, Helvetica, sans-serif; color: rgb(0, 0, 0);'>This is the most budget friendly option.</span></p><p class='text-sm font-normal mt-2'><span style='font-family: Arial, Helvetica, sans-serif; color: rgb(0, 0, 0);'>We expect customer to empty all the drawers of all the furniture and pack all personal and miscellaneous items into standard moving size boxes or crates.</span></p><p class='text-sm font-normal mt-2'><span style='font-family: Arial, Helvetica, sans-serif; color: rgb(0, 0, 0);'>Our movers will disassemble furniture, if necessary, such as beds, tables etc. and reassemble at the new address.</span></p><p class='text-sm font-semibold mt-2'><span style='font-family: Arial, Helvetica, sans-serif; color: rgb(0, 0, 0);'>We will provide furniture pads, shrink wrap, mattress covers, as part of the hourly rate so there is no extra charge for furniture wrapping materials.</span></p>",
  labor_increase: 0,
  droppable_index: 0,
  is_default: true
)

Request.create!(service_id: 1, customer_id: 2)
