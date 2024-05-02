class Users::AuthorizedController < ApplicationController
  def show
    if user_signed_in?
      render json: current_user
    else
      render json: { error: "User is not logged in/could not be found." }
    end
  end
end
