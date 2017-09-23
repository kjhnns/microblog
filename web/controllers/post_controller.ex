defmodule Microblog.PostController do
    use Microblog.Web, :controller

    def index(conn, _params) do
        posts = Repo.all(Microblog.Post)
        json conn, posts
    end

    def create(conn, %{"text" => text} =_params) when is_bitstring(text) do
        newPost = %Microblog.Post{ text: text }
        case Repo.insert(newPost) do
            {:ok, post} ->
                conn
                |> put_status(:created)
                |> json(post)
            {:error, newPost} ->
                conn
                |> put_status(:unprocessable_entity)
                |> json(newPost)

        end
    end

end
