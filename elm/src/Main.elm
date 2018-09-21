-- Read all about this program in the official Elm guide:
-- https://guide.elm-lang.org/architecture/user_input/forms.html


module Main exposing (..)

import Navigation exposing (Location)
import RemoteData exposing (WebData)
import Routing
import Model exposing (..)
import Views.Read exposing (readView)
import View
import Http
import Json.Decode as Decode
import Json.Decode.Pipeline exposing (decode, optional)


main : Program Never Model Msg
main =
    Navigation.program OnLocationChange
        { init = init
        , view = View.view
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
initialModel route =
    { status = ""
    , content = ""
    , route = route
    , posts = RemoteData.Loading
    }


updateContent : String -> Model -> Model
updateContent txt model =
    { model | content = txt }


updateStatus : String -> Model -> Model
updateStatus txt model =
    { model | status = txt }


addPost : Model -> Model
addPost model =
    { model | content = "", posts = (RemoteData.Success ((Post model.content "today") :: (Views.Read.maybeList model.posts))) }


removePost : Post -> Model -> Model
removePost ps model =
    updateStatus "removed"
        { model
            | posts = (RemoteData.Success (List.filter (\p -> p /= ps) (Views.Read.maybeList model.posts)))
        }


fetchData : Cmd Msg
fetchData =
    Http.get postEndpoint postsDecoder
        |> RemoteData.sendRequest
        |> Cmd.map OnFetchData


postEndpoint : String
postEndpoint =
    "http://localhost:4000/api/posts"


postsDecoder : Decode.Decoder (List Post)
postsDecoder =
    Decode.list postDecoder


postDecoder : Decode.Decoder Post
postDecoder =
    decode Post
        |> Json.Decode.Pipeline.optional "text" Decode.string ""
        |> Json.Decode.Pipeline.optional "updated_at" Decode.string ""


savePost : Post -> Http.Request Post
savePost post =
    Http.request
        { body = postEncoder post |> Http.jsonBody
        , headers = []
        , method = "POST"
        , timeout = Nothing
        , url = postEndpoint
        , withCredentials = False
        }


postEncoder : Post -> Encode.Value
postEncoder post =
    let
        attributes =
            [ ( "text", Encode.string post.text ) ]
    in
        Encode.object attributes


savePlayerCmd : Post -> Cmd Msg
savePlayerCmd post =
    savePlayerRequest player
        |> Http.send Msgs.OnPlayerSave


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
        OnFetchData data ->
            ( { model | status = "got data", posts = data }, Cmd.none )

        Delete p ->
            ( removePost p model, Cmd.none )

        Text content ->
            ( updateContent
                content
                (updateStatus "typing" model)
            , Cmd.none
            )

        Save ->
            ( addPost
                (updateStatus "saving" model)
            , postInput
            )

        SaveHttp (Ok post) ->
            ( model
            , Cmd.none
            )

        OnLocationChange location ->
            let
                newRoute =
                    Routing.parseLocation location
            in
                ( { model | route = newRoute }, Cmd.none )
