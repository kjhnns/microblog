module Views.Post exposing (..)

import Html exposing (..)
import Html.Attributes exposing (class, value, href)
import Html.Events exposing (onInput, onClick)
import Model


postView : Model.Model -> Html Model.Msg
postView model =
    div []
        [ textarea [ value model.content, onInput Model.Text, class "postText" ] []
        , input [ value model.status, class "postState" ] []
        , button [ onClick Model.Save, class "postButton" ] [ text "Save" ]
        ]
