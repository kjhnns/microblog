defmodule Microblog.Post do

    use Microblog.Web, :model
    schema "posts" do
        field :text, :string
        timestamps
    end
end
