class Users::SessionsController < ApplicationController
  def create
    user = User.find_by_email(session_params[:email])

    if user && user.authenticate(session_params[:password])
      token = issue_token(user)
      render json: { user: UserSerializer.new(user), jwt: token }
    else
      render json: { error: "Incorrect username or password." }
    end
  end

  def show
    if logged_in?
      render json: current_user
    else
      render json: { error: "User is not logged in/could not be found." }
    end
  end

  def destroy
    if token.present?
      payload = decoded_token.first
      payload["exp"] = Time.now.to_i - 1
      new_token = JWT.encode(payload, jwt_key, "HS256")

      render json: {
               message: "Logout successful",
               token: new_token
             },
             status: :ok
    else
      render json: { error: "No token provided" }, status: :unprocessable_entity
    end
  rescue JWT::DecodeError => e
    render json: { error: "Invalid token" }, status: :unprocessable_entity
  end

  private

  def session_params
    params.require(:session).permit(:email, :password)
  end
end
