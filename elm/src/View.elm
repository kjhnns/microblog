module View exposing (..)

import Model
import Html exposing (..)
import Html.Attributes exposing (class, value, href)
import Html.Events exposing (onInput, onClick)
import Views.Post
import Views.Read


view : Model.Model -> Html Model.Msg
view model =
    div []
        [ page model ]


page : Model.Model -> Html Model.Msg
page model =
    case model.route of
        Model.ReadRoute ->
            Views.Read.readView model

        Model.PostRoute ->
            Views.Post.postView model

        Model.NotFoundRoute ->
            notFoundView


notFoundView : Html msg
notFoundView =
    div []
        [ text "Not found"
        ]
