module Routing exposing (..)

import Navigation exposing (Location)
import UrlParser exposing (..)

import Model exposing (..)


matchers : Parser (Route -> a) a
matchers =
    oneOf
        [ map ReadRoute top
        , map PostRoute (s "post")
        ]


parseLocation : Location -> Route
parseLocation location =
    case (parseHash matchers location) of
        Just route ->
            route

        Nothing ->
            NotFoundRoute


