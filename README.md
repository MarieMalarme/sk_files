# SK Files

## Data extraction

Dataset of serial killers collected from [this Wikipedia article](https://en.wikipedia.org/wiki/List_of_serial_killers_by_number_of_victims) using the [MediaWiki API](https://www.mediawiki.org/wiki/MediaWiki):

1. Fetch the data from the API with [`parse` action](https://www.mediawiki.org/wiki/API:Parsing_wikitext#parse)
2. Parse the HTML tables containing all the data
3. Output data for each serial killer with the following info:

- Name: civil name or pseudonym of the serial killer
- Countries: countries where the crimes were committed
- Years active: dates - beginning & end (if known) - covering the period the crimes were committed
- Proven victims: number or range - minimum & maximum - of proven victims
- Possible victims: number or range - minimum & maximum - of possible victims
- Notes: quick description of the serial killer, the crimes & the judicial record
- Status: status of the case - proven or dipsuted
- Organisation: the type of organisation - solo or in group
- Medical professional: if the perpetrator was a medical professional
- Wikipedia article URL: link to the serial killer's Wikipedia article

#### Example of JSON results

```json
{
  "name": "Michael Swango",
  "countries": ["United States", "Zimbabwe"],
  "active_years": [1981, 1997],
  "proven_victims": [4],
  "possible_victims": [35, 60],
  "notes": "Medical Doctor who killed patients.",
  "status": "proven",
  "organisation": "solo",
  "medical_professional": true,
  "wikipedia_article_url": "https://en.wikipedia.org/wiki/Michael_Swango"
}
```

```json
{
  "name": "Juana Barraza",
  "countries": ["Mexico"],
  "active_years": [1990, 2006],
  "proven_victims": [11],
  "possible_victims": [29, 49],
  "notes": "Female wrestler who bludgeoned or strangled elderly women to rob them. Sentenced to 759 years.",
  "status": "proven",
  "organisation": "solo",
  "medical_professional": false,
  "wikipedia_article_url": "https://en.wikipedia.org/wiki/Juana_Barraza"
}
```
