# Russell 3000 Symbols/Tickers

These were parsed into JSON with the symbols/tickers as keys
and the company names as values. The library pdf-parse was used
to do the parsing and I cleaned it up by hand afterwards.

Two things to note:

  1) I cut the last page off of the PDF because it was only
     financial disclosures and not symbols/companies. If you don't
     use my 32 page pdf included in this repo, make sure to remove
     any unnecessary pages
  2) The total amount of companies in this JSON file is more than
     3000, which seems strange because it's the Russell *3000*, but
     I don't know enough about the index to determine if thats
     normal or not. I don't think I accidentally removed or added any
     companies while cleaning the data, but you should double check.
     It seems reasonable though that the index won't always include
     exactly 3000 companies at various points throughout the year
     as the fund is constantly rebalancing its portfolio.