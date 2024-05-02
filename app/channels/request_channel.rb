class RequestChannel < ApplicationCable::Channel
  def subscribed
    # stream_from "some_channel"
    stream_from "request_#{params[:request_id]}"
  end

  def unsubscribed
    # Any cleanup needed when channel is unsubscribed
    stop_all_streams
  end

  def received(data, options)
    # Handle received data here
    ActionCable.server.broadcast("request_#{params[:request_id]}", data)
  end
end
