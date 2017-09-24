-- Read all about this program in the official Elm guide:
-- https://guide.elm-lang.org/architecture/user_input/forms.html
module Main exposing (..)



import Html exposing (..)


import Navigation exposing (Location)
import RemoteData exposing (WebData)

import Routing
import Model exposing (..)
import Views.Post exposing (postView)
import Views.Read exposing (readView)

import Http
import Json.Decode as Decode
import Json.Decode.Pipeline exposing (decode, optional)





main : Program Never Model Msg
main =
    Navigation.program OnLocationChange
        { init = init
        , view = view
        , update = update
        , subscriptions = subscriptions
        }


init : Location -> ( Model, Cmd Msg )
init location =
    let
        currentRoute =
            Routing.parseLocation location
    in
        ( initialModel currentRoute, fetchData )

subscriptions : Model -> Sub Msg
subscriptions model =
    Sub.none


-- MODEL


initialModel : Route -> Model
initialModel route = {
  status = "",
  content = "",
  route = route,
  posts = RemoteData.Loading }


updateContent : String -> Model -> Model
updateContent txt model =
  { model | content = txt }

updateStatus : String -> Model -> Model
updateStatus txt model =
  { model | status = txt }

addPost : Model -> Model
addPost model =
  { model | content = "", posts =  (RemoteData.Success ((Post model.content "today") :: (Views.Read.maybeList model.posts))) }


removePost : Post -> Model -> Model
removePost ps model =
  updateStatus "removed" { model |
    posts = (RemoteData.Success (List.filter (\p -> p /= ps) (Views.Read.maybeList model.posts)))
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

    OnLocationChange location ->
            let
                newRoute =
                    Routing.parseLocation location
            in
                ( { model | route = newRoute }, Cmd.none )

view : Model -> Html Msg
view model =
    div []
        [ page model ]



page : Model -> Html Msg
page model =
    case model.route of
        ReadRoute ->
            readView model

        PostRoute  ->
            postView model

        NotFoundRoute ->
            notFoundView


notFoundView : Html msg
notFoundView =
    div []
        [ text "Not found"
        ]

