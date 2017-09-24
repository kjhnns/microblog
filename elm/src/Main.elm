-- Read all about this program in the official Elm guide:
-- https://guide.elm-lang.org/architecture/user_input/forms.html

import Html exposing (..)
import Html.Attributes exposing (..)
import Html.Events exposing (onInput, onClick)


import RemoteData exposing (WebData)


import Http
import Json.Decode as Decode
import Json.Decode.Pipeline exposing (decode, optional)




main : Program Never Model Msg
main =
    program
        { init = init
        , view = view
        , update = update
        , subscriptions = subscriptions
        }


init : ( Model, Cmd Msg )
init =
    ( emptyModel, fetchData )


subscriptions : Model -> Sub Msg
subscriptions model =
    Sub.none


-- MODEL

type alias Model =
  { status : String
  , content : String
  , posts: WebData (List Post)
  }

type alias Post =
  {   text : String
  ,   updated_at : String
  }

type Msg
  = Text String
  | Delete Post
  | Save
  | OnFetchData (WebData (List Post))


emptyModel : Model
emptyModel = {
  status = "",
  content = "",
  posts = RemoteData.Loading }


updateContent : String -> Model -> Model
updateContent txt model =
  { model | content = txt }

updateStatus : String -> Model -> Model
updateStatus txt model =
  { model | status = txt }

addPost : Model -> Model
addPost model =
  { model | content = "", posts =  (RemoteData.Success ((Post model.content "today") :: (maybeList model.posts))) }


removePost : Post -> Model -> Model
removePost ps model =
  updateStatus "removed" { model |
    posts = (RemoteData.Success (List.filter (\p -> p /= ps) (maybeList model.posts)))
  }


fetchData : Cmd Msg
fetchData =
    Http.get fetchPostUrl postsDecoder
        |> RemoteData.sendRequest
        |> Cmd.map OnFetchData



fetchPostUrl : String
fetchPostUrl =
    "http://localhost:4000/api/posts"


postsDecoder : Decode.Decoder (List Post)
postsDecoder =
    Decode.list postDecoder


postDecoder : Decode.Decoder Post
postDecoder =
    decode Post
        |> Json.Decode.Pipeline.optional "text" Decode.string ""
        |> Json.Decode.Pipeline.optional "updated_at" Decode.string ""


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
  case msg of
    OnFetchData data ->
      ({ model | status ="got data", posts = data }, Cmd.none)

    Delete p ->
      (removePost p model, Cmd.none)

    Text content ->
      (updateContent
        content
        (updateStatus "typing" model)
        , Cmd.none)

    Save ->
      (addPost
        (updateStatus "saving" model)
        , Cmd.none)


renderList : WebData (List Post) -> Html Msg
renderList lst =
      List.map (\l ->
                Html.li []
                [ div [] [ text  l.text ]
                , div [] [text l.updated_at]
                , a [ onClick (Delete l) ][ text "delete "]
                ])
        (maybeList lst)
      |> Html.ul [ style [ ("background", "yellow") ] ]

errorMessage : Http.Error -> String
errorMessage error =
  case error of
    Http.Timeout ->
      "Timeout"
    Http.NetworkError  ->
      "Network Error"
    Http.BadUrl status ->
      ("BadUrl" ++ status)
    Http.BadPayload a b ->
      ("Http.BadPayload"++a)
    Http.BadStatus status ->
      ("Http.BadStatus" )

maybeList : WebData (List Post) -> List Post
maybeList response =
    case response of
        RemoteData.Success posts ->
            posts
        RemoteData.Loading ->
          [Post "loading" "now"]
        RemoteData.NotAsked ->
          [Post "NotAsked" "now"]
        RemoteData.Failure err ->
          [Post ("Sth Went Wrong" ++ (errorMessage err)) "now"]


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

