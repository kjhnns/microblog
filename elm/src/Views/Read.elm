module Views.Read exposing (..)

import Html exposing (..)
import Html.Attributes exposing (..)
import Html.Events exposing (onInput, onClick)


import Http
import RemoteData exposing (WebData)


import Model exposing (..)

-- VIEW
readView : Model -> Html Msg
readView model =
  div []
    [ textarea [ value model.content, onInput Text, class "postText" ] [ ]
    , input [ value model.status, class "postState" ] []
    , button [ onClick Save, class "postButton" ] [ text "Save" ]
    , renderList model.posts
    ]



renderList : WebData (List Post) -> Html Msg
renderList lst =
      List.map (\l ->
                Html.li []
                [ div [] [ text  l.text ]
                , div [] [text l.timeStp]
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



