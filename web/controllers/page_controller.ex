defmodule Microblog.PageController do
  use Microblog.Web, :controller

  def index(conn, _params) do
    render conn, "index.html"
  end
end
