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
    request = Request.find(data["request_id"])
    updated_fields = request.updated_fields

    # Handle received data here
    ActionCable.server.broadcast(
      "request_#{data["request_id"]}",
      updated_fields
    )
  end
end
