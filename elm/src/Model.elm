module Model exposing (..)

import RemoteData exposing (WebData)
import Navigation exposing (Location)
import Http


type Route
    = ReadRoute
    | PostRoute
    | NotFoundRoute


type alias Model =
    { status : String
    , content : String
    , posts : WebData (List Post)
    , route : Route
    }


type alias Post =
    { text : String
    , timeStp : String
    }


type Msg
    = Text String
    | Delete Post
    | Save
    | SaveHttp (Result Http.Error Post)
    | OnFetchData (WebData (List Post))
    | OnLocationChange Location
