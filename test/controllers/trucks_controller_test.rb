require "test_helper"

class TrucksControllerTest < ActionDispatch::IntegrationTest
  setup do
    @truck = trucks(:one)
  end

  test "should get index" do
    get trucks_url, as: :json
    assert_response :success
  end

  test "should create truck" do
    assert_difference("Truck.count") do
      post trucks_url, params: { truck: { name: @truck.name } }, as: :json
    end

    assert_response :created
  end

  test "should show truck" do
    get truck_url(@truck), as: :json
    assert_response :success
  end

  test "should update truck" do
    patch truck_url(@truck), params: { truck: { name: @truck.name } }, as: :json
    assert_response :success
  end

  test "should destroy truck" do
    assert_difference("Truck.count", -1) do
      delete truck_url(@truck), as: :json
    end

    assert_response :no_content
  end
end
