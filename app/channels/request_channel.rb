class RequestChannel < ApplicationCable::Channel
  def subscribed
    stream_from "request_#{params[:request_id]}"
  end

  def unsubscribed
    stop_all_streams
  end

  def received(data, options)
    request = Request.find(data["request_id"])
    updated_fields = request.updated_fields

    ActionCable.server.broadcast(
      "request_#{data["request_id"]}",
      updated_fields
    )
  end
end
