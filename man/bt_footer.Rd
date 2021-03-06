% Generated by roxygen2: do not edit by hand
% Please edit documentation in R/bt_functions.R
\name{bt_footer}
\alias{bt_footer}
\title{Footer}
\usage{
bt_footer(bertin, text, fontSize, ...)
}
\arguments{
\item{bertin}{bertin}

\item{text}{text}

\item{fontSize}{fontSize}

\item{...}{other}
}
\value{
a map object
}
\description{
Footer
}
\examples{
library(sf)
mtq <- st_read(system.file("geojson/mtq.geojson", package = "bertin"), quiet = TRUE)
bt_param(margin = 10, width = 500, projection = "Winkel3") |>
  bt_layer(geojson = mtq, fill = "red") |>
  bt_footer(text = "Title") |>
  bt_draw()
}
