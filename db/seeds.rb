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

Service.create!(name: "Local move", droppable_index: 0, is_default: true)
Service.create!(name: "Flat Rate", droppable_index: 1, is_default: true)
Service.create!(name: "Loading help", droppable_index: 2, is_default: true)
Service.create!(name: "Unloading help", droppable_index: 3, is_default: true)
Service.create!(name: "Inside move", droppable_index: 4, is_default: true)
Service.create!(name: "Moving & Storage", droppable_index: 5, is_default: true)
Service.create!(
  name: "Overnight Truck Storage",
  droppable_index: 6,
  is_default: true
)

Packing.create!(
  name: "I will pack by myself",
  description:
    "<p class='text-sm font-semibold'><span style='font-family: Arial, Helvetica, sans-serif; color: rgb(0, 0, 0);'>This is the most budget friendly option.</span></p><p class='text-sm font-normal mt-2'><span style='font-family: Arial, Helvetica, sans-serif; color: rgb(0, 0, 0);'>We expect customer to empty all the drawers of all the furniture and pack all personal and miscellaneous items into standard moving size boxes or crates.</span></p><p class='text-sm font-normal mt-2'><span style='font-family: Arial, Helvetica, sans-serif; color: rgb(0, 0, 0);'>Our movers will disassemble furniture, if necessary, such as beds, tables etc. and reassemble at the new address.</span></p><p class='text-sm font-semibold mt-2'><span style='font-family: Arial, Helvetica, sans-serif; color: rgb(0, 0, 0);'>We will provide furniture pads, shrink wrap, mattress covers, as part of the hourly rate so there is no extra charge for furniture wrapping materials.</span></p>",
  labor_increase: 0,
  droppable_index: 0,
  is_default: true
)
Packing.create!(
  name: "I need Partial Packing Help",
  description:
    "<p class='text-sm font-normal'>Commonly during <span class='font-semibold'>Partial Packing Services</span>, our movers will pack kitchen, wall art, lamps and other fragile items. Customer expected to pack books, clothes and other non-fragile. However, this can be customized to your needs.</p><p class='text-sm font-semibold mt-2'>Our packing services are based on the same hourly rates as moving plus cost of packing supplies.</p><p class='text-sm font-normal mt-2'>Partial packing will normally add labor time. Average increase of <span class='font-semibold text-primary'>25%</span>.</p><p class='text-sm font-normal mt-2'><span class='font-semibold'>Please note,</span> that packing time can vary depending on quantity and complexity of boxes packed. Supplies will be charged based on the actual usage.</p><p class='text-sm font-normal mt-2'><span class='font-semibold mt-2'>For more accurate packing quote, please provide photos</span> of all rooms, closets and cabinets, that require packing help.</p>",
  labor_increase: 25,
  droppable_index: 1
)
Packing.create!(
  name: "I need Full Packing Service",
  description:
    "<p class='text-sm font-normal'>Commonly during <span class='font-semibold'>Full Packing Service,</span> our movers will pack for you all the miscellaneous items, including kitchen cabinets, closets, wall art, lamps and all personal belongings.</p><p class='text-sm font-normal font-semibold mt-2'>Our packing services are based on the same hourly rates as moving plus cost of packing supplies.</p><p class='text-sm font-normal mt-2'>Full packing will normally add labor time. Average increase of <span class='font-semibold text-primary'>75%</span>.</p><p class='text-sm font-normal mt-2'><span class='font-semibold'>Please note,</span> that packing time can vary depending on quantity and complexity of boxes packed. Supplies will be charged based on the actual usage.</p><p class='text-sm font-normal mt-2'><span class='font-semibold'>For more accurate packing quote, please provide photos</span> of all rooms, closets and cabinets, that require packing help.</p><p class='text-sm font-normal font-semibold mt-2'>Or contact our office to check, if we can schedule a FREE in-home estimate.</p>",
  labor_increase: 50,
  droppable_index: 2
)

Request.create!(service_id: 1, customer_id: 2)
