# User Constroller
class Api::V1::UsersController < ApplicationController
  before_action :authenticate_user!
  before_action :set_user, only: %i[show update update_password destroy]

  # GET /users
  def index
    @users = User.all
    render json: @users
  end

  # GET /users/1
  def show
    if @user.present?
      render json: @user
    else
      render json: { error: "User could not be found." }
    end
  end

  # POST /users
  def create
    user = User.new(user_params)
    puts "User Params: #{user_params}"

    if user.save
      token = issue_token(user)
      render json: { user: UserSerializer.new(user), jwt: token }
    elsif user.errors.messages
      render json: { error: user.errors.messages }
    else
      render json: { error: "User could not be created. Please try again." }
    end
  end

  # PATCH/PUT /users/1
  def update
    # puts "User Params: #{user_params}"
    if @user.update(user_params)
      render json: @user
    else
      render json: @user.errors, status: :unprocessable_entity
    end
  end

  def update_password
    if @user.update(password: params[:password])
      render json: { message: "Password updated successfully" }, status: :ok
    else
      render json: {
               error: user.errors.full_messages
             },
             status: :unprocessable_entity
    end
  end

  # DELETE /users/1
  def destroy
    @user.destroy!
  end

  private

  def set_user
    @user = User.find(params[:id])
  end

  def authenticate_user!
    @token = request.headers["Authorization"]&.split(" ")&.last

    if token.present?
      begin
        decoded_token = JWT.decode(token, jwt_key, "HS256")
        user_id = decoded_token.first["user_id"]
        @current_user = User.find(user_id)
      rescue JWT::DecodeError, ActiveRecord::RecordNotFound
        render json: { error: "Unauthorized" }, status: :unauthorized
      end
    else
      render json: { error: "Missing token" }, status: :unprocessable_entity
    end
  end

  # Only allow a list of trusted parameters through.
  def user_params
    params.require(:user).permit(
      :first_name,
      :last_name,
      :email,
      :phone,
      :add_phone,
      :role,
      :password
    )
  end
end
