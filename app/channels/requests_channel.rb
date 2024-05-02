class RequestsChannel < ApplicationCable::Channel
  def subscribed
    # stream_from "some_channel"
    stream_from "requests"
  end

  def unsubscribed
    # Any cleanup needed when channel is unsubscribed
    stop_all_streams
  end

  def received(data, options)
    # Handle received data here
    ActionCable.server.broadcast("requests", data)
  end
end
