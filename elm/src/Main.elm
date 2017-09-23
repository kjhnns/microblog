-- Read all about this program in the official Elm guide:
-- https://guide.elm-lang.org/architecture/user_input/forms.html

import Html exposing (..)
import Html.Attributes exposing (..)
import Html.Events exposing (onInput, onClick)

--import Http
--import Json.Decode as Decode


main : Program Never Model Msg
main =
  Html.beginnerProgram
    { model = emptyModel
    , view = view
    , update = update
    }


-- MODEL

type alias Model =
  { status : String
  , content : String
  , posts: List Post
  }

type alias Post =
  {   content : String
  ,   time : String
  }

type Msg
  = Text String
  | Delete Post
  | Save


emptyModel : Model
emptyModel = {
  status = "",
  content = "",
  posts = [] }


updateContent : String -> Model -> Model
updateContent txt model =
  Model
    model.status
    txt
    model.posts

updateStatus : String -> Model -> Model
updateStatus txt model =
  Model
    txt
    model.content
    model.posts

addPost : Model -> Model
addPost model =
  Model
    model.status
    ""
    ((Post model.content "today") :: model.posts)

removePost : Post -> Model -> Model
removePost ps model =
  updateStatus "removed" { model |
    posts = (List.filter (\p -> p /= ps) model.posts)
  }



update : Msg -> Model -> Model
update msg model =
  case msg of
    Delete p ->
      removePost p model

    Text content ->
      updateContent
        content
        (updateStatus "typing" model)

    Save ->
      addPost
        (updateStatus "saving" model)


renderList : List Post -> Html Msg
renderList lst =
      List.map (\l ->
                Html.li []
                [ div [] [ text  l.content ]
                , div [] [text l.time]
                , a [ onClick (Delete l) ][ text "delete "]
                ])
        lst
      |> Html.ul [ style [ ("background", "yellow") ] ]



-- VIEW
view : Model -> Html Msg
view model =
  div []
    [ textarea [ value model.content, onInput Text, class "postText" ] [ ]
    , input [ value model.status, class "postState" ] []
    , button [ onClick Save, class "postButton" ] [ text "Save" ]
    , renderList model.posts
    ]





-- HTTP


--postPost : Post -> Http.Request (List String)
--postPost post =
--  Http.post "/api/posts" Http.emptyBody (list string)

