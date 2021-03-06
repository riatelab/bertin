% Generated by roxygen2: do not edit by hand
% Please edit documentation in R/bt_functions.R
\name{bt_header}
\alias{bt_header}
\title{Header}
\usage{
bt_header(bertin, text, fontSize, ...)
}
\arguments{
\item{bertin}{map object}

\item{text}{text}

\item{fontSize}{font size}

\item{...}{other param}
}
\value{
a map object
}
\description{
Header
}
\examples{
library(sf)
mtq <- st_read(system.file("geojson/mtq.geojson", package = "bertin"), quiet = TRUE)
bt_param(margin = 10, width = 500, projection = "Winkel3") |>
  bt_layer(geojson = mtq, fill = "red") |>
  bt_header(text = "Title") |>
  bt_draw()
}
