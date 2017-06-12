defmodule Microblog.PostController do
    use Microblog.Web, :controller

    def index(conn, _params) do
        posts = Repo.all(Microblog.Post)
        json conn, posts
    end

end
