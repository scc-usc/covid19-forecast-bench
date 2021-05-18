import pandas as pd
import numpy as np
import datetime

EU_REGIONS = [
  "Belgium",
  "Bulgaria",
  "Czechia",
  "Denmark",
  "Germany",
  "Estonia",
  "Ireland",
  "Greece",
  "Spain",
  "France",
  "Croatia",
  "Italy",
  "Cyprus",
  "Latvia",
  "Lithuania",
  "Luxembourg",
  "Hungary",
  "Malta",
  "Netherlands",
  "Austria",
  "Poland",
  "Portugal",
  "Romania",
  "Slovenia",
  "Slovakia",
  "Finland",
  "Sweden",
  "United Kingdom",
  "Iceland",
  "Liechtenstein",
  "Norway",
  "Switzerland",
];

DAY_ZERO = datetime.datetime(2020, 1, 22)
TODAY = datetime.datetime.combine(datetime.date.today(), datetime.datetime.min.time())

